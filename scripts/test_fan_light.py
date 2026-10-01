# ==============================================================================
# 单元测试 4：客厅实体高亮吊灯 (P2) 与微型排风扇 (P3 / M1直流双模) 测试
# 用途：测试 P2 实体 LED 亮灭 与 直流排风扇旋转吹风 (支持 P3 模块与 Parrot M1 电机端子)
#
# 【两线微型直流电扇接线 (黄线 + 橙线)】
# - 直接将电机的黄色线与橙色线插入 Parrot 拓展板背面的【M1】两孔端子中！
# - 顺时针吹风：若风向吸风，将两根线对调，或在代码中设为 -80 即可反向吹风！
# ==============================================================================
from mpython import *
import time
from machine import Pin

# 初始化客厅吊灯 (P2) 与微型风扇电机 (P3)
light_pin = Pin(Pin.P2, Pin.OUT)
fan_pin = Pin(Pin.P3, Pin.OUT)

# 探测 Parrot 拓展板板载 M1 直流电机驱动
try:
    import parrot
    HAS_PARROT = True
except Exception:
    HAS_PARROT = False

def set_fan_motor(state):
    """同时控制 P3 数字引脚与 Parrot M1 电机端子"""
    fan_pin.value(1 if state else 0)
    if HAS_PARROT:
        try:
            parrot.set_speed(parrot.MOTOR_1, 80 if state else 0)
        except Exception:
            pass

oled.fill(0)
oled.DispChar("吊灯与风扇单元测试", 8, 15)
oled.DispChar("P2:吊灯  P3/M1:风扇", 5, 35)
oled.show()
time.sleep(1.5)

step = 0
while True:
    step = (step + 1) % 4
    
    if step == 0:
        # 1. 仅开吊灯
        light_pin.value(1)
        set_fan_motor(False)
        oled.fill(0)
        oled.DispChar("【状态 1】客厅吊灯: [开启]", 5, 18)
        oled.DispChar("智能风扇: [关闭]", 5, 38)
        oled.show()
        try: buzzer.pitch(800, 80)
        except: pass
        
    elif step == 1:
        # 2. 仅开风扇
        light_pin.value(0)
        set_fan_motor(True)
        oled.fill(0)
        oled.DispChar("客厅吊灯: [关闭]", 5, 18)
        oled.DispChar("【状态 2】智能风扇: [旋转吹风]", 5, 38)
        oled.show()
        try: buzzer.pitch(1000, 80)
        except: pass
        
    elif step == 2:
        # 3. 吊灯与风扇全开
        light_pin.value(1)
        set_fan_motor(True)
        oled.fill(0)
        oled.DispChar("【状态 3】全开模式", 5, 18)
        oled.DispChar("吊灯:亮  风扇:转", 15, 38)
        oled.show()
        try: buzzer.pitch(1200, 100)
        except: pass
        
    else:
        # 4. 全关
        light_pin.value(0)
        set_fan_motor(False)
        oled.fill(0)
        oled.DispChar("【状态 4】全关节能", 5, 18)
        oled.DispChar("吊灯:灭  风扇:停", 15, 38)
        oled.show()
        
    time.sleep(3)
