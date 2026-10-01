# ==============================================================================
# 智能微型排风扇：掌控板按键/触控精准边沿调速系统
# 接线：电机黄线与橙线插 Parrot 拓展板背面的 M1 端子两孔
# 掌控板操作：
# - 按【A 键】或触碰金色【P 触控点】：循环升档调速与停转 (0档->1档->2档->3档->0档)
# - 按【B 键】或触碰金色【N 触控点】：一键切换排风/抽风方向
# ==============================================================================
from mpython import *
import time
import parrot

# 预设 4 个风速档位 (0: 停转关闭, 1: 35%微风, 2: 65%清风, 3: 100%狂风)
GEAR_NAMES = ["【0档 彻底停转】", "【1档 35% 静音微风】", "【2档 65% 自然清风】", "【3档 100% 强力狂风】"]
GEAR_SPEEDS = [0, 35, 65, 100]

gear = 0
is_forward = True

# 初始停转电机
try:
    parrot.set_speed(parrot.MOTOR_1, 0)
except Exception as e:
    print("M1驱动初始化异常:", e)

def is_a_active():
    """检测 A 键或 P 触控是否处于按下状态"""
    try:
        if button_a.is_pressed():
            return True
    except: pass
    try:
        if button_a.value() == 0:
            return True
    except: pass
    try:
        if touchPad_p.read() < 500:
            return True
    except: pass
    return False

def is_b_active():
    """检测 B 键或 N 触控是否处于按下状态"""
    try:
        if button_b.is_pressed():
            return True
    except: pass
    try:
        if button_b.value() == 0:
            return True
    except: pass
    try:
        if touchPad_n.read() < 500:
            return True
    except: pass
    return False

def refresh_screen():
    """刷新掌控板 OLED 屏幕显示"""
    base_spd = GEAR_SPEEDS[gear]
    oled.fill(0)
    oled.DispChar("★ 智能风扇按键测试 ★", 5, 2)
    oled.DispChar(GEAR_NAMES[gear], 10, 20)
    
    if gear == 0:
        oled.DispChar("按 A 键 / 摸 P ➔ 启动", 5, 38)
    else:
        dir_txt = "风向: 正向排风" if is_forward else "风向: 反向抽风"
        oled.DispChar(dir_txt, 10, 38)
        
    # 绘制档位进度条
    bar_w = int(gear * (110 / 3))
    oled.rect(5, 54, 118, 8, 1)
    if bar_w > 0:
        oled.fill_rect(7, 56, bar_w, 4, 1)
    oled.show()

# 显示开机初始画面
refresh_screen()

# 初始记录按键状态
last_a = is_a_active()
last_b = is_b_active()

print("==================================================")
print(">>> 【智能风扇多路调速测试】已就绪！")
print(">>> 当前状态：0 档静止停转。")
print(">>> 操作指引：")
print("    - 按【A 键】或摸底部金色【P点】：启动 / 升档 / 停转")
print("    - 按【B 键】或摸底部金色【N点】：切换排风/抽风方向")
print("==================================================")

while True:
    curr_a = is_a_active()
    curr_b = is_b_active()
    
    # 严格边沿跳变触发：从未按下 (False) 变成按下 (True) 的那一瞬间，仅触发一次！
    if not last_a and curr_a:
        gear = (gear + 1) % len(GEAR_SPEEDS)
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            print("电机控制异常:", e)
            
        refresh_screen()
        
        if gear == 0:
            print(">>> [操作成功] 风扇已彻底停转 (0档)！")
            try: buzzer.pitch(500, 150)
            except: pass
        else:
            print(">>> [操作成功] 切换到:", GEAR_NAMES[gear], "| 实际转速:", actual_spd)
            try: buzzer.pitch(800 + gear * 200, 80)
            except: pass
            
        time.sleep(0.1) # 消除按键物理抖动
        
    # B 键切换正反转 (同样严格边沿检测)
    if not last_b and curr_b:
        is_forward = not is_forward
        base_spd = GEAR_SPEEDS[gear]
        actual_spd = base_spd if is_forward else -base_spd
        
        try:
            parrot.set_speed(parrot.MOTOR_1, actual_spd)
        except Exception as e:
            pass
            
        refresh_screen()
        print(">>> [操作成功] 切换风向为:", "正向排风" if is_forward else "反向抽风")
        try: buzzer.pitch(1400, 100)
        except: pass
        time.sleep(0.1)
        
    last_a = curr_a
    last_b = curr_b
    time.sleep(0.02)
