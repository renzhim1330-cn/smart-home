# ==============================================================================
# 单元测试脚本 1：3×4 矩阵薄膜键盘独立扫描测试
# 用途：测试 P2~P16 排线引脚是否插对，按键是否有反应
# ==============================================================================
from mpython import *
import time
from machine import Pin

# 初始化 4 行 3 列 GPIO (带内部弱上拉)
ROW_PINS = [
    Pin(Pin.P2, Pin.IN, Pin.PULL_UP),
    Pin(Pin.P3, Pin.IN, Pin.PULL_UP),
    Pin(Pin.P13, Pin.IN, Pin.PULL_UP),
    Pin(Pin.P14, Pin.IN, Pin.PULL_UP)
]
COL_PINS = [
    Pin(Pin.P15, Pin.OUT),
    Pin(Pin.P16, Pin.OUT),
    Pin(Pin.P4, Pin.OUT)
]

KEY_MAP = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

def scan_key():
    for c_idx, col in enumerate(COL_PINS):
        for c in COL_PINS:
            c.value(1)
        col.value(0)
        time.sleep_us(25)
        for r_idx, row in enumerate(ROW_PINS):
            if row.value() == 0:
                for c in COL_PINS:
                    c.value(1)
                return KEY_MAP[r_idx][c_idx]
    return None

oled.fill(0)
oled.DispChar("3x4 键盘测试启动", 12, 12)
oled.DispChar("请在实体键盘按下按键", 5, 32)
oled.show()

input_history = ""

while True:
    k = scan_key()
    if k:
        if k == '*':
            input_history = ""
        elif k == '#':
            if input_history == "123456":
                oled.fill(0)
                oled.DispChar("★ 密码正确 123456 ★", 5, 20)
                oled.show()
                try: buzzer.pitch(1000, 200)
                except: pass
                time.sleep(1.5)
                input_history = ""
            else:
                oled.fill(0)
                oled.DispChar("✘ 密码错误: " + input_history, 5, 20)
                oled.show()
                try: buzzer.pitch(400, 300)
                except: pass
                time.sleep(1.2)
                input_history = ""
        else:
            if len(input_history) < 6:
                input_history += k
                
        oled.fill(0)
        oled.DispChar("按键值: " + k, 15, 12)
        oled.DispChar("当前输入: " + (input_history if input_history else "[空]"), 10, 34)
        oled.show()
        try: buzzer.pitch(800, 50)
        except: pass
        time.sleep(0.28)
