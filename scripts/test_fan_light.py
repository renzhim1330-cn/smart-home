# ==============================================================================
# 单元测试 4：客厅实体吊灯 (P11) 与智能微型电扇 (P5) 独立控制测试
# 用途：测试 P11 实体 LED 亮灭 与 P5 微型直流风扇旋转启停
# ==============================================================================
from mpython import *
import time
from machine import Pin

# 初始化客厅吊灯 (P11) 与风扇电机 (P5)
light_pin = Pin(Pin.P11, Pin.OUT)
fan_pin = Pin(Pin.P5, Pin.OUT)

oled.fill(0)
oled.DispChar("吊灯与风扇单元测试", 8, 15)
oled.DispChar("P11:吊灯  P5:风扇", 10, 35)
oled.show()
time.sleep(1.5)

step = 0
while True:
    step = (step + 1) % 4
    
    if step == 0:
        # 1. 仅开吊灯
        light_pin.value(1)
        fan_pin.value(0)
        oled.fill(0)
        oled.DispChar("【状态 1】客厅吊灯: [开启]", 5, 18)
        oled.DispChar("智能风扇: [关闭]", 5, 38)
        oled.show()
        try: buzzer.pitch(800, 80)
        except: pass
        
    elif step == 1:
        # 2. 仅开风扇
        light_pin.value(0)
        fan_pin.value(1)
        oled.fill(0)
        oled.DispChar("客厅吊灯: [关闭]", 5, 18)
        oled.DispChar("【状态 2】智能风扇: [旋转吹风]", 5, 38)
        oled.show()
        try: buzzer.pitch(1000, 80)
        except: pass
        
    elif step == 2:
        # 3. 吊灯与风扇全开
        light_pin.value(1)
        fan_pin.value(1)
        oled.fill(0)
        oled.DispChar("【状态 3】全开模式", 5, 18)
        oled.DispChar("吊灯:亮  风扇:转", 15, 38)
        oled.show()
        try: buzzer.pitch(1200, 100)
        except: pass
        
    else:
        # 4. 全关
        light_pin.value(0)
        fan_pin.value(0)
        oled.fill(0)
        oled.DispChar("【状态 4】全关节能", 5, 18)
        oled.DispChar("吊灯:灭  风扇:停", 15, 38)
        oled.show()
        
    time.sleep(3)
