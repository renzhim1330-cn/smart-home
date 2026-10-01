# ==============================================================================
# 单元测试 4B：智能微型排风扇 (Parrot M1) 深度兼容按键与触摸调速测试
# ==============================================================================
from mpython import *
import time
import parrot
from machine import Pin

# 1. 物理引脚直读定义 (掌控板标准：A键=GPIO35, B键=GPIO27)
pin_btn_a = Pin(35, Pin.IN)
pin_btn_b = Pin(27, Pin.IN)

# 2. 预设 4 个风速档位
GEAR_NAMES = ["【0档】停转关闭", "【1档】35% 静音微风", "【2档】65% 自然清风", "【3档】100% 强力狂风"]
GEAR_SPEEDS = [0, 35, 65, 100]

current_gear = 0
is_forward = True

def get_btn_a():
    """多通道融合检测：物理A键 + 触摸P键 + 固件库"""
    # 通道 1: 物理 Pin35 (按下为0)
    try:
        if pin_btn_a.value() == 0:
            return True
    except: pass
    # 通道 2: 官方对象 is_pressed
    try:
        if button_a.is_pressed():
            return True
    except: pass
    # 通道 3: 底部金色 P 触摸板 (辅助触发)
    try:
        if touchPad_p.read() < 500:
            return True
    except: pass
    return False

def get_btn_b():
    """多通道融合检测：物理B键 + 触摸N键 + 固件库"""
    # 通道 1: 物理 Pin27 (按下为0)
    try:
        if pin_btn_b.value() == 0:
            return True
    except: pass
    # 通道 2: 官方对象 is_pressed
    try:
        if button_b.is_pressed():
            return True
    except: pass
    # 通道 3: 底部金色 N 触摸板 (辅助触发)
    try:
        if touchPad_n.read() < 500:
            return True
    except: pass
    return False

def apply_fan():
    base_spd = GEAR_SPEEDS[current_gear]
    actual_spd = base_spd if is_forward else -base_spd
    try:
        parrot.set_speed(parrot.MOTOR_1, actual_spd)
    except Exception as e:
        print("驱动异常:", e)
        
    oled.fill(0)
    oled.DispChar("★ 风扇按键调速系统 ★", 5, 0)
    oled.DispChar(GEAR_NAMES[current_gear], 5, 20)
    
    if current_gear == 0:
        oled.DispChar("按 A 键 / 摸 P ➔ 启动", 5, 38)
    else:
        dir_txt = "风向: 正向排风" if is_forward else "风向: 反向抽风"
        oled.DispChar(dir_txt, 10, 38)
        
    # 底部档位条
    bar_w = int(current_gear * (110 / 3))
    oled.rect(5, 54, 118, 8, 1)
    if bar_w > 0:
        oled.fill_rect(7, 56, bar_w, 4, 1)
    oled.show()

# 初始上电停转
apply_fan()

print("==================================================")
print(">>> 【掌控板风扇多路按键测试程序】启动成功！")
print(">>> 当前档位：0 档停转（绝对不会自动变速）")
print(">>> 控制方式：")
print("    1. 按掌控板正面的【A 键】或摸底部金色【P 触控点】➔ 换挡/停转")
print("    2. 按掌控板正面的【B 键】或摸底部金色【N 触控点】➔ 反转风向")
print("==================================================")

while True:
    # 检查 A 键或 P 触控
    if get_btn_a():
        current_gear = (current_gear + 1) % len(GEAR_SPEEDS)
        print(">>> 成功捕获 A 键操作！当前切换为:", GEAR_NAMES[current_gear])
        if current_gear == 0:
            try: buzzer.pitch(500, 150)
            except: pass
        else:
            try: buzzer.pitch(800 + current_gear * 200, 80)
            except: pass
        apply_fan()
        time.sleep(0.4)  # 消除物理抖动
        
    # 检查 B 键或 N 触控
    if get_btn_b():
        is_forward = not is_forward
        print(">>> 成功捕获 B 键操作！切换风向:", "正向排风" if is_forward else "反向抽风")
        try: buzzer.pitch(1400, 100)
        except: pass
        apply_fan()
        time.sleep(0.4)  # 消除物理抖动
        
    time.sleep(0.02)
