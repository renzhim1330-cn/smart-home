# ==============================================================================
# 单元测试脚本 3：DHT11 温湿度与 PIR 人体红外双重联动测试
# 用途：测试 P1 (DHT11) 与 P8 (PIR)，验证温度 > 28℃ 且感应有人时触发排风联动
# ==============================================================================
from mpython import *
import time
import dht
from machine import Pin

# P1 口接 DHT11 单总线
dht_dev = dht.DHT11(Pin(Pin.P1))
# P8 口接 PIR 人体红外
pir_dev = Pin(Pin.P8, Pin.IN)

oled.fill(0)
oled.DispChar("双重环境联动测试", 10, 15)
oled.DispChar("哈气>28C 且 有人感应", 5, 35)
oled.show()

while True:
    # 1. 采集温湿度
    t, h = 25.0, 50.0
    try:
        dht_dev.measure()
        t = dht_dev.temperature()
        h = dht_dev.humidity()
    except Exception:
        pass

    # 2. 读取人体红外 (1 表示有人，0 表示无人)
    pir_val = pir_dev.value()

    oled.fill(0)
    oled.DispChar("温度:{:.1f}C 湿度:{}%".format(t, int(h)), 4, 8)
    
    if t > 28.0 and pir_val == 1:
        oled.DispChar("【高温且有人】", 10, 26)
        oled.DispChar("触发自动排风降温!", 6, 44)
        rgb.fill((255, 0, 0)) # 红色警告
        rgb.write()
        try: buzzer.pitch(800, 100)
        except: pass
    elif t > 28.0 and pir_val == 0:
        oled.DispChar("【高温但无人】", 10, 26)
        oled.DispChar("节能待机不排风", 10, 44)
        rgb.fill((200, 100, 0)) # 橙色待机
        rgb.write()
    elif pir_val == 1:
        oled.DispChar("室内有人 温度正常", 8, 30)
        rgb.fill((0, 150, 255)) # 蓝色提示
        rgb.write()
    else:
        oled.DispChar("环境正常 守卫中", 12, 30)
        rgb.fill((0, 0, 0))
        rgb.write()
        
    oled.show()
    time.sleep(1.5)
