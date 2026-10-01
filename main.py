# ==============================================================================
# 项目名称：智馨家园 · 掌控板 2.0 全屋智能沙盘控制系统 (V2.1 I2C键盘+真实引脚旗舰版)
# 运行环境：ESP32 MicroPython (mPython 固件)
# 核心外设 (盛思掌控拓展板真实引脚完美映射):
#   - 3×4 矩阵智能键盘：I2C 专用总线接口 (SCL=P19, SDA=P20, 地址 0x20/0x27/0x38 自动探测)
#   - 入户大门 SG90 舵机：P0 门梁顶置同心直驱 (5V 独立供电)
#   - DHT11 温湿度传感器：P1 单总线
#   - 客厅实体高亮吊灯：P2 (高电平开灯，低电平关灯)
#   - 智能微型排风扇：P3 (声控启停 + 温度>28℃且有人 双重温控自动排风)
#   - PIR 人体红外传感器：P5 数字电平输入 (室内有人判定 + 离家布防防盗)
#   - 离线语音识别模块 (ASR01/HLK-V20)：P6 (RX), P7 (TX) UART1 波特率 9600
#   - 板载：1.3寸 OLED (I2C)、WS2812 RGB 灯、蜂鸣器、ESP32 AP 热点 (192.168.4.1)
#   - 拓展板空闲备用引脚：P11, P13, P14, P15, P16 (整整5个高扩展引脚！)
# ==============================================================================

import time
import network
import socket
import dht
from mpython import *
from machine import PWM, Pin, UART, I2C

# ----------------- 1. 硬件外设与引脚初始化 -----------------
# 门舵机 P0 (PWM 50Hz)
servo_pin = Pin(0, Pin.OUT)
servo_pwm = PWM(servo_pin, freq=50)

# 客厅吊灯 P16 (全功能双向GPIO输出)
light_pin = Pin(16, Pin.OUT)
light_pin.value(0)

# 探测并初始化 Parrot 拓展板板载 M1 直流电机驱动 (两线黄/橙裸电机)
try:
    import parrot
    HAS_PARROT = True
    parrot.set_speed(parrot.MOTOR_1, 0)
except Exception:
    HAS_PARROT = False

# 温湿度 P1 与 人体红外 P5 (P5为标准输入引脚，完美契合PIR)
dht_dev = dht.DHT11(Pin(1))
pir_sensor = Pin(5, Pin.IN)

# 离线语音模块串口 UART1 (P6: RX, P7: TX)
uart_voice = UART(1, baudrate=9600, rx=Pin(6), tx=Pin(7))

# ----------------- 2. I2C 3×4 矩阵键盘驱动 -----------------
# 掌控板 I2C 接口：SCL=19, SDA=20
# 支持标准 PCF8574 / TCA8574 矩阵键盘模块 (常见地址 0x20, 0x27, 0x38, 0x3F)
i2c_bus = I2C(scl=Pin(19), sda=Pin(20), freq=100000)

KEYPAD_I2C_ADDR = None
POSSIBLE_ADDRS = [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x38, 0x39, 0x3F]

# 探测 I2C 设备
scanned_devices = i2c_bus.scan()
print("I2C 总线已扫描到设备地址:", [hex(a) for a in scanned_devices])
for addr in POSSIBLE_ADDRS:
    if addr in scanned_devices and addr != 0x3C: # 0x3C 通常是板载 OLED
        KEYPAD_I2C_ADDR = addr
        print("锁定 I2C 矩阵键盘地址: ", hex(KEYPAD_I2C_ADDR))
        break

if not KEYPAD_I2C_ADDR:
    KEYPAD_I2C_ADDR = 0x20 # 默认候选地址

KEY_MAP_3x4 = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

def scan_i2c_keypad():
    """读取 I2C 矩阵键盘 (4行低4位，3列高4位 或 4行高4位，3列低4位兼容扫描)"""
    if KEYPAD_I2C_ADDR not in scanned_devices:
        return None
    try:
        # PCF8574 逐列发送低电平扫描
        col_masks = [0b11111110, 0b11111101, 0b11111011] # 对应低3位或高3位
        for col_idx in range(3):
            # 激活对应列 (例如输出 0)，其余引脚设为 1 上拉
            out_byte = (0xFF ^ (1 << (col_idx + 4))) # 列接在 P4, P5, P6
            i2c_bus.writeto(KEYPAD_I2C_ADDR, bytearray([out_byte]))
            time.sleep_us(30)
            in_data = i2c_bus.readfrom(KEYPAD_I2C_ADDR, 1)[0]
            
            # 检测低 4 位行 (P0~P3)
            for row_idx in range(4):
                if not (in_data & (1 << row_idx)):
                    # 恢复高电平
                    i2c_bus.writeto(KEYPAD_I2C_ADDR, b'\xFF')
                    return KEY_MAP_3x4[row_idx][col_idx]
                    
        # 兼容反向引脚接法 (列接 P0~P2，行接 P4~P7)
        for col_idx in range(3):
            out_byte = (0xFF ^ (1 << col_idx))
            i2c_bus.writeto(KEYPAD_I2C_ADDR, bytearray([out_byte]))
            time.sleep_us(30)
            in_data = i2c_bus.readfrom(KEYPAD_I2C_ADDR, 1)[0]
            for row_idx in range(4):
                if not (in_data & (1 << (row_idx + 4))):
                    i2c_bus.writeto(KEYPAD_I2C_ADDR, b'\xFF')
                    return KEY_MAP_3x4[row_idx][col_idx]
                    
        i2c_bus.writeto(KEYPAD_I2C_ADDR, b'\xFF')
    except Exception:
        pass
    return None

# ----------------- 3. 系统全局运行状态 -----------------
current_pwd = "123456"
input_buffer = ""
wrong_attempts = 0
is_armed = False
is_alarm_active = False
door_is_open = False
light_is_on = False
fan_is_on = False
auto_fan_active = False
curr_temp = 24.5
curr_hum = 52.0

last_sensor_time = 0
last_key_press_time = 0
button_a_press_start = 0
voice_feedback_str = "系统就绪 监听语音"
is_modifying_pwd = False
modify_step = 0

def set_servo_angle(angle):
    """设置舵机旋转角度 0~180°"""
    angle = max(0, min(180, angle))
    duty = int(26 + (angle / 180.0) * 102)
    servo_pwm.duty(duty)

def set_light(state):
    """控制客厅实体吸顶吊灯 (P16)"""
    global light_is_on
    light_is_on = state
    light_pin.value(1 if state else 0)
    refresh_dashboard()

def set_fan(state, is_auto=False):
    """控制智能微型排风扇 (Parrot M1 直流电机驱动)"""
    global fan_is_on, auto_fan_active
    fan_is_on = state
    auto_fan_active = is_auto
    if HAS_PARROT:
        try:
            parrot.set_speed(parrot.MOTOR_1, 85 if state else 0)
        except Exception:
            pass
    refresh_dashboard()

def open_door_action():
    """密码验证通过开门动作 (90度开门，4秒自动关门)"""
    global door_is_open, wrong_attempts, is_armed, is_alarm_active
    wrong_attempts = 0
    is_armed = False
    is_alarm_active = False
    
    oled.fill(0)
    oled.DispChar("★ 密码验证通过 ★", 16, 12)
    oled.DispChar("欢迎回家! 门已开启", 12, 32)
    oled.show()
    
    rgb.fill((200, 160, 0)) # 暖黄迎宾
    rgb.write()
    
    try:
        buzzer.pitch(523, 80)
        time.sleep_ms(30)
        buzzer.pitch(659, 120)
    except:
        pass
        
    set_servo_angle(90)
    door_is_open = True
    time.sleep(4)
    close_door_action()

def close_door_action():
    """自动关门动作"""
    global door_is_open
    set_servo_angle(0)
    door_is_open = False
    rgb.fill((0, 0, 0))
    rgb.write()
    refresh_dashboard()

def trigger_security_alarm(reason="入侵人员靠近"):
    """触发防盗警报 (红蓝爆闪+警笛)"""
    global is_alarm_active
    is_alarm_active = True
    oled.fill(0)
    oled.DispChar("! 警报: " + reason + " !", 0, 14)
    oled.DispChar("已锁定门禁 声光报警中", 0, 34)
    oled.show()
    
    for _ in range(3):
        rgb.fill((255, 0, 0))
        rgb.write()
        try: buzzer.pitch(950, 150)
        except: pass
        time.sleep_ms(140)
        
        rgb.fill((0, 0, 255))
        rgb.write()
        try: buzzer.pitch(650, 150)
        except: pass
        time.sleep_ms(140)
        
    rgb.fill((0, 0, 0))
    rgb.write()
    refresh_dashboard()

def refresh_dashboard():
    """刷新 1.3寸 OLED 显示屏 (展示门/灯/扇/温湿全状态)"""
    oled.fill(0)
    if is_armed:
        oled.DispChar("【智馨家园·离家布防】", 0, 0)
    else:
        oled.DispChar("【智馨家园·控制中心】", 0, 0)
        
    # 第一行：温湿度 + 双重高温排风标识
    temp_str = "{:.1f}C/{}%".format(curr_temp, int(curr_hum))
    if curr_temp > 28.0 and pir_sensor.value() == 1:
        temp_str += " [高温排风]"
    oled.DispChar(temp_str, 0, 16)
    
    # 第二行：语音提示或密码掩码
    if is_modifying_pwd:
        oled.DispChar("改密中: " + "*" * len(input_buffer), 0, 32)
    elif len(input_buffer) > 0:
        oled.DispChar("密码: [" + "*" * len(input_buffer) + "]", 0, 32)
    else:
        oled.DispChar("语音: " + voice_feedback_str, 0, 32)
        
    # 第三行：全屋受控设备简况
    status_line = "门:{}|灯:{}|扇:{}".format(
        "开" if door_is_open else "关",
        "亮" if light_is_on else "灭",
        "转" if fan_is_on else "停"
    )
    oled.DispChar(status_line, 0, 48)
    oled.show()

# ----------------- 4. 启动 AP 本地局域网热点 -----------------
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid='SmartHome-IoT', authmode=network.AUTH_OPEN)
print("掌控板 Wi-Fi AP 启动! SSID: SmartHome-IoT, IP: 192.168.4.1")

web_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
web_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
web_socket.bind(('192.168.4.1', 80))
web_socket.listen(2)
web_socket.settimeout(0.03)

HTML_PAGE = """<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>智馨家园控制台</title><style>body{{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:12px;margin:0}}h2{{color:#38bdf8;margin:6px 0}}.card{{background:#1e293b;border-radius:12px;padding:12px;margin-bottom:10px}}.btn{{display:inline-block;width:88%;padding:12px;margin:5px 0;font-size:15px;font-weight:bold;color:#fff;background:#2563eb;border:none;border-radius:8px;text-decoration:none;cursor:pointer}}.btn-active{{background:#10b981}}.btn-warning{{background:#f59e0b}}.btn-purple{{background:#8b5cf6}}.val{{font-size:22px;font-weight:bold;color:#4ade80}}input{{padding:10px;border-radius:6px;border:1px solid #475569;width:75%;margin:6px 0;background:#0f172a;color:#fff;text-align:center;font-size:16px}}</style></head><body><h2>🏡 智馨家园 · 全屋控制中心</h2><p style="color:#94a3b8;font-size:11px">AP直连: SmartHome-IoT | I2C键盘+语音版</p><div class="card"><p>室内实时温湿度</p><div class="val">{:.1f}℃ / {:.1f}%</div><p style="font-size:11px;color:#94a3b8">大于28℃且室内有人感应时自动开启排风</p></div><div class="card"><p>智能灯光与电扇 (实时状态)</p><a href="/toggle_light" class="btn {}">客厅吊灯(P2): {}</a><a href="/toggle_fan" class="btn {}">智能排风扇(P3): {}</a></div><div class="card"><p>智能门禁与安防 (当前门: {})</p><a href="/open" class="btn">★ 手机一键远程开门 (90°)</a><a href="/arm" class="btn btn-warning">切换【离家布防模式】</a></div><div class="card"><p>在线修改门禁密码 (当前: {})</p><form action="/setpwd" method="GET"><input type="text" name="pwd" placeholder="输入6位新密码" maxlength="6"><br><button type="submit" class="btn btn-purple">确认更新密码</button></form></div></body></html>"""

# 初始舵机与显示归位
set_servo_angle(0)
refresh_dashboard()
print("系统启动就绪，正在监听 I2C 矩阵键盘、离线语音 UART (P6/P7) 与手机 AP Web 请求...")

# 离线语音识别口令映射表
VOICE_CMDS = {
    b'LIGHT_ON': "打开客厅灯",
    b'LIGHT_OFF': "关闭客厅灯",
    b'FAN_ON': "打开风扇",
    b'FAN_OFF': "关闭风扇",
    b'\x01': "打开客厅灯",
    b'\x02': "关闭客厅灯",
    b'\x03': "打开风扇",
    b'\x04': "关闭风扇"
}

while True:
    now = time.ticks_ms()
    
    # ---------------- 0. 掌控板 A 键长按 6 秒硬核复位 (赛场安全气囊) ----------------
    if button_a.value() == 0:
        if button_a_press_start == 0:
            button_a_press_start = now
        elapsed_ms = time.ticks_diff(now, button_a_press_start)
        
        if elapsed_ms >= 6000:
            button_a_press_start = 0
            current_pwd = "123456"
            wrong_attempts = 0
            is_armed = False
            is_alarm_active = False
            is_modifying_pwd = False
            input_buffer = ""
            set_servo_angle(0)
            door_is_open = False
            set_light(False)
            set_fan(False)
            
            try: buzzer.pitch(1000, 600)
            except: pass
            rgb.fill((0, 255, 0))
            rgb.write()
            oled.fill(0)
            oled.DispChar("★ 系统已硬核复位 ★", 10, 15)
            oled.DispChar("恢复出厂密码: 123456", 8, 35)
            oled.show()
            time.sleep(2)
            rgb.fill((0, 0, 0))
            rgb.write()
            refresh_dashboard()
        elif elapsed_ms > 1000:
            rem_sec = (6000 - elapsed_ms) // 1000 + 1
            oled.fill(0)
            oled.DispChar("! 恢复出厂设置中 !", 12, 15)
            oled.DispChar("按住A键不放: {} 秒...".format(rem_sec), 10, 35)
            oled.show()
    else:
        if button_a_press_start != 0:
            button_a_press_start = 0
            refresh_dashboard()

    # ---------------- 1. 离线语音识别模块串口 (UART1: P6/P7) 监听 ----------------
    if uart_voice.any():
        raw_v = uart_voice.read()
        cmd_matched = None
        for k, v in VOICE_CMDS.items():
            if k in raw_v:
                cmd_matched = v
                break
                
        if cmd_matched == "打开客厅灯":
            set_light(True)
            voice_feedback_str = "语音:客厅灯已开"
            try: buzzer.pitch(880, 80)
            except: pass
        elif cmd_matched == "关闭客厅灯":
            set_light(False)
            voice_feedback_str = "语音:客厅灯已关"
            try: buzzer.pitch(660, 80)
            except: pass
        elif cmd_matched == "打开风扇":
            set_fan(True)
            voice_feedback_str = "语音:风扇已开启"
            try: buzzer.pitch(1000, 80)
            except: pass
        elif cmd_matched == "关闭风扇":
            set_fan(False)
            voice_feedback_str = "语音:风扇已关闭"
            try: buzzer.pitch(500, 80)
            except: pass
        refresh_dashboard()

    # ---------------- 2. I2C 3×4 矩阵键盘扫描 ----------------
    key = scan_i2c_keypad()
    if key and time.ticks_diff(now, last_key_press_time) > 280:
        last_key_press_time = now
        try: buzzer.pitch(800, 35)
        except: pass
            
        if key.isdigit():
            if len(input_buffer) < 6:
                input_buffer += key
                refresh_dashboard()
        elif key == '*':
            if len(input_buffer) > 0:
                input_buffer = ""
                is_modifying_pwd = False
                refresh_dashboard()
            else:
                is_modifying_pwd = True
                modify_step = 1
                input_buffer = ""
                oled.fill(0)
                oled.DispChar("【修改门禁密码】", 16, 12)
                oled.DispChar("请输原密码并按#", 12, 32)
                oled.show()
                time.sleep(1)
                refresh_dashboard()
        elif key == '#':
            if is_modifying_pwd:
                if modify_step == 1:
                    if input_buffer == current_pwd:
                        modify_step = 2
                        input_buffer = ""
                        oled.fill(0)
                        oled.DispChar("原密码验证成功!", 16, 15)
                        oled.DispChar("请输6位新密码按#", 10, 35)
                        oled.show()
                        try: buzzer.pitch(800, 100)
                        except: pass
                        time.sleep(1.2)
                    else:
                        oled.fill(0)
                        oled.DispChar("原密码错误!", 28, 18)
                        oled.DispChar("退出修改流程", 24, 38)
                        oled.show()
                        try: buzzer.pitch(350, 300)
                        except: pass
                        time.sleep(1.2)
                        is_modifying_pwd = False
                        input_buffer = ""
                    refresh_dashboard()
                elif modify_step == 2:
                    if len(input_buffer) == 6 and input_buffer.isdigit():
                        current_pwd = input_buffer
                        oled.fill(0)
                        oled.DispChar("★ 密码修改成功 ★", 10, 15)
                        oled.DispChar("新密码: " + current_pwd, 16, 35)
                        oled.show()
                        try: buzzer.pitch(1000, 200)
                        except: pass
                        time.sleep(1.5)
                    is_modifying_pwd = False
                    input_buffer = ""
                    refresh_dashboard()
            else:
                if input_buffer == current_pwd:
                    input_buffer = ""
                    open_door_action()
                else:
                    wrong_attempts += 1
                    input_buffer = ""
                    if wrong_attempts >= 3:
                        trigger_security_alarm("密码连续输错3次锁定")
                        wrong_attempts = 0
                    else:
                        oled.fill(0)
                        oled.DispChar("✘ 密码错误 ✘", 24, 18)
                        oled.DispChar("剩余尝试: {} 次".format(3 - wrong_attempts), 16, 36)
                        oled.show()
                        try: buzzer.pitch(400, 200)
                        except: pass
                        time.sleep(1.2)
                        refresh_dashboard()
                        
    # ---------------- 3. 防盗报警检测 (离家布防下 PIR P5 人体红外入侵) ----------------
    if is_armed and pir_sensor.value() == 1 and not is_alarm_active and not door_is_open:
        trigger_security_alarm("离家布防-人体入侵")
        
    # ---------------- 4. 定时采集 DHT11 温湿度与 双重高温排风 (P3) ----------------
    if time.ticks_diff(now, last_sensor_time) > 2000:
        last_sensor_time = now
        try:
            dht_dev.measure()
            curr_temp = dht_dev.temperature()
            curr_hum = dht_dev.humidity()
        except Exception:
            pass
            
        # 智能温控排风联动 (双重与条件：温度 > 28℃ 且 屋内有人 pir_sensor.value() == 1)
        human_present = (pir_sensor.value() == 1)
        if curr_temp > 28.0 and human_present:
            if not fan_is_on:
                set_fan(True, is_auto=True)
                voice_feedback_str = "高温有人>28C 自动排风"
        elif auto_fan_active:
            # 当温度降到 27.5℃ 以下，或者人离开后，自动关闭排风
            if curr_temp <= 27.5 or not human_present:
                set_fan(False, is_auto=False)
                voice_feedback_str = "无人或温降 排风关闭"
            
        if not is_alarm_active:
            refresh_dashboard()
            
    # ---------------- 5. 手机 Web 控制台请求处理 (三方实时同步) ----------------
    try:
        conn, addr = web_socket.accept()
        req = conn.recv(1024).decode('utf-8')
        
        if "GET /open" in req:
            open_door_action()
        elif "GET /toggle_light" in req:
            set_light(not light_is_on)
        elif "GET /toggle_fan" in req:
            set_fan(not fan_is_on)
        elif "GET /arm" in req:
            is_armed = not is_armed
            is_alarm_active = False
            refresh_dashboard()
        elif "GET /setpwd?pwd=" in req:
            try:
                new_pwd = req.split("pwd=")[1].split(" ")[0].split("&")[0]
                if len(new_pwd) == 6 and new_pwd.isdigit():
                    current_pwd = new_pwd
                    oled.fill(0)
                    oled.DispChar("手机已更新密码!", 14, 20)
                    oled.DispChar("新密码: " + current_pwd, 16, 38)
                    oled.show()
                    time.sleep(1.2)
                    refresh_dashboard()
            except:
                pass
                
        door_str = "已开启 (90°)" if door_is_open else "已关闭"
        btn_light_cls = "btn-active" if light_is_on else ""
        btn_light_txt = "开启中 (点此关闭)" if light_is_on else "已关闭 (点此点亮)"
        btn_fan_cls = "btn-active" if fan_is_on else ""
        btn_fan_txt = "吹风中 (点此停转)" if fan_is_on else "已关闭 (点此启动)"
        
        resp = HTML_PAGE.format(
            curr_temp, curr_hum,
            btn_light_cls, btn_light_txt,
            btn_fan_cls, btn_fan_txt,
            door_str, current_pwd
        )
        conn.send('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n' + resp)
        conn.close()
    except OSError:
        pass
        
    time.sleep_ms(25)
