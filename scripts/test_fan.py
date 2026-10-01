# ==============================================================================
# 单元测试 4B：智能微型排风扇 (Parrot M1) 按键交互调速测试
# 用途：按 A 键循环换挡与停转，按 B 键切换吹风/排风方向
#
# 【A 键换挡循环口诀】
# 开机默认停转 ➔ 按A [1挡 35%微风] ➔ 按A [2挡 65%清风] ➔ 按A [3挡 100%狂风] ➔ 按A [停转关闭] ➔ 按A [重新开启]
# ==============================================================================
from mpython import *
import time
import parrot

# 预设 4 个风速档位 (0: 停转关闭, 1: 35%微风, 2: 65%清风, 3: 100%暴风)
GEAR_NAMES = ["【0档】停转关闭", "【1档】35% 静音微风", "【2档】65% 自然清风", "【3档】100% 强力暴风"]
GEAR_SPEEDS = [0, 35, 65, 100]

current_gear = 0
is_forward = True  # True: 正向排风, False: 反向抽风

def apply_fan_speed():
    """根据档位与方向驱动电机，并在屏幕上刷新显示"""
    base_spd = GEAR_SPEEDS[current_gear]
    actual_spd = base_spd if is_forward else -base_spd
    
    try:
        parrot.set_speed(parrot.MOTOR_1, actual_spd)
    except Exception as e:
        print("驱动异常:", e)
        
    # OLED 屏幕图形化显示
    oled.fill(0)
    oled.DispChar("★ 风扇按键调速测试 ★", 2, 0)
    oled.DispChar(GEAR_NAMES[current_gear], 5, 20)
    
    if current_gear == 0:
        oled.DispChar("按 A 键 ➔ 启动 1 档", 5, 38)
    else:
        dir_str = "风向: 正向排风" if is_forward else "风向: 反向抽风"
        oled.DispChar(dir_str, 5, 38)
    
    # 底部绘制风速进度条
    bar_width = int(current_gear * (110 / 3))
    oled.rect(5, 54, 118, 8, 1)
    if bar_width > 0:
        oled.fill_rect(7, 56, bar_width, 4, 1)
    oled.show()

# 初始停转状态
apply_fan_speed()

print("已就绪！")
print("👉 按一下【A 键】：升档吹风")
print("👉 吹到第 3 档再按一下【A 键】：立刻停转！停转后再按 A 键又会重新启动！")
print("👉 按一下【B 键】：切换吹风/排风方向")

while True:
    # 检测 A 键按下（换挡 / 停转 / 重新启动）
    if button_a.value() == 0:
        current_gear = (current_gear + 1) % len(GEAR_SPEEDS)
        
        # 换挡蜂鸣器音效（停转时低音，升档时清脆高音）
        if current_gear == 0:
            try: buzzer.pitch(500, 150)
            except: pass
        else:
            try: buzzer.pitch(800 + current_gear * 200, 80)
            except: pass
            
        apply_fan_speed()
        time.sleep(0.3)  # 按键防抖延时
        
    # 检测 B 键按下（切换风向）
    if button_b.value() == 0:
        is_forward = not is_forward
        try: buzzer.pitch(1400, 100)
        except: pass
        apply_fan_speed()
        time.sleep(0.3)  # 按键防抖延时
        
    time.sleep(0.05)
