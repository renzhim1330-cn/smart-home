# ==============================================================================
# 单元测试脚本 3：DHT11 温湿度与 PIR 人体红外防盗测试
# 用途：测试 P1 (DHT11) 与 P8 (PIR)，验证哈气升温与挥手防盗
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
oled.DispChar("环境与安防测试启动", 8, 15)
oled.DispChar("请哈气或在探头前挥手", 5, 35)
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
    oled.DispChar("温度:{:.1f}C 湿度:{}%".format(t, int(h)), 6, 12)
    
    if t > 30.0:
        oled.DispChar("! 高温告警 启动排风 !", 5, 32)
        rgb.fill((255, 0, 0)) # 红色警告
        rgb.write()
        try: buzzer.pitch(800, 100)
        except: pass
    elif pir_val == 1:
        oled.DispChar("! PIR感应: 有人靠近 !", 5, 32)
        rgb.fill((0, 150, 255)) # 蓝色提示
        rgb.write()
        try: buzzer.pitch(1200, 50)
        except: pass
    else:
        oled.DispChar("状态: 环境正常 守卫中", 5, 32)
        rgb.fill((0, 0, 0))
        rgb.write()
        
    oled.show()
    time.sleep(1.5)
