# ==============================================================================
# 单元测试脚本 2：SG90 微型舵机开门与闭门角度测试
# 用途：测试 P0 信号线与外接 5V 独立供电，验证开门 90° 与关门 0°
# ==============================================================================
from mpython import *
import time
from machine import Pin, PWM

# P0 引脚输出 50Hz PWM
servo_pwm = PWM(Pin(Pin.P0), freq=50)

def set_servo_angle(angle):
    # 0度~180度转换成占空比 (0度关门对应duty 25左右，90度开门对应duty 75左右)
    duty = int(25 + (angle / 180.0) * 100)
    servo_pwm.duty(duty)

oled.fill(0)
oled.DispChar("SG90 舵机测试启动", 10, 15)
oled.show()

# 初始复位到 0 度 (关门位)
set_servo_angle(0)
time.sleep(1)

while True:
    # 1. 关门状态 (0度)
    oled.fill(0)
    oled.DispChar("舵机角度: 0度", 20, 15)
    oled.DispChar("入户大门: [闭合锁定]", 10, 35)
    oled.show()
    set_servo_angle(0)
    rgb.fill((0, 0, 0))
    rgb.write()
    time.sleep(3)

    # 2. 开门状态 (90度)
    oled.fill(0)
    oled.DispChar("舵机角度: 90度", 18, 15)
    oled.DispChar("入户大门: [旋转开启]", 10, 35)
    oled.show()
    set_servo_angle(90)
    rgb.fill((255, 180, 0)) # 亮暖黄迎宾灯
    rgb.write()
    try:
        buzzer.pitch(900, 100)
    except:
        pass
    time.sleep(3)
