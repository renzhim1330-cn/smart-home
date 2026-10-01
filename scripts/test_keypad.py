# ==============================================================================
# 单元测试 1：3×4 矩阵键盘 (I2C 总线接口 SCL=P19, SDA=P20) 测试
# 用途：测试 I2C 接口矩阵键盘是否能被正常扫描识别，验证 12 个键位与出厂密码 123456#
#
# 【3×4 薄膜键盘与 PCF8574 扩展模块接线指引】
# 1. 键盘 7 根排线 (从左到右 1~7) 顺次直插 PCF8574 的 P0~P6 引脚：
#    - Pin 1 (行1: 1,2,3) -> PCF8574 的 P0
#    - Pin 2 (行2: 4,5,6) -> PCF8574 的 P1
#    - Pin 3 (行3: 7,8,9) -> PCF8574 的 P2
#    - Pin 4 (行4: *,0,#) -> PCF8574 的 P3
#    - Pin 5 (列1: 1,4,7,*) -> PCF8574 的 P4
#    - Pin 6 (列2: 2,5,8,0) -> PCF8574 的 P5
#    - Pin 7 (列3: 3,6,9,#) -> PCF8574 的 P6
#    - PCF8574 的 P7: 悬空不接 (空置)
# 2. PCF8574 的 4Pin I2C 接口连掌控拓展板：
#    - VCC -> 3.3V / 5V
#    - GND -> GND
#    - SCL -> P19 (SCL)
#    - SDA -> P20 (SDA)
# ==============================================================================
from mpython import *
import time
from machine import Pin, I2C

# 掌控拓展板 I2C 接口定义：SCL 接 P19，SDA 接 P20
i2c_bus = I2C(scl=Pin(19), sda=Pin(20), freq=100000)

oled.fill(0)
oled.DispChar("I2C 键盘单元测试", 12, 12)
oled.DispChar("正在扫描 I2C 设备...", 5, 32)
oled.show()
time.sleep(1)

devices = i2c_bus.scan()
print("I2C 探测到的地址:", [hex(d) for d in devices])

# 排除板载 OLED (0x3c)
keypad_addr = None
for addr in [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x38, 0x39, 0x3F]:
    if addr in devices:
        keypad_addr = addr
        break

if keypad_addr:
    oled.fill(0)
    oled.DispChar("I2C 键盘在线!", 18, 15)
    oled.DispChar("设备地址: " + hex(keypad_addr), 12, 35)
    oled.show()
    try: buzzer.pitch(800, 100)
    except: pass
    time.sleep(1.5)
else:
    oled.fill(0)
    oled.DispChar("未检测到键盘!", 18, 15)
    oled.DispChar("请检查4Pin线是否插紧", 5, 35)
    oled.show()
    keypad_addr = 0x20 # 默认尝试

KEY_MAP = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

def scan_key():
    try:
        # PCF8574 逐列输出低电平扫描
        for c in range(3):
            out_val = (0xFF ^ (1 << (c + 4)))
            i2c_bus.writeto(keypad_addr, bytearray([out_val]))
            time.sleep_us(25)
            val = i2c_bus.readfrom(keypad_addr, 1)[0]
            for r in range(4):
                if not (val & (1 << r)):
                    i2c_bus.writeto(keypad_addr, b'\xFF')
                    return KEY_MAP[r][c]
                    
        # 兼容反接引脚
        for c in range(3):
            out_val = (0xFF ^ (1 << c))
            i2c_bus.writeto(keypad_addr, bytearray([out_val]))
            time.sleep_us(25)
            val = i2c_bus.readfrom(keypad_addr, 1)[0]
            for r in range(4):
                if not (val & (1 << (r + 4))):
                    i2c_bus.writeto(keypad_addr, b'\xFF')
                    return KEY_MAP[r][c]
        i2c_bus.writeto(keypad_addr, b'\xFF')
    except Exception:
        pass
    return None

oled.fill(0)
oled.DispChar("请在键盘按下按键", 10, 15)
oled.DispChar("测试输入: 123456#", 8, 35)
oled.show()

input_buf = ""
while True:
    k = scan_key()
    if k:
        try: buzzer.pitch(1000, 35)
        except: pass
        
        if k == '*':
            input_buf = ""
        elif k == '#':
            if input_buf == "123456":
                oled.fill(0)
                oled.DispChar("★ 密码正确 123456 ★", 2, 20)
                oled.show()
                try:
                    buzzer.pitch(523, 100)
                    time.sleep_ms(50)
                    buzzer.pitch(659, 150)
                except: pass
                time.sleep(2)
            input_buf = ""
        else:
            if len(input_buf) < 6:
                input_buf += k
                
        oled.fill(0)
        oled.DispChar("按下按键: [ " + str(k) + " ]", 12, 12)
        oled.DispChar("已输入: " + input_buf, 10, 34)
        oled.show()
        time.sleep(0.25)
    time.sleep(0.02)
