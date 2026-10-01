# ==============================================================================
# 单元测试 4B：智能微型排风扇 (Parrot M1 / P3 双模) 独立测试脚本
# 用途：测试微型排风扇电机旋转吹风，验证高温强力排风降温功能
#
# 【两线直流电扇接线 (黄线 + 橙线)】
# - 直接将电机的黄色线与橙色线插入 Parrot 拓展板背面的【M1】端子两孔！
# - 顺时针吹风：若风向吸风，将两根线对调，或在代码中设为 -85 即可反向吹风！
#
# 【三线风扇模块接线 (若使用带驱动底板的模块)】
# - 信号线接左侧 P3，VCC 接 5V，GND 接地
# ==============================================================================
from mpython import *
import time
from machine import Pin

# 1. 初始化通用 P3 数字引脚 (用于兼容三线风扇模块)
fan_pin = Pin(Pin.P3, Pin.OUT)
fan_pin.value(0)

# 2. 探测 Parrot 拓展板板载 M1 直流电机驱动 (用于两线黄/橙裸电机)
try:
    import parrot
    HAS_PARROT = True
except Exception:
    HAS_PARROT = False

def set_fan(speed):
    """设置风扇转速 (0 停止，正数高速排风)"""
    fan_pin.value(1 if speed > 0 else 0)
    if HAS_PARROT:
        try:
            parrot.set_speed(parrot.MOTOR_1, speed)
        except Exception:
            pass

oled.fill(0)
oled.DispChar("智能风扇独立测试", 12, 12)
oled.DispChar("接口: M1端子 / P3", 8, 32)
oled.show()
time.sleep(1.5)

cycle = 0
while True:
    cycle = (cycle + 1) % 3
    
    if cycle == 0:
        # 1. 强劲全速排风 (85% 速度)
        set_fan(85)
        oled.fill(0)
        oled.DispChar("★ 风扇: [高速排风] ★", 2, 12)
        oled.DispChar("转速: 85% 强力吹风", 10, 30)
        oled.DispChar("手感应出风口风向", 15, 48)
        oled.show()
        try: buzzer.pitch(1200, 100)
        except: pass
        time.sleep(3.5)
        
    elif cycle == 1:
        # 2. 柔和微风排风 (45% 速度)
        set_fan(45)
        oled.fill(0)
        oled.DispChar("● 风扇: [微风排风] ●", 2, 12)
        oled.DispChar("转速: 45% 静音微风", 10, 30)
        oled.DispChar("绿色节能低噪音", 18, 48)
        oled.show()
        try: buzzer.pitch(900, 80)
        except: pass
        time.sleep(3.5)
        
    else:
        # 3. 停转关闭
        set_fan(0)
        oled.fill(0)
        oled.DispChar("○ 风扇: [停转关闭] ○", 2, 12)
        oled.DispChar("待机休眠 0 功耗", 15, 30)
        oled.DispChar("等待温湿触发排风", 12, 48)
        oled.show()
        try: buzzer.pitch(600, 60)
        except: pass
        time.sleep(2.5)
