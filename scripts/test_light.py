# ==============================================================================
# 单元测试 4A：客厅实体高亮吊灯 (P2) 独立测试脚本
# 用途：测试 P2 实体白光 LED 吊灯亮灭，验证高电平驱动与夜间全屋照明效果
#
# 【接线指引】
# 1. LED 信号线 (SIG / 正极) ➔ 拓展板左侧【P2】黄色排针 (S)
# 2. LED 电源线 (VCC)         ➔ 拓展板【5V】红色排针 (V)
# 3. LED 地线 (GND)           ➔ 拓展板【GND】黑色排针 (G)
# ==============================================================================
from mpython import *
import time
from machine import Pin

# 初始化 P2 为标准数字输出
light_pin = Pin(Pin.P2, Pin.OUT)

oled.fill(0)
oled.DispChar("客厅吊灯独立测试", 12, 12)
oled.DispChar("引脚: P2 (5V/GND)", 10, 32)
oled.show()
time.sleep(1.5)

state = False
counter = 0

while True:
    state = not state
    counter += 1
    
    if state:
        light_pin.value(1)
        oled.fill(0)
        oled.DispChar("★ 客厅吊灯: [开启] ★", 5, 12)
        oled.DispChar("通明照亮整屋", 25, 30)
        oled.DispChar("循环次数: #" + str(counter), 20, 48)
        oled.show()
        try: buzzer.pitch(1000, 100)
        except: pass
    else:
        light_pin.value(0)
        oled.fill(0)
        oled.DispChar("☆ 客厅吊灯: [关闭] ☆", 5, 12)
        oled.DispChar("节能待机熄灭", 25, 30)
        oled.DispChar("循环次数: #" + str(counter), 20, 48)
        oled.show()
        try: buzzer.pitch(600, 80)
        except: pass
        
    time.sleep(2)
