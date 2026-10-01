# ==============================================================================
# 智能微型排风扇：掌控板按键 2 档精准调速系统 (极简物理释放阻塞)
# 接线：电机黄线与橙线插 Parrot 拓展板背面的 M1 端子两孔
# 掌控板操作：
# - 按【A 键】：循环切换 0档停转 -> 1档50%舒适风 -> 2档100%强风 -> 0档停转
# - 按【B 键】：一键反转风向
# ==============================================================================
from mpython import *
import time
import parrot

# 预设 2 个实用档位 + 停转 (0: 停转关闭, 1: 50%舒适排风, 2: 100%强力暴风)
GEAR_NAMES = ["【0档 彻底停转】", "【1档 50% 舒适排风】", "【2档 100% 强力暴风】"]
GEAR_SPEEDS = [0, 50, 100]

gear = 0
is_forward = True

# 开机先停转
try:
    parrot.set_speed(parrot.MOTOR_1, 0)
except Exception as e:
    print("M1驱动初始化异常:", e)

def refresh_screen():
    """刷新掌控板 OLED 屏幕显示"""
    oled.fill(0)
    oled.DispChar("★ 智能风扇2档调速 ★", 5, 2)
    oled.DispChar(GEAR_NAMES[gear], 10, 20)
    
    if gear == 0:
        oled.DispChar("按 A 键 ➔ 启动风扇", 10, 38)
    else:
        dir_txt = "风向: 正向排风" if is_forward else "风向: 反向抽风"
        oled.DispChar(dir_txt, 15, 38)
        
    # 绘制档位进度条
    bar_w = int(gear * (110 / 2))
    oled.rect(5, 54, 118, 8, 1)
    if bar_w > 0:
        oled.fill_rect(7, 56, bar_w, 4, 1)
    oled.show()

# 初始刷新屏幕
refresh_screen()

print("==================================================")
print(">>> 【智能风扇 2 档实用调速测试】启动成功！")
print(">>> A 键初始读数:", button_a.value(), "(松开应为 1，按下为 0)")
print(">>> B 键初始读数:", button_b.value(), "(松开应为 1，按下为 0)")
print(">>> 当前状态：0 档静止停转。请按掌控板【A 键】...")
print("==================================================")

while True:
    # 1. 监测 A 键按下 (按下时 value 为 0)
    if button_a.value() == 0:
        gear = (gear + 1) % len(GEAR_SPEEDS)
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            print("电机控制异常:", e)
            
        refresh_screen()
        
        if gear == 0:
            print(">>> [A键触发] 风扇已彻底停转 (0档)！")
            try: buzzer.pitch(500, 150)
            except: pass
        else:
            print(">>> [A键触发] 切换到:", GEAR_NAMES[gear], "| 实际转速:", actual_spd)
            try: buzzer.pitch(800 + gear * 300, 80)
            except: pass
            
        # 核心：等待用户手指松开按键，彻底防止连发与卡死
        while button_a.value() == 0:
            time.sleep(0.02)
        time.sleep(0.08) # 消除物理弹片抖动
        
    # 2. 监测 B 键按下 (按下时 value 为 0)
    if button_b.value() == 0:
        is_forward = not is_forward
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            pass
            
        refresh_screen()
        print(">>> [B键触发] 切换风向为:", "正向排风" if is_forward else "反向抽风")
        try: buzzer.pitch(1400, 100)
        except: pass
        
        # 等待用户手指松开按键
        while button_b.value() == 0:
            time.sleep(0.02)
        time.sleep(0.08) # 消除物理弹片抖动
        
    time.sleep(0.02)
