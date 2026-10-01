# ==============================================================================
# 智能微型排风扇：纯手动按 A 键控制 (绝对无任何自动定时器)
# 接线：电机黄线与橙线插 Parrot 拓展板背面的 M1 端子两孔
# 掌控板按键：按正面 A 键调速与停转，按 B 键反转风向
# ==============================================================================
from mpython import *
import time
import parrot

# 4 个档位：0:停转, 1:35%微风, 2:65%清风, 3:100%狂风
GEAR_NAMES = ["【0档 停转】", "【1档 35%微风】", "【2档 65%清风】", "【3档 100%狂风】"]
GEAR_SPEEDS = [0, 35, 65, 100]

gear = 0
is_forward = True

# 开机先彻底停转电机
try:
    parrot.set_speed(parrot.MOTOR_1, 0)
except Exception as e:
    print("M1驱动初始化:", e)

# 屏幕初始提示
oled.fill(0)
oled.DispChar("★ 纯手动按A键测试 ★", 2, 5)
oled.DispChar("当前: [0档 停转]", 15, 25)
oled.DispChar("请按 A 键启动风扇", 10, 45)
oled.show()

print("==================================================")
print(">>> 脚本启动成功！当前风扇已停转。")
print(">>> 请按下掌控板正面的【A 键】或【B 键】...")
print("==================================================")

while True:
    # 1. 检测 A 键（换挡 / 停转）
    if button_a.is_pressed() or button_a.was_pressed():
        gear = (gear + 1) % len(GEAR_SPEEDS)  # 0 -> 1 -> 2 -> 3 -> 0 循环
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        
        # 驱动电机
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            print("电机控制异常:", e)
        
        # 屏幕刷新
        oled.fill(0)
        oled.DispChar("★ 纯手动按A键测试 ★", 2, 5)
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
        
        print(">>> 捕获到 A 键！当前切换为:", GEAR_NAMES[gear])
        time.sleep(0.3)  # 防抖延时
        
    # 2. 检测 B 键（反转风向）
    if button_b.is_pressed() or button_b.was_pressed():
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
        print(">>> 捕获到 B 键！切换风向为:", "正向排风" if is_forward else "反向抽风")
        time.sleep(0.3)  # 防抖延时
        
    time.sleep(0.05)
