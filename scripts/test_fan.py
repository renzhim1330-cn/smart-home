# ==============================================================================
# 智能微型排风扇：掌控板官方标准按键调速系统
# 接线：电机黄线与橙线插 Parrot 拓展板背面的 M1 端子两孔
# 掌控板操作：
# - 按【A 键】：循环切换 0档停转 -> 1档80%排风 -> 2档100%狂风 -> 0档停转
# - 按【B 键】：一键反转风向
# ==============================================================================
from mpython import *
import time
import parrot

# 预设档位 (0: 停转关闭, 1: 80%高扭力舒适排风, 2: 100%极速强风)
GEAR_NAMES = ["【0档 彻底停转】", "【1档 80% 舒适排风】", "【2档 100% 强力暴风】"]
GEAR_SPEEDS = [0, 80, 100]

gear = 0
is_forward = True

def drive_motor(speed):
    """驱动电机并带有防卡死起步脉冲"""
    if speed == 0:
        parrot.set_speed(parrot.MOTOR_1, 0)
    else:
        # 起步瞬间先给 0.05 秒全速脉冲打破静摩擦死区，然后平稳运行
        direction = 1 if is_forward else -1
        try:
            parrot.set_speed(parrot.MOTOR_1, 100 * direction)
            time.sleep(0.05)
            parrot.set_speed(parrot.MOTOR_1, speed * direction)
        except Exception as e:
            print("电机控制异常:", e)

# 开机彻底停转
drive_motor(0)

def refresh_screen():
    """刷新掌控板 OLED 屏幕显示"""
    oled.fill(0)
    oled.DispChar("★ 智能风扇按键测试 ★", 5, 2)
    oled.DispChar(GEAR_NAMES[gear], 10, 20)
    
    if gear == 0:
        oled.DispChar("按 A 键 ➔ 启动风扇", 10, 38)
    else:
        dir_txt = "风向: 正向排风" if is_forward else "风向: 反向抽风"
        oled.DispChar(dir_txt, 15, 38)
        
    bar_w = int(gear * (110 / 2))
    oled.rect(5, 54, 118, 8, 1)
    if bar_w > 0:
        oled.fill_rect(7, 56, bar_w, 4, 1)
    oled.show()

# 初始显示屏幕
refresh_screen()

print("==================================================")
print(">>> 【智能风扇官方标准按键调速系统】已启动！")
print(">>> A 键初始状态 (is_pressed):", button_a.is_pressed(), "(未按应为 False)")
print(">>> B 键初始状态 (is_pressed):", button_b.is_pressed(), "(未按应为 False)")
print(">>> 当前风扇已静止停转。请按一下掌控板正面的【A 键】...")
print("==================================================")

while True:
    # 1. 检测 A 键按下 (掌控板官方标准 API: is_pressed)
    if button_a.is_pressed():
        gear = (gear + 1) % len(GEAR_SPEEDS)
        target_spd = GEAR_SPEEDS[gear]
        
        drive_motor(target_spd)
        refresh_screen()
        
        if gear == 0:
            print(">>> [A键按下] 风扇已彻底停转 (0档)！")
            try: buzzer.pitch(500, 150)
            except: pass
        else:
            print(">>> [A键按下] 切换到:", GEAR_NAMES[gear], "| 转速:", target_spd, "%")
            try: buzzer.pitch(800 + gear * 300, 80)
            except: pass
            
        # 等待用户手指松开按键 (彻底消除连击)
        while button_a.is_pressed():
            time.sleep(0.02)
        time.sleep(0.05)
        
    # 2. 检测 B 键按下
    if button_b.is_pressed():
        is_forward = not is_forward
        target_spd = GEAR_SPEEDS[gear]
        
        drive_motor(target_spd)
        refresh_screen()
        
        print(">>> [B键按下] 切换风向为:", "正向排风" if is_forward else "反向抽风")
        try: buzzer.pitch(1400, 100)
        except: pass
        
        # 等待用户手指松开按键
        while button_b.is_pressed():
            time.sleep(0.02)
        time.sleep(0.05)
        
    time.sleep(0.02)
