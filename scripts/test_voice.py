# ==============================================================================
# 单元测试 5：离线语音识别模块 (ASR01/HLK-V20) 串口通信测试
# 用途：测试 P6 (RX) / P7 (TX) 串口通信，对着模块呼唤“小智同学”，观察数据接收
# ==============================================================================
from mpython import *
import time
from machine import UART

# 初始化 UART1：波特率 9600 (大多数离线语音模块标准默认波特率)
# P6 作为掌控板 RX (接语音模块 TX)，P7 作为掌控板 TX (接语音模块 RX)
uart = UART(1, baudrate=9600, rx=Pin.P6, tx=Pin.P7)

oled.fill(0)
oled.DispChar("离线语音模块测试", 10, 12)
oled.DispChar("请喊:【小智同学】", 10, 32)
oled.show()

# 标准语音指令协议识别表 (兼容 ASR01 / HLK-V20 常见指令码与字符协议)
CMD_DICT = {
    b'\x01': "打开客厅灯",
    b'\x02': "关闭客厅灯",
    b'\x03': "打开风扇",
    b'\x04': "关闭风扇",
    b'LIGHT_ON': "打开客厅灯",
    b'LIGHT_OFF': "关闭客厅灯",
    b'FAN_ON': "打开风扇",
    b'FAN_OFF': "关闭风扇"
}

while True:
    if uart.any():
        raw_data = uart.read()
        print("收到语音原始数据:", raw_data)
        
        recognized_action = "收到未知指令"
        for k, v in CMD_DICT.items():
            if k in raw_data:
                recognized_action = v
                break
                
        oled.fill(0)
        oled.DispChar("语音接收成功!", 15, 12)
        oled.DispChar(recognized_action, 15, 34)
        oled.show()
        
        try:
            buzzer.pitch(1000, 100)
        except:
            pass
            
        time.sleep(1.5)
        
        oled.fill(0)
        oled.DispChar("监听语音口令中...", 10, 25)
        oled.show()
        
    time.sleep(0.05)
