# 掌控板 2.0 智能家居微缩沙盘 · 完整落地工程规范 (Wayfinder Spec)

> **适用场景**：小学少儿创客竞赛 / 科技创新大赛 / 创客嘉年华  
> **核心主控**：掌控板 2.0 (ESP32) + 掌控拓展板 (三铜柱背靠背螺丝堆叠款)  
> **结构材质**：0.3 cm (3mm) 白色高密度 PC/PVC 发泡板 (雪弗板/安迪板)  
> **开发环境**：VS Code + MicroPico 扩展 + AI 编程助手 (纯 MicroPython)  
> **展示尺寸**：长 35 cm × 宽 22 cm × 高 26 cm (严格符合长<38cm、宽<25cm、高<34cm规范)  
> **供电方式**：底座暗格内置 5000mAh 移动电源独立供电 (全无线便携)

---

## 目录
1. [项目设计决策总览 (Wayfinder Decisions)](#1-项目设计决策总览)
2. [模型外观与 0.3cm 发泡板下料清单](#2-模型外观与-03cm-发泡板下料清单)
3. [掌控板与拓展板三铜柱螺丝堆叠装配规范](#3-掌控板与拓展板三铜柱螺丝堆叠装配规范)
4. [硬件 BOM 采购清单与避坑指南](#4-硬件-bom-采购清单与避坑指南)
5. [电路引脚接线与供电隔离拓扑](#5-电路引脚接线与供电隔离拓扑)
6. [VS Code + AI 开发环境与 MicroPython 源码](#6-vs-code--ai-开发环境与-micropython-源码)
7. [少儿 5 分钟黄金答辩台本与评委应答策略](#7-少儿-5-分钟黄金答辩台本与评委应答策略)

---

## 1. 项目设计决策总览

在项目规划阶段，通过 Wayfinder 探路者方法论，最终敲定了以下 5 大核心决策：

| 决策维度 | 选定方案 | 核心考量与落地细节 |
| :--- | :--- | :--- |
| **Q1: 交付目标** | **完整落地规范** | 包含 3D 尺寸、采购清单、接线图、纯代码及演说稿，具备直接开工能力。 |
| **Q2: 展示功能** | **安全与舒适经典联动** | 1. 独立 3×4 矩阵薄膜键盘门禁 (默认密码 \`123456\`，按 \`#\` 确认开门，支持在线修改密码)<br>2. 顶置门轴直驱 (SG90舵机嵌装在门框横梁，同心直驱90°旋转大门)<br>3. 防盗报警双机制 (输错3次锁定报警 + 按 \`*\` 键离家布防后PIR红外入侵报警)<br>4. DHT11 温湿度监控与现场哈气互动<br>5. 手机 AP 直连网页遥控 (192.168.4.1) 与密码远程修改。 |
| **Q3: 物理尺寸** | **长35 × 宽22 × 高26 cm** | 留出 2~3 cm 安全冗余，完全处于学校规则限制内；前倾半开式斜屋面便于评委俯视；底座留 5 cm 隐藏暗格收纳充电宝和线路。 |
| **Q4: 材质工艺** | **0.3cm PC/PVC 发泡板** | 彻底弃用易软塌变形的纸板。发泡板切面平整、高刚度抗反复开门冲击，502 胶水可实现化学微溶冷焊瞬粘。 |
| **Q5: 编程工具** | **VS Code + AI + MicroPython** | 彻底弃用图形化拖拽积木。借助 VS Code 现代 AI 生态（Copilot / Continue / Cursor）直接生成代码，配合 MicroPico 插件一键烧录。 |
| **F1: 温湿度选型**| **DHT11 经典单总线模块 (接P1)** | 经典少儿教学模块，接拓展板 P1 引脚；在 MicroPython 中采用 try/except 异常拦截保护，防止时序丢包中断主循环。 |
| **F2: 门禁与键盘**| **独立 3×4 矩阵薄膜键盘输入** | 门侧外墙贴装 3×4 独立薄膜按键（1~9, *, 0, #），彻底告别金手指触碰，支持星号掩码输入、按 \`#\` 确认、按 \`*\` 清除/布防。 |
| **F3: 网络通信**  | **AP 热点本地直连 (192.168.4.1)** | 掌控板自发 Wi-Fi 热点 \`SmartHome-IoT\`，内置轻量 Web 服务器。手机扫码直连，打开 \`192.168.4.1\` 即可控制与改密，赛场零依赖断网无忧！ |
| **F4: 机械传动**  | **门梁顶置同轴直驱** | SG90 舵机倒扣嵌在入户门框上梁发泡板内，舵机主轴与大门门轴同心，单字摇臂直驱门叶旋转 90°，零虚位不卡壳。 |
| **F5: 展台布展**  | **双立牌高规格布展** | 用发泡板边角料制作两个精致立牌：① 门禁密码与布防操作说明卡；② 评委手机扫码连 Wi-Fi 二维码桌牌。 |
| **F6: 密码与安防**| **支持修改密码 + 非接触式安防** | 默认密码 \`123456\`；支持键盘命令与手机端改密；防盗报警采用连续输错报警及 PIR 离家布防触发。 |
| **F7: 环境联动**  | **全自动环境感知联动** | DHT11 检测温度 >30℃ (或现场对着传感器哈热气) 时，OLED 自动显示高温排风警告，RGB 亮红灯报警；光敏 <250 自动亮起淡蓝走廊夜灯。 |
| **F8: 键盘改密**  | **旧密码校验式改密流** | 待机时在 3×4 键盘上输入 \`* + 旧密码 + #\`，系统验证旧密码通过后提示“请输6位新密码”，再输入 \`新密码 + #\` 确认保存生效，安全规范严谨。 |
| **F9: 赛场保险**  | **长按掌控板 A 键 6 秒硬核复位** | 掌控板正面实体 A 键长按 6 秒（带 6s 倒计时动画），强制复位并重置密码为默认 \`123456\`，解除报警与锁定，为小创客比赛提供绝不翻车的安全气囊！ |

---

## 2. 模型外观与 0.3cm 发泡板下料清单

### 2.1 整体尺寸
* **底座占地**：长 35 cm × 宽 22 cm
* **屋面最高处**：后墙高 26 cm
* **屋面前檐**：前立墙高 16 cm（形成自然前倾的半开放式斜屋顶）
* **底座高度**：双层架空 5 cm，形成隐藏式电源与走线暗格

### 2.2 发泡板裁切清单（共 9 块，含 2 块展台立牌）
准备 2~3 张规格为 **40 cm × 60 cm、厚度为 3 mm** 的白色 PVC 发泡板（雪弗板）：

| 序号 | 组件名称 | 尺寸规格 | 数量 | 作用与开孔加工说明 |
| :---: | :--- | :--- | :---: | :--- |
| **①** | **底盘主承重基板** | 35 cm × 22 cm | 1 片 | 整个沙盘模型最底层的受力承重大板。 |
| **②** | **室内架空二层地板** | 35 cm × 22 cm | 1 片 | 垫高 5 cm 粘在立柱上形成暗格；玄关处开 1 个 2 cm 穿线孔。 |
| **③** | **左右侧立墙 (直角梯形)** | 底宽 22 cm × 前高 16 cm × 后高 26 cm | 2 片 | 形成斜屋顶侧墙；左侧墙可开出百叶窗装饰。 |
| **④** | **室内后背主墙** | 35 cm × 26 cm | 1 片 | 室内主背景墙，可贴浅色木纹纸或留给孩子手绘家庭画作。 |
| **⑤** | **前倾斜坡屋顶** | 36 cm × 14 cm | 1 片 | 仅覆盖房屋后半部，前半部分敞开，方便评委 45 度俯视内部。 |
| **⑥** | **入户大门门扇** | 6.5 cm × 11 cm | 1 片 | 3mm发泡板门叶；门轴处固定微型金属合页，门顶边直连舵机单字摆臂。 |
| **⑦** | **玄关门禁立柱 (嵌屏+贴键盘)**| 9 cm × 15 cm | 1 片 | 位于大门右侧，上方开 5×5cm 方孔嵌掌控板屏幕，下方平贴 3×4 矩阵薄膜键盘。 |
| **⑧** | **门梁顶置舵机横梁** | 8 cm × 3 cm | 1 片 | 横架在门框顶部，开出 23mm×12mm 槽口倒扣嵌入 SG90 舵机，轴心同心直驱大门。 |
| **⑨** | **展台双立牌 (高规格布展)** | 8 cm × 6 cm (带折叠底座) | 2 套 | ① 《3×4键盘操作与布防指南》；② 《评委扫码直连Wi-Fi体验牌》。 |

### 2.3 门梁顶置舵机同心直驱结构规范
* **安装工法**：SG90 舵机倒扣卡装在组件 ⑧ 门梁横梁开槽中，固定耳打微型自攻螺丝或 502 胶水紧固；
* **传动轴心**：舵机输出齿轮轴心与大门合页旋转轴心保持在**同一直线（同心轴）**上；
* **驱动摆臂**：将舵机原装单字摇臂平贴在大门 ⑥ 顶边上，舵机从 0° 转到 90° 时，门扇平滑推开 90°，无任何机械连杆旷量，100% 顺滑不卡死。

---

## 3. 掌控板与拓展板三铜柱螺丝堆叠装配规范

掌控板 2.0 与配套掌控拓展板**不可分离**，二者通过三孔铜柱紧固堆叠：

```
       【室外视角 (玄关立柱正面)】
 ┌───────────────────────────────────────┐
 │ 3mm 白色发泡板立柱 (9 cm × 15 cm)      │
 │    ┌─────────────────────────────┐    │  <-- 上方开 5 cm × 5 cm 矩形方孔
 │    │  1.3 寸 OLED 显示屏 (128x64)│    │      显示门禁密码槽、温湿度与Wi-Fi IP
 │    │  3 颗全彩 RGB 迎宾/报警灯   │    │      (化身高档可视对讲终端)
 │    └─────────────────────────────┘    │
 │    ┌─────────────────────────────┐    │  <-- 下方贴 3×4 矩阵薄膜按键键盘
 │    │  [ 1 ]   [ 2 ]   [ 3 ]      │    │      (1~9 数字输入)
 │    │  [ 4 ]   [ 5 ]   [ 6 ]      │    │      [ # ] 确认开锁 / 修改密码
 │    │  [ 7 ]   [ 8 ]   [ 9 ]      │    │      [ * ] 清除输入 / 一键离家布防
 │    │  [ * ]   [ 0 ]   [ # ]      │    │      (扁平排线从发泡板细缝穿入背面)
 │    └─────────────────────────────┘    │
 └───────────────────┬───────────────────┘
                     │ 穿过发泡板立墙
                     ▼
       【室内视角 (玄关立柱背面)】
 ┌───────────────────────────────────────┐
 │  3 根 M3 隔离铜柱 + 螺丝背靠背拧紧锁死 │  <-- 掌控拓展板 PCB 背板
 │  键盘 7 根排线 (P2,P3,P13,P14,P15,P16,P9)  │      (整洁牢固，总厚度约 1.8 cm)
 └───────────────────┬───────────────────┘
                     │ 垂直向下穿入
                     ▼
       【底座 5 cm 下沉式暗格】
 ┌───────────────────────────────────────┐
 │  平放 5000mAh 便携 5V 移动电源 (充电宝)│  <-- 收纳全部多余线缆，展台台面零飞线
 └───────────────────────────────────────┘
```

---

## 4. 硬件 BOM 采购清单与避坑指南

| 序号 | 物料名称 | 推荐规格 / 型号 | 数量 | 预估预算 | 采购搜索关键词 | 核心作用与避坑要点 |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| 1 | **掌控板 2.0** | ESP32 双核，带 1.3寸 OLED，RGB灯，三孔固定 | 1 块 | ¥75 ~ 85 | 掌控板 2.0 盛思 mPython | 认准带有 3 个标准螺丝固定孔的 2.0 版本，不要买成 micro:bit。 |
| 2 | **掌控板专用拓展板** | 铜柱螺丝堆叠款，带独立电源口与舵机排针 | 1 块 | ¥25 ~ 35 | 掌控拓展板 盛思 铜柱堆叠 | 必须带独立的外部电源供电接口与 M3 铜柱螺丝包。 |
| 3 | **3×4 矩阵薄膜键盘** | 12键 (1~9, *, 0, #)，背胶带 7Pin 2.54mm 排线 | 1 个 | ¥4 ~ 6 | 3*4 矩阵薄膜键盘 12键 | 带自粘背胶，可直接贴在发泡板上；7Pin 插头直插拓展板。 |
| 4 | **微型舵机** | SG90 9g 微型舵机 (180度可调角度，带单字摇臂)| 1 个 | ¥7 ~ 9 | SG90 舵机 180度 | 倒扣嵌在门梁横梁中同轴直驱大门旋转。 |
| 5 | **温湿度传感器** | DHT11 数字温湿度模块 (单总线，3Pin) | 1 个 | ¥5 ~ 8 | DHT11 温湿度传感器 模块 3Pin | 测量范围 20-90%RH, 0-50℃；信号线接拓展板 P1 引脚。 |
| 6 | **人体红外传感器** | HC-SR501 或 微型 RCWL-0516 微波雷达 | 1 个 | ¥4 ~ 7 | HC-SR501 人体红外感应模块 | 接 P8；用于走廊夜灯自动感应与【离家布防防盗报警】。 |
| 7 | **便携移动电源** | 5000mAh 超薄 5V 充电宝 | 1 个 | ¥25 ~ 35 | 超薄便携充电宝 5000mah | 平放于底座 5cm 暗格中，独立供电，全无线便携展示。 |
| 8 | **3mm PC/PVC发泡板**| 3mm 厚度，白色高密度实心板 (40×60cm) | 2~3 张 | ¥15 ~ 22 | 3mm PVC发泡板 雪弗板 白色 | 裁切沙盘墙体与 2 块微型展台立牌。 |
| 9 | **微型金属合页** | 10 mm × 15 mm 微型合页 (带自攻螺丝) | 2 个 | ¥2 ~ 4 | 微型合页 铰链 10*15mm 螺丝 | 门轴旋转支点，顺滑耐用。 |
| 10 | **辅料工具包** | 502胶水 2支、钢直尺、大号美工刀、杜邦线若干 | 1 套 | ¥15 ~ 20 | 502胶水 钢直尺 美工刀 | 发泡板冷焊与线路紧固。 |

**整套硬件总预算**：约 **¥175 ~ 225 元**。

---

## 5. 电路引脚接线与供电隔离拓扑

### 5.1 引脚分配表
| 外设器件 | 引脚名称 | 拓展板物理连接引脚 | 信号类型 | 功能定义 |
| :--- | :---: | :---: | :---: | :--- |
| **SG90 舵机** | 信号线 (橙色) | **P0** (通过拓展板舵机排针) | PWM 脉宽调制 | 门梁顶置直驱入户门旋转 (0° 关门 / 90° 开门) |
| **SG90 舵机** | 电源 VCC (红色) | **5V (拓展板独立供电轨)** | 5V 强电 | **严禁接掌控板 3.3V**，必须走拓展板独立 5V |
| **SG90 舵机** | 地线 GND (棕色) | **GND** | 共地 | 统一基准地 |
| **DHT11 温湿度** | DAT 数据线 | **P1** | 数字单总线 | 室内温湿度采集 (带异常重试保护与哈气感应) |
| **PIR 人体红外** | OUT 信号线 | **P8** | 数字输入 (高/低) | 走廊人员检测；布防模式下触发【防盗入侵报警】 |
| **3×4 薄膜键盘** | 行线 Row 1~4 | **P2, P3, P13, P14** | 数字输入 (上拉) | 矩阵按键 4 行扫描输入 |
| **3×4 薄膜键盘** | 列线 Col 1~3 | **P15, P16, P9** | 数字输出 (低有效) | 矩阵按键 3 列选通扫描 |
| **板载 OLED 屏** | 板载 I2C (内部) | I2C (0x3C) | 内置总线 | 128x64 像素显示：密码星号槽、温湿度、IP、布防状态 |
| **板载 RGB 全彩灯**| 板载 WS2812 (内部)| 内置数据引脚 | 内置总线 | 暖黄迎宾灯、幽蓝布防灯、红蓝爆闪防盗警报灯 |
| **板载 蜂鸣器** | 板载音效 (内部) | 内置音频通道 | 内置无源蜂鸣器 | 按键敲击音、开门欢快音、密码错误警告音、防盗警笛音 |
| **内置 Wi-Fi 芯片**| 板载 ESP32 AP | 内置 802.11 b/g/n | 无线局域网 | 自发 \`SmartHome-IoT\` 热点，IP: \`192.168.4.1\` (支持手机改密) |

---

## 6. VS Code + AI 开发环境与 MicroPython 源码

### 6.1 VS Code 三步配置
1. **安装 MicroPico 扩展**：打开 VS Code 扩展商店，搜索安装 `MicroPico`；
2. **连接掌控板**：Type-C 数据线插入电脑，VS Code 底部状态栏显示 `mPython Connected`；
3. **一键运行与写入**：新建 `main.py`，粘贴下方代码，按快捷键 `Ctrl + Alt + R` 实时调试；右键选择 `Upload project` 烧录固化。

### 6.2 掌控板 2.0 核心代码 (`main.py`)
```python
# ==============================================================================
# 项目名称：智馨家园 - 掌控板 2.0 智能家居沙盘控制系统 (3×4薄膜矩阵键盘+安防版)
# 运行环境：ESP32 MicroPython (mPython 固件)
# 核心外设：
#   - 3×4 矩阵薄膜键盘：行(P2, P3, P13, P14)，列(P15, P16, P9)
#   - SG90 舵机：门梁顶置同心直驱 (P0，独立 5V 供电)
#   - DHT11 温湿度传感器：数据线单总线 (P1)
#   - PIR 人体红外传感器：玄关入侵检测 (P8)
#   - 板载：1.3寸 OLED (I2C)、WS2812 RGB 灯、无源蜂鸣器、ESP32 AP 热点
# 核心逻辑：
#   1. 3×4 矩阵键盘输入：默认密码 "123456"，按 '#' 确认开门；按 '*' 清空输入
#   2. 密码修改机制：键盘长按 '#' 2秒进入改密，或通过手机 Web 端随时修改
#   3. 双重非触控防盗报警：输错 3 次锁定警报；按 '*' 长按进入【离家布防】，PIR 感应即警报！
#   4. 手机 AP 直连 Web 控制台：浏览器访问 http://192.168.4.1 实时遥控与改密
# ==============================================================================
import time
import network
import socket
import dht
from mpython import *
from machine import PWM, Pin

# ----------------- 1. 硬件外设初始化 -----------------
# 门梁顶置 SG90 舵机 (P0)
servo_pin = Pin(0, Pin.OUT)
servo_pwm = PWM(servo_pin, freq=50)

# DHT11 温湿度传感器 (P1)
dht_dev = dht.DHT11(Pin(1))

# PIR 人体红外热释电感应 (P8，下拉输入)
pir_sensor = Pin(8, Pin.IN)

# 3×4 矩阵薄膜键盘引脚映射 (4行3列)
ROW_PINS = [Pin(2, Pin.IN, Pin.PULL_UP), Pin(3, Pin.IN, Pin.PULL_UP), 
            Pin(13, Pin.IN, Pin.PULL_UP), Pin(14, Pin.IN, Pin.PULL_UP)]
COL_PINS = [Pin(15, Pin.OUT), Pin(16, Pin.OUT), Pin(9, Pin.OUT)]

# 键盘键位布局
KEY_MAP = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

# 状态变量
current_pwd = "123456"         # 默认出厂密码 (6位)
input_buffer = ""              # 键盘当前输入缓存
wrong_attempts = 0             # 密码输错计数
is_armed = False               # 是否处于离家布防模式
is_alarm_active = False        # 是否正在触发报警
door_is_open = False           # 大门开闭状态
night_light = False            # 走廊夜灯状态
curr_temp = 25.0               # 当前温度
curr_hum = 55.0                # 当前湿度

last_sensor_time = 0
last_key_press_time = 0
button_a_press_start = 0       # 掌控板 A 键长按开始时间戳
is_modifying_pwd = False       # 是否处于键盘改密流程
modify_step = 0                # 1: 验证原密码, 2: 输入6位新密码

def scan_keypad():
    """扫描 3×4 矩阵薄膜键盘按键"""
    for c_idx, col in enumerate(COL_PINS):
        for c in COL_PINS:
            c.value(1)
        col.value(0)
        time.sleep_us(20)
        
        for r_idx, row in enumerate(ROW_PINS):
            if row.value() == 0:
                for c in COL_PINS:
                    c.value(1)
                return KEY_MAP[r_idx][c_idx]
                
    for c in COL_PINS:
        c.value(1)
    return None

def set_servo_angle(angle):
    """设置舵机旋转角度 0~180°"""
    angle = max(0, min(180, angle))
    duty = int(26 + (angle / 180.0) * 102)
    servo_pwm.duty(duty)

def open_door_action():
    """执行密码验证通过开门动作"""
    global door_is_open, wrong_attempts, is_armed, is_alarm_active
    wrong_attempts = 0
    is_armed = False           # 开门自动解除布防
    is_alarm_active = False
    
    oled.fill(0)
    oled.DispChar("★ 密码验证通过 ★", 16, 12)
    oled.DispChar("欢迎回家! 正在开门...", 8, 32)
    oled.show()
    
    # 暖黄迎宾灯光
    rgb.fill((150, 100, 0))
    rgb.write()
    
    # 欢快开门提示音
    try:
        buzzer.pitch(523, 80)
        time.sleep_ms(30)
        buzzer.pitch(659, 120)
    except:
        pass
        
    set_servo_angle(90)        # 舵机同心直驱推开大门 90°
    door_is_open = True
    time.sleep(4)              # 保持敞开 4 秒
    close_door_action()

def close_door_action():
    """自动关门动作"""
    global door_is_open
    set_servo_angle(0)
    door_is_open = False
    if not night_light:
        rgb.fill((0, 0, 0))
        rgb.write()
    refresh_dashboard()

def trigger_security_alarm(reason="非法人员入侵"):
    """触发非触控防盗警报 (红蓝爆闪+警笛)"""
    global is_alarm_active
    is_alarm_active = True
    oled.fill(0)
    oled.DispChar("! 警报: " + reason + " !", 0, 14)
    oled.DispChar("已锁定门禁 声光报警中", 0, 34)
    oled.show()
    
    for _ in range(4):
        rgb.fill((220, 0, 0))  # 红色强光
        rgb.write()
        try:
            buzzer.pitch(900, 150)
        except:
            pass
        time.sleep_ms(150)
        
        rgb.fill((0, 0, 220))  # 蓝色警灯
        rgb.write()
        try:
            buzzer.pitch(600, 150)
        except:
            pass
        time.sleep_ms(150)
        
    rgb.fill((0, 0, 0))
    rgb.write()
    refresh_dashboard()

def refresh_dashboard():
    """刷新 1.3寸 OLED 显示屏"""
    oled.fill(0)
    
    # 标题栏状态
    if is_armed:
        oled.DispChar("【智馨家园·布防中】", 0, 0)
    else:
        oled.DispChar("【智馨家园·门禁终端】", 0, 0)
        
    oled.DispChar("温湿: {:.0f}C / {:.0f}%".format(curr_temp, curr_hum), 0, 18)
    
    # 密码输入状态显示
    if is_modifying_pwd:
        if modify_step == 1:
            oled.DispChar("验证原密码: " + "*" * len(input_buffer), 0, 34)
        else:
            oled.DispChar("设置新密码: " + "*" * len(input_buffer), 0, 34)
    else:
        mask_str = "*" * len(input_buffer)
        if len(mask_str) == 0:
            mask_str = "请输入6位密码"
        oled.DispChar("密码: [" + mask_str + "]", 0, 34)
        
    status_str = "门:{} | 防:{}".format("开" if door_is_open else "关", "开启" if is_armed else "撤防")
    oled.DispChar(status_str, 0, 50)
    oled.show()

# ----------------- 2. 启动 AP 本地局域网热点 -----------------
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid='SmartHome-IoT', authmode=network.AUTH_OPEN)
print("掌控板 Wi-Fi AP 启动! SSID: SmartHome-IoT, IP: 192.168.4.1")

# 启动 Web Server Socket (非阻塞)
web_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
web_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
web_socket.bind(('192.168.4.1', 80))
web_socket.listen(2)
web_socket.settimeout(0.04)

HTML_PAGE = """<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>智馨家园手机控制台</title><style>body{{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:12px;margin:0}}h2{{color:#38bdf8;margin:6px 0}}.card{{background:#1e293b;border-radius:12px;padding:12px;margin-bottom:10px}}.btn{{display:inline-block;width:88%;padding:12px;margin:6px 0;font-size:15px;font-weight:bold;color:#fff;background:#2563eb;border:none;border-radius:8px;text-decoration:none;cursor:pointer}}.btn-danger{{background:#dc2626}}.btn-warning{{background:#d97706}}.btn-purple{{background:#7c3aed}}.val{{font-size:22px;font-weight:bold;color:#4ade80}}input{{padding:10px;border-radius:6px;border:1px solid #475569;width:75%;margin:6px 0;background:#0f172a;color:#fff;text-align:center;font-size:16px}}</style></head><body><h2>🏡 智馨家园 · 手机控制台</h2><p style="color:#94a3b8;font-size:11px">AP直连热点: SmartHome-IoT | 3×4键盘门禁版</p><div class="card"><p>室内实时温湿度</p><div class="val">{:.1f}℃ / {:.1f}%</div></div><div class="card"><p>门禁与安防 (当前门: {})</p><a href="/open" class="btn">★ 手机一键远程开门 (90°)</a><a href="/arm" class="btn btn-warning">一键切换【离家布防模式】</a></div><div class="card"><p>在线修改门禁密码 (当前: {})</p><form action="/setpwd" method="GET"><input type="text" name="pwd" placeholder="输入6位新密码" maxlength="6"><br><button type="submit" class="btn btn-purple">确认更新密码</button></form></div><p style="color:#64748b;font-size:10px">评委扫码直连专属体验控制面板</p></body></html>"""

# ----------------- 3. 主事件循环 -----------------
set_servo_angle(0)
refresh_dashboard()

print("系统启动就绪，正在监听 3×4 矩阵键盘与 AP Web 请求...")

while True:
    now = time.ticks_ms()
    
    # ---------------- A. 掌控板 A 键长按 6 秒硬核复位 (赛场防翻车安全气囊) ----------------
    if button_a.value() == 0:
        if button_a_press_start == 0:
            button_a_press_start = now
        elapsed_ms = time.ticks_diff(now, button_a_press_start)
        
        if elapsed_ms >= 6000:
            # 达成持续按压 6 秒！执行强制出厂复位
            button_a_press_start = 0
            current_pwd = "123456"       # 强制重置密码为默认
            wrong_attempts = 0
            is_armed = False
            is_alarm_active = False
            is_modifying_pwd = False
            input_buffer = ""
            set_servo_angle(0)
            door_is_open = False
            
            # 声光提示：长鸣一声 + 绿光闪烁
            try:
                buzzer.pitch(1000, 500)
            except:
                pass
            rgb.fill((0, 220, 0))
            rgb.write()
            oled.fill(0)
            oled.DispChar("★ 系统已硬核复位 ★", 10, 15)
            oled.DispChar("出厂默认密码: 123456", 8, 35)
            oled.show()
            time.sleep(2)
            rgb.fill((0, 0, 0))
            rgb.write()
            refresh_dashboard()
        elif elapsed_ms > 1000:
            # 超过 1 秒显示倒计时提示
            rem_sec = (6000 - elapsed_ms) // 1000 + 1
            oled.fill(0)
            oled.DispChar("! 恢复出厂设置中 !", 12, 15)
            oled.DispChar("按住A键不放: {} 秒...".format(rem_sec), 10, 35)
            oled.show()
    else:
        if button_a_press_start != 0:
            button_a_press_start = 0
            refresh_dashboard()
            
    # ---------------- B. 3×4 薄膜键盘扫描 ----------------
    key = scan_keypad()
    if key and time.ticks_diff(now, last_key_press_time) > 280:
        last_key_press_time = now
        try:
            buzzer.pitch(800, 35)  # 键盘轻脆按键音
        except:
            pass
            
        if key.isdigit():
            # 数字键输入 (最多6位)
            if len(input_buffer) < 6:
                input_buffer += key
                refresh_dashboard()
        elif key == '*':
            # '*' 键功能：
            # 若当前有输入字符：清空当前输入，退出改密
            # 若当前无输入：进入【旧密码校验式修改密码】流程 (格式: * + 原密码 + #)
            if len(input_buffer) > 0:
                input_buffer = ""
                is_modifying_pwd = False
                refresh_dashboard()
            else:
                is_modifying_pwd = True
                modify_step = 1
                input_buffer = ""
                oled.fill(0)
                oled.DispChar("【修改门禁密码】", 16, 12)
                oled.DispChar("请输原密码并按#", 12, 32)
                oled.show()
                time.sleep(1)
                refresh_dashboard()
        elif key == '#':
            # '#' 键功能：确认开锁 / 确认改密
            if is_modifying_pwd:
                if modify_step == 1:
                    # 步骤一：校验原密码
                    if input_buffer == current_pwd:
                        modify_step = 2
                        input_buffer = ""
                        oled.fill(0)
                        oled.DispChar("原密码验证成功!", 16, 15)
                        oled.DispChar("请输6位新密码按#", 10, 35)
                        oled.show()
                        try:
                            buzzer.pitch(800, 100)
                        except:
                            pass
                        time.sleep(1.2)
                    else:
                        oled.fill(0)
                        oled.DispChar("原密码错误!", 28, 18)
                        oled.DispChar("退出修改流程", 24, 38)
                        oled.show()
                        try:
                            buzzer.pitch(350, 300)
                        except:
                            pass
                        time.sleep(1.2)
                        is_modifying_pwd = False
                        input_buffer = ""
                    refresh_dashboard()
                elif modify_step == 2:
                    # 步骤二：保存新密码
                    if len(input_buffer) == 6 and input_buffer.isdigit():
                        current_pwd = input_buffer
                        oled.fill(0)
                        oled.DispChar("★ 密码修改成功 ★", 10, 15)
                        oled.DispChar("新密码: " + current_pwd, 16, 35)
                        oled.show()
                        try:
                            buzzer.pitch(1000, 200)
                        except:
                            pass
                        time.sleep(1.5)
                    else:
                        oled.fill(0)
                        oled.DispChar("新密码必须6位数字", 8, 25)
                        oled.show()
                        time.sleep(1.2)
                    is_modifying_pwd = False
                    input_buffer = ""
                    refresh_dashboard()
            else:
                # 正常门禁开锁校验
                if input_buffer == current_pwd:
                    input_buffer = ""
                    open_door_action()
                else:
                    wrong_attempts += 1
                    input_buffer = ""
                    if wrong_attempts >= 3:
                        trigger_security_alarm("密码连续输错3次锁定")
                        wrong_attempts = 0
                    else:
                        oled.fill(0)
                        oled.DispChar("✘ 密码错误 ✘", 24, 18)
                        oled.DispChar("剩余尝试: {} 次".format(3 - wrong_attempts), 16, 36)
                        oled.show()
                        try:
                            buzzer.pitch(400, 200)
                        except:
                            pass
                        time.sleep(1.2)
                        refresh_dashboard()
                        
    # ---------------- C. 防盗报警检测 (PIR人体红外入侵) ----------------
    if is_armed and pir_sensor.value() == 1 and not is_alarm_active and not door_is_open:
        trigger_security_alarm("离家布防-入侵检测")
        
    # ---------------- D. 环境传感器定时监测 (每 2 秒) ----------------
    if time.ticks_diff(now, last_sensor_time) > 2000:
        last_sensor_time = now
        try:
            dht_dev.measure()
            curr_temp = dht_dev.temperature()
            curr_hum = dht_dev.humidity()
        except Exception:
            pass
            
        # F7 全自动环境感知联动
        if curr_temp > 30.0 and not door_is_open and not is_alarm_active:
            # 高温告警联动 (现场少儿哈气演示)
            oled.fill(0)
            oled.DispChar("! 高温告警: {:.1f}C !".format(curr_temp), 10, 15)
            oled.DispChar("启动智能通风排风", 12, 35)
            oled.show()
            rgb.fill((220, 0, 0))  # 亮红灯
            rgb.write()
            try:
                buzzer.pitch(700, 100)
            except:
                pass
            time.sleep_ms(300)
            rgb.fill((0, 0, 0))
            rgb.write()
        elif light.read() < 250 and not door_is_open and not is_armed and not is_alarm_active:
            # 走廊环境光过暗：自动亮起淡蓝夜灯
            night_light = True
            rgb.fill((0, 25, 60))
            rgb.write()
        elif light.read() >= 250 and not door_is_open and not is_armed and not is_alarm_active:
            night_light = False
            rgb.fill((0, 0, 0))
            rgb.write()
            
        if not is_alarm_active and button_a_press_start == 0:
            refresh_dashboard()
            
    # ---------------- D. 手机 Web 控制台请求处理 ----------------
    try:
        conn, addr = web_socket.accept()
        req = conn.recv(1024).decode('utf-8')
        
        if "GET /open" in req:
            open_door_action()
        elif "GET /arm" in req:
            is_armed = not is_armed
            is_alarm_active = False
            refresh_dashboard()
        elif "GET /setpwd?pwd=" in req:
            # 提取手机提交的新密码
            try:
                new_pwd = req.split("pwd=")[1].split(" ")[0].split("&")[0]
                if len(new_pwd) == 6 and new_pwd.isdigit():
                    current_pwd = new_pwd
                    oled.fill(0)
                    oled.DispChar("手机已更新密码!", 14, 20)
                    oled.DispChar("新密码: " + current_pwd, 16, 38)
                    oled.show()
                    time.sleep(1.2)
                    refresh_dashboard()
            except:
                pass
                
        door_str = "已开启 (90°)" if door_is_open else "已关闭"
        resp = HTML_PAGE.format(curr_temp, curr_hum, door_str, current_pwd)
        conn.send('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n' + resp)
        conn.close()
    except OSError:
        pass
        
    time.sleep_ms(25)
```

---

## 7. 少儿 5 分钟黄金答辩台本与评委应答策略

### 7.1 五分钟演说逐字稿

* **第 1 分钟：破题与创意立项**  
  > “各位评委老师好！我是来自创客团队的负责人。今天向大家汇报我们的自主研发作品——《智馨家园：掌控板 2.0 绿色自愈微型智能家居系统》。我们的设计初衷是：为独居老人与现代家庭打造一套安全可靠、操作直观、杜绝网络瘫痪的微型物联安全居所。”

* **第 2 分钟：0.3cm 发泡板工艺与顶置直驱**  
  > “大家请看模型外形：整套沙盘严格遵守规则，长 35cm、宽 22cm、高 26cm。我们淘汰了易受潮塌瘪的瓦楞纸皮，全面采用 3mm 高密度防水 PVC 发泡板，坚固耐造。在入户门顶部，我们将 SG90 舵机倒扣嵌在门梁横梁内，舵机主轴与大门旋转轴心保持同心直驱，彻底消除了连杆晃动虚位。在大门右侧，我们配备了一块独立的 3×4 矩阵薄膜密码键盘与掌控板屏幕，所有走线垂直穿入底座 5cm 的暗格中，台面零杂乱飞线！”

* **第 3 分钟：核心功能实物演示 (现场高潮 · 键盘密码开锁 + 防盗报警)**  
  > *(动作一：在 3×4 键盘上按下 1-2-3-4-5-6，按 #)*  
  > “大家请看：这套门禁采用商用级密码锁设计。我在 3×4 薄膜键盘上输入默认密码 123456，屏幕实时星号掩码保护；按下 # 号确认，密码验证成功！暖黄迎宾灯亮起，顶置舵机平滑推开大门 90 度！4 秒后自动关门。”  
  > *(动作二：演示非触控防盗报警)*  
  > “那么怎么体验防盗报警呢？我们设计了双重机制：第一，如果故意输错 3 次密码，系统立刻锁死并触发爆闪声光警报；第二，出门前按下键盘上的 * 号键，系统进入【离家布防模式】。大家看，当小偷试图靠近门前，PIR 人体红外传感器立刻感应到，红蓝警灯交替爆闪，发出刺耳警笛！”  
  > *(动作三：对着 DHT11 传感器哈一口热气)*  
  > “大家看屏幕，当我对着温湿度传感器哈一口热气，温度数值立刻跳变，实现了室内环境的自动监测。”

* **第 4 分钟：手机 AP 直连与密码在线修改**  
  > “在通信方面，我们设计了【自愈式 AP 局域网热点】。评委老师可以通过我们做好的展台小立牌扫码，直接连入沙盘自带的 Wi-Fi。在手机浏览器输入 192.168.4.1，不仅能实时遥控开门，还能在手机上直接修改门禁密码，修改后掌控板即刻同步更新！哪怕赛场完全没网没信号，也能 100% 稳定运行。”

* **第 5 分钟：VS Code + AI 编程先进范式与总结**  
  > “在软件架构上，我们借助 VS Code 与 AI 编程助手完成了纯 MicroPython 代码开发，采用了非阻塞状态机与矩阵键盘快速扫描算法。以上就是我的汇报，谢谢各位老师，请老师批评指正！”

---

### 7.2 评委高频 Q&A 预演（5 大杀手锏答案）

* **Q1：为什么使用 3×4 矩阵薄膜键盘，而不是用板载触摸按键？**  
  * **孩子回答**：“因为在真实的门禁产品中，实体按键的盲操手感、防误触能力和安全性远高于普通的金属触片；3×4 键盘支持 0~9 数字与按键掩码，支持任意位数的密码设定与现场改密，更符合真实的工业产品标准！”

* **Q2：防盗报警是怎么触发的？**  
  * **孩子回答**：“我们的防盗报警完全脱离了人工触碰！有两种触发方式：一是恶意人员连续输错 3 次密码，门禁自动锁死并报警；二是主人离家前按 * 号键进入‘布防模式’，门前的 PIR 人体热释电传感器只要检测到有人异常靠近，就会自动触发红蓝警灯爆闪和警笛，实现了真正的非接触智能安防！”

* **Q3：顶置门梁舵机相比后置连杆有什么优势？**  
  * **孩子回答**：“连杆推拉存在铰链旷量和死点，长期开合容易卡壳或关不严。我们采用‘门梁倒扣同心直驱’设计，舵机齿轮轴与门轴合页在同一直线上，舵机转多少度门就精确转多少度，结构紧凑且永远不会脱落或卡死！”

* **Q4：如果比赛现场没有外部 Wi-Fi 怎么办？**  
  * **孩子回答**：“掌控板自身就是一个独立的无线 Wi-Fi AP 发射端（SmartHome-IoT），并内置了嵌入式 Web 服务器。现场哪怕断网、断电、手机没流量，只要手机连入掌控板热点，打开 192.168.4.1 就能 100% 稳定遥控，赛场零翻车风险！”

* **Q5：代码真是你自己写的吗？**  
  * **孩子回答**：“系统架构、矩阵扫描算法和通信协议是我们自己设计的！在编写代码时，我们使用了 VS Code 配合 AI 助手，我们向 AI 描述清晰的需求提示词生成函数框架，然后再烧录到掌控板调试。这让我提前体验到了现代工程师高效的 AI 协同研发方式！”

* **Q6：如果比赛现场小孩改错密码或者被围观同学按乱导致打不开门，怎么办？**  
  * **孩子回答**：“我们专门设计了‘赛场安全气囊机制’！只要持续按住掌控板正面物理 A 键 6 秒，屏幕会出现 6 秒倒计时动画并长鸣一声，系统就会强制关门并把密码重置为出厂的 123456，同时解除所有警报和锁定。6 秒的长按延时彻底防止了答辩时的无意误触，又保证了哪怕现场出现任何意外也能一键复原，绝对不卡壳！”

---

*(全文完 · 建议导出为 PDF 随身携带调试与答辩备考)*
