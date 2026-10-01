# ==============================================================================
# 智能微型排风扇：物理边沿跳变按键调速 (彻底根除 was_pressed 恒真死循环)
# 接线：电机黄线与橙线插 Parrot 拓展板背面的 M1 端子两孔
# 掌控板按键：按正面 A 键调速与停转，按 B 键反转风向
# ==============================================================================
from mpython import *
import time
import parrot
from machine import Pin

# 直接读取物理 GPIO：A键=GPIO35, B键=GPIO27
pin_a = Pin(35, Pin.IN)
pin_b = Pin(27, Pin.IN)

GEAR_NAMES = ["【0档 停转】", "【1档 35%微风】", "【2档 65%清风】", "【3档 100%狂风】"]
GEAR_SPEEDS = [0, 35, 65, 100]

gear = 0
is_forward = True

# 开机先彻底停转
try:
    parrot.set_speed(parrot.MOTOR_1, 0)
except Exception as e:
    print("M1驱动初始化:", e)

# 初始电平记忆 (常态松开为1，按下为0)
last_a = pin_a.value()
last_b = pin_b.value()

oled.fill(0)
oled.DispChar("★ 物理边沿按键测试 ★", 5, 5)
oled.DispChar("当前: [0档 停转]", 15, 25)
oled.DispChar("静止等待按A键...", 10, 45)
oled.show()

print("==================================================")
print(">>> 启动成功！A键初始电平:", last_a, "B键初始电平:", last_b)
print(">>> 当前风扇已静止停转。只有您按下的瞬间才会触发！")
print("==================================================")

while True:
    curr_a = pin_a.value()
    curr_b = pin_b.value()
    
    # 严格边沿触发：只有从 1 (松开) 变成 0 (按下) 的瞬间才触发！
    if last_a == 1 and curr_a == 0:
        gear = (gear + 1) % len(GEAR_SPEEDS)
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            print("电机控制异常:", e)
        
        oled.fill(0)
        oled.DispChar("★ 物理边沿按键测试 ★", 5, 5)
        oled.DispChar(GEAR_NAMES[gear], 20, 25)
        if gear == 0:
            oled.DispChar("已停转! 按A重新启动", 5, 45)
            try: buzzer.pitch(500, 100)
            except: pass
        else:
            dir_str = "(正向)" if is_forward else "(反向)"
            oled.DispChar("转速: " + str(base_spd) + "% " + dir_str, 8, 45)
            try: buzzer.pitch(1000, 80)
            except: pass
        oled.show()
        print(">>> [真按键] 成功触发 A 键！切换为:", GEAR_NAMES[gear])
        time.sleep(0.15)  # 物理消抖
        
    # B 键同样严格边沿检测
    if last_b == 1 and curr_b == 0:
        is_forward = not is_forward
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            pass
        oled.fill(0)
        oled.DispChar("★ 切换风向 ★", 25, 5)
        oled.DispChar("当前风向: " + ("正向排风" if is_forward else "反向抽风"), 5, 25)
        oled.DispChar(GEAR_NAMES[gear], 20, 45)
        oled.show()
        try: buzzer.pitch(1400, 100)
        except: pass
        print(">>> [真按键] 成功触发 B 键！切换风向为:", "正向排风" if is_forward else "反向抽风")
        time.sleep(0.15)  # 物理消抖
        
    last_a = curr_a
    last_b = curr_b
    time.sleep(0.02)
