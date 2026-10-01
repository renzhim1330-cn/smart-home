# ==============================================================================
# 单元测试 4B：智能微型排风扇 (Parrot M1) 纯手动按键调速与停转测试
# 用途：按掌控板【A 键】换挡与停转，按【B 键】切换排风/抽风方向
#
# 【A 键换挡大循环】
# 开机停转 ➔ 按A [1挡 35%微风] ➔ 按A [2挡 65%清风] ➔ 按A [3挡 100%狂风] ➔ 按A [0挡 停转] ➔ 循环
# ==============================================================================
from mpython import *
import time
import parrot

# 预设 4 个风速档位 (0: 停转关闭, 1: 35%微风, 2: 65%清风, 3: 100%暴风)
GEAR_NAMES = ["【0档】彻底停转", "【1档】35% 微风", "【2档】65% 清风", "【3档】100% 狂风"]
GEAR_SPEEDS = [0, 35, 65, 100]

current_gear = 0
is_forward = True  # True: 正向排风, False: 反向抽风

def check_btn_a():
    """多重兼容检测掌控板 A 键按下"""
    try:
        if button_a.is_pressed() or button_a.was_pressed():
            return True
    except:
        pass
    try:
        if button_a.value() == 0:
            return True
    except:
        pass
    return False

def check_btn_b():
    """多重兼容检测掌控板 B 键按下"""
    try:
        if button_b.is_pressed() or button_b.was_pressed():
            return True
    except:
        pass
    try:
        if button_b.value() == 0:
            return True
    except:
        pass
    return False

def apply_fan_speed():
    """根据档位与方向驱动电机，并在屏幕上刷新显示"""
    base_spd = GEAR_SPEEDS[current_gear]
    actual_spd = base_spd if is_forward else -base_spd
    
    try:
        parrot.set_speed(parrot.MOTOR_1, actual_spd)
    except Exception as e:
        print("M1电机驱动异常:", e)
        
    # OLED 屏幕图形化显示
    oled.fill(0)
    oled.DispChar("★ 纯手动A键控制 ★", 10, 0)
    oled.DispChar(GEAR_NAMES[current_gear], 10, 20)
    
    if current_gear == 0:
        oled.DispChar("按 A 键 ➔ 启动 1 档", 5, 38)
    else:
        dir_str = "风向: 正向排风" if is_forward else "风向: 反向抽风"
        oled.DispChar(dir_str, 10, 38)
    
    # 底部绘制风速进度条
    bar_width = int(current_gear * (110 / 3))
    oled.rect(5, 54, 118, 8, 1)
    if bar_width > 0:
        oled.fill_rect(7, 56, bar_width, 4, 1)
    oled.show()

# 初始停转状态
apply_fan_speed()

print("==================================================")
print(">>> 已成功加载【纯手动按键控制版本】！")
print(">>> 当前处于【0档 停转关闭】，绝不会自动切换！")
print(">>> 请按下掌控板正面的【A 键】测试升档与停转：")
print("    - 第 1 次按 A ➔ 1 档 (35% 微风)")
print("    - 第 2 次按 A ➔ 2 档 (65% 清风)")
print("    - 第 3 次按 A ➔ 3 档 (100% 狂风)")
print("    - 第 4 次按 A ➔ 0 档 (彻底停转关闭！)")
print("==================================================")

while True:
    # 1. 严格监听 A 键（只有按下 A 键才会换挡，不按绝对不变）
    if check_btn_a():
        current_gear = (current_gear + 1) % len(GEAR_SPEEDS)
        print(">>> 收到 A 键触发！切换到:", GEAR_NAMES[current_gear])
        
        # 换挡音效
        if current_gear == 0:
            try: buzzer.pitch(500, 150)
            except: pass
        else:
            try: buzzer.pitch(800 + current_gear * 200, 80)
            except: pass
            
        apply_fan_speed()
        time.sleep(0.35)  # 严格防抖
        
    # 2. 严格监听 B 键（切换风向）
    if check_btn_b():
        is_forward = not is_forward
        print(">>> 收到 B 键触发！切换风向为:", "正向排风" if is_forward else "反向抽风")
        try: buzzer.pitch(1400, 100)
        except: pass
        apply_fan_speed()
        time.sleep(0.35)  # 严格防抖
        
    time.sleep(0.02)
