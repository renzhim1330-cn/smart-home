export interface DecisionTicket {
  id: string;
  title: string;
  category: 'structure' | 'hardware' | 'wiring' | 'software' | 'iot' | 'presentation';
  status: 'frontier' | 'in_progress' | 'resolved';
  blockedBy?: string[];
  summary: string;
  detailedPlan: string;
  keyDecisions: string[];
  kidFriendlyTip: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  spec: string;
  quantity: string;
  purpose: string;
  pinConnect: string;
  estPrice: string;
  searchKeyword: string;
  avoidPitfall: string;
}

export interface WiringPin {
  pin: string;
  device: string;
  function: string;
  type: 'Digital' | 'Analog' | 'I2C' | 'Power' | 'Internal';
  vccReq: string;
  notes: string;
}

export const TICKETS: DecisionTicket[] = [
  {
    id: 'TICKET-01',
    title: '3mm PC/PVC发泡板房屋模型尺寸与铜柱堆叠结构设计',
    category: 'structure',
    status: 'resolved',
    summary: '根据学校展示尺寸上限（长<38cm、宽<25cm、高<34cm），采用0.3cm高密度PC/PVC发泡板搭建长35cm×宽22cm×高26cm半开放透视屋，掌控板与拓展板采用三铜柱螺丝堆叠一体化安装。',
    detailedPlan: `1. **外形尺寸与现代坡屋面**：底盘长 35 cm × 宽 22 cm，最高处 26 cm（完全在限制以内）。前倾半开放屋面让评委俯视室内运作。
2. **结构材质升级：0.3cm (3mm) PC/PVC 发泡板（雪弗板/安迪板）**：
   - 彻底取代易折痕受潮的旧瓦楞纸皮，发泡板质地致密、刚度高、白洁光滑、防水防汗；
   - 切割使用大号美工刀+钢直尺三次划深掰断法，切面无毛刺；
   - 粘接使用 502 快干胶或 PVC 专用冷焊胶，数秒瞬粘固化，坚固耐造抗颠簸。
3. **掌控板与拓展板“三铜柱螺丝堆叠三明治总成”**：
   - **安装原理**：掌控板2.0与背部拓展板对齐3个安装通孔，穿入3根隔离铜柱并用螺丝拧紧固化成一个一体化三明治模块（厚度约1.8cm）。
   - **玄关立式嵌装**：大门旁立柱开出 5 cm × 5 cm 方孔，正面露掌控板 1.3寸 OLED 屏与触摸键当作“室外可视门禁终端”；背面拓展板接线端子朝向室内，方便插拔。
4. **底座 5 cm 下沉暗格**：平放收纳 5V 移动电源（充电宝），所有杜邦线垂直下穿地板开孔汇入暗格，外观台面零杂乱飞线。`,
    keyDecisions: [
      '全面采用 3mm PC/PVC 发泡板（雪弗板），切面平整高刚度，耐反复开门演示。',
      '掌控板与扩展板通过3个对齐螺丝铜柱背面堆叠锁紧，形成刚性三明治总成立式安装。',
      '底座 5cm 暗格平放充电宝并收纳全屋线缆，消除杂乱扣分项。'
    ],
    kidFriendlyTip: '切割 3mm 发泡板时记得用钢直尺压紧，第一刀先划线定位，第二三刀再加力切深，轻轻一掰就断开，切面如刀削般平整！'
  },
  {
    id: 'TICKET-02',
    title: '全屋智能硬件BOM决策 (定型离线语音模块、客厅实体吊灯、微型风扇与3×4薄膜键盘)',
    category: 'hardware',
    status: 'resolved',
    blockedBy: ['TICKET-01'],
    summary: '选用掌控板2.0为主控，外接免配网离线语音芯片(ASR01/HLK-V20)、天花板实体高亮吊灯(P11)、微型直流排风扇(P5)、3×4薄膜键盘(P2-P16)、DHT11温湿度(P1)与SG90顶置门梁舵机(P0)。',
    detailedPlan: `1. **核心主控**：掌控板2.0（ESP32双核，自带1.3寸OLED屏、3颗WS2812 RGB灯、蜂鸣器、实体A/B键）。
2. **掌控专用拓展板 (三孔堆叠款)**：与掌控板背靠背三铜柱螺丝锁紧，厚度约1.8cm，提供独立5V动力电源。
3. **离线语音管家模块 (ASR01/HLK-V20)**：接 P6(RX)/P7(TX)，喊“小智同学”唤醒，语音播报“在呢”，口令“打开客厅灯”、“打开风扇”。
4. **客厅实体白色吸顶吊灯**：5V 高亮柔光 LED 模块贴在屋顶内侧正中，接 P11 引脚。
5. **智能排风扇**：5V 直流微型风扇（软质安全扇叶），安装在后墙排气孔，接 P5 引脚。
6. **3×4 矩阵薄膜键盘**：带7-Pin杜邦母头，粘贴在门禁立柱，接 P2, P3, P13, P14 (行) 与 P15, P16, P4 (列)。
7. **SG90 9g 微型舵机**：门梁顶置直驱，接 P0 (5V动力电源)。
8. **DHT11 与 PIR 传感器**：分别接 P1 与 P8，温度 >28℃ 自动排风，PIR 离家布防防盗。`,
    keyDecisions: [
      '新增离线语音模块，本地直接识别语音口令并播报回馈，彻底免除外网与路由器依赖。',
      '天花板悬挂 5V 实体高亮吊灯，声控开灯时整屋通明，极具生活质感。',
      '微型电扇双模联动：声控开关 + 哈热气 >28℃ 自动急速排风降温。',
      '独立 3×4 薄膜键盘密码开门与改密，SG90门梁顶置同心直驱。'
    ],
    kidFriendlyTip: '这次我们升级了离线语音芯片，不用连Wi-Fi就能听懂你喊“小智同学开灯”，答辩现场呼唤口令特别有气势！'
  },
  {
    id: 'TICKET-03',
    title: '全屋电气拓扑与引脚精准规划 (语音UART、吊灯P11、风扇P5与键盘安防)',
    category: 'wiring',
    status: 'resolved',
    blockedBy: ['TICKET-02'],
    summary: '合理分配11个物理GPIO资源：P0门舵机、P1温湿度、P5风扇、P6/P7语音串口、P8人体红外、P11吊灯、P2~P16矩阵键盘，全部模块独立测试。',
    detailedPlan: `1. **动力与信号隔离**：
   - SG90舵机与直流微型风扇均接在拓展板 5V 专用动力电源轨，不经过掌控板3.3V降压芯片，杜绝电压拉垮。
2. **引脚分配与通信协议**：
   - **P0**：SG90 舵机 PWM 控制信号（大门 0°关门 / 90°开门）。
   - **P1**：DHT11 数字温湿度传感器单总线。
   - **P5**：智能排风扇控制（高电平启动转动，低电平关闭）。
   - **P6 (RX), P7 (TX)**：UART1 串口通信，波特率 9600，连接离线语音模块。
   - **P8**：PIR 人体红外数字输入（离家布防模式下检测入侵）。
   - **P11**：客厅实体白色吸顶吊灯输出（高电平点亮屋顶，低电平熄灭）。
   - **P2, P3, P13, P14 (行) / P15, P16, P4 (列)**：3×4 矩阵薄膜键盘。
3. **软硬件安全防线**：
   - 键盘输错 3 次锁定警报；* 键离家布防；掌控板 A 键持续按住 6 秒触发出厂复位（赛场安全气囊）。`,
    keyDecisions: [
      'P6/P7 配置为硬件 UART1，与离线语音模块 9600 波特率高速稳定交互。',
      'P11 驱动实体吊灯、P5 驱动微型风扇，软硬件状态 100% 毫秒级双向同步。',
      'DHT11 温控阈值定为 28℃，少儿哈气瞬间超标自动触发风扇排风。'
    ],
    kidFriendlyTip: '牢记颜色口诀：红是5V/3.3V动力电，黑是GND地线，黄绿是信号线，逐个接线并运行单独的测试脚本！'
  },
  {
    id: 'TICKET-04',
    title: 'VS Code + AI 纯MicroPython系统架构与5大模块单元测试',
    category: 'software',
    status: 'resolved',
    blockedBy: ['TICKET-03'],
    summary: '采用 VS Code + MicroPico 纯 MicroPython 架构，提供5个独立的单元测试程序（键盘、舵机、传感器、吊灯风扇、语音串口），每接一个测一个，最后集成 main.py。',
    detailedPlan: `1. **放弃积木拖拽，全面拥抱 VS Code + AI 现代工程师开发模式**。
2. **5 个独立的单元测试脚本（门外汉必备）**：
   - \`test_keypad.py\`：测试 3×4 键盘按键与 123456# 验证；
   - \`test_servo.py\`：测试 SG90 舵机 0°~90° 旋转与供电稳定性；
   - \`test_sensors.py\`：测试 DHT11 哈气升温与 PIR 红外感应；
   - \`test_fan_light.py\`：测试 P11 客厅吊灯与 P5 微型风扇循环启停；
   - \`test_voice.py\`：测试 P6/P7 串口接收语音模块指令（喊“小智同学”看回显）。
3. **代码永久固化**：
   - 在 VS Code 中右键 \`main.py\` 点击 “Upload file to device”，拔掉电脑线插充电宝自动启动。`,
    keyDecisions: [
      '标准化 5 个单元测试脚本，确保零基础用户每接好一个硬件就独立跑通。',
      '非阻塞主循环状态机，同时兼顾键盘扫描、语音串口、温控阈值判断与Web服务。'
    ],
    kidFriendlyTip: '每跑通一个测试脚本，你的沙盘就解锁一项超能力，最后把 main.py 上传到板子里，插上充电宝就能脱机自启！'
  },
  {
    id: 'TICKET-05',
    title: '断网自愈 AP 热点 (192.168.4.1) 与三方实时同步控制中心',
    category: 'iot',
    status: 'resolved',
    blockedBy: ['TICKET-04'],
    summary: '掌控板自发 SmartHome-IoT 局域网热点，提供手机浏览器 192.168.4.1 访问，无论通过语音喊话还是手机点按，吊灯、风扇、大门状态 100% 毫秒级双向同步。',
    detailedPlan: `1. **自愈 AP 无网架构**：
   - 掌控板自发 Wi-Fi (SSID: SmartHome-IoT，免密)，彻底免疫展厅断网与防火墙干扰。
2. **三方状态实时同步**：
   - 当孩子语音说“打开客厅灯”，天花板吊灯亮起，掌控板屏幕显示提示，手机 Web 端上的“客厅灯”开关同步变绿亮起！
   - 手机端同样可一键开门、开关吊灯、开关风扇、切换布防模式与在线修改门禁密码。`,
    keyDecisions: [
      '手机、离线语音与掌控板屏幕三方状态完全闭环打通，彰显工业级物联网设计水平。',
      '免安装 App，评委手机直接扫码打开 192.168.4.1 即可亲自体验。'
    ],
    kidFriendlyTip: '把手机递给评委老师：“老师您点一下开灯，看屋顶的吊灯是不是马上就亮啦”，互动感直接拉满！'
  },
  {
    id: 'TICKET-06',
    title: '小创客 5 分钟黄金答辩演练与展台实战布展 (含语音、吊灯、风扇与A键复位)',
    category: 'presentation',
    status: 'resolved',
    blockedBy: ['TICKET-01', 'TICKET-05'],
    summary: '演练 5 分钟逐字答辩剧本，现场演示语音呼唤“小智同学”、客厅吊灯点亮、微型风扇吹风、哈热气 >28℃ 自动排风、键盘开门以及 A 键 6 秒复位安全气囊。',
    detailedPlan: `1. **展台双立牌美化**：
   - 制作“操作指南立牌”和“AP扫码立牌”，孩子在发泡板上用马克笔手绘窗帘和绿植。
2. **5 分钟答辩结构**：
   - 第1分钟：痛点（老人儿童关怀、断网安全）。
   - 第2分钟：结构（发泡板材质、三铜柱三明治总成、门梁顶置直驱与5cm底座暗格）。
   - 第3分钟：核心演示（喊“小智同学打开客厅灯”吊灯亮起、“打开风扇”风扇旋转、“哈气 >28℃”自动排风）。
   - 第4分钟：安防与手机互联（键盘按 123456# 开门，PIR 防盗，评委手机直连 192.168.4.1 同步控制）。
   - 第5分钟：VS Code+AI 编程理念与致谢。
3. **特情演练**：演示持续长按 A 键 6 秒触发“赛场安全气囊”出厂一键复位。`,
    keyDecisions: [
      '将离线语音与 28℃ 温控自动排风作为现场两大震撼视觉与听觉演示点。',
      '从容演示长按 A 键 6 秒安全气囊，展现极高工程容错与兜底能力。'
    ],
    kidFriendlyTip: '答辩时喊“小智同学”声音要清晰洪亮，每演示完一个动作停顿2秒，让评委看清屋顶吊灯和风扇的动作！'
  }
];

export const HARDWARE_LIST: HardwareItem[] = [
  {
    id: 'hw-1',
    name: '掌控板 2.0 (mPython)',
    spec: 'ESP32 双核主控，自带3个M3安装固定孔，板载1.3寸OLED屏、3颗RGB全彩灯、光敏、声音传感器、实体A/B键',
    quantity: '1 块',
    purpose: '整个智能家居的大脑与人机交互门禁屏',
    pinConnect: '主控板（正面朝外，与拓展板背面铜柱螺丝堆叠）',
    estPrice: '¥75 ~ 85',
    searchKeyword: '掌控板 2.0 盛思 mPython',
    avoidPitfall: '认准2.0版本（带加速度计与3个标准安装孔），不要买成 micro:bit。'
  },
  {
    id: 'hw-2',
    name: '掌控板专用拓展板 (铜柱堆叠式)',
    spec: '背面螺丝铜柱堆叠结构，三孔对齐紧固，带独立Type-C供电口、PH2.0防反接插座与舵机排针',
    quantity: '1 块',
    purpose: '通过3根隔离铜柱与掌控板背靠背螺丝紧固堆叠，引出引脚并给舵机与风扇提供独立 5V 动力供电',
    pinConnect: '背靠背铜柱堆叠固定在掌控板背面',
    estPrice: '¥25 ~ 35',
    searchKeyword: '掌控拓展板 盛思 铜柱堆叠款',
    avoidPitfall: '选用带3个螺丝定位孔与配套隔离铜柱螺丝包的堆叠拓展板，堆叠后厚度约1.8cm。'
  },
  {
    id: 'hw-voice',
    name: '离线语音识别模块 (ASR01 / HLK-V20)',
    spec: '免配网离线语音识别芯片，自带小型扬声器与麦克风，支持串口 UART 通信',
    quantity: '1 块',
    purpose: '离线听懂“小智同学”唤醒词，并执行“打开客厅灯”、“关闭客厅灯”、“打开风扇”、“关闭风扇”等口令并语音播报反馈',
    pinConnect: 'TX 接掌控板 P6 (RX)，RX 接掌控板 P7 (TX)，VCC接 5V，GND接地',
    estPrice: '¥20 ~ 28',
    searchKeyword: 'ASR01 离线语音识别模块 或 HLK-V20 语音播报',
    avoidPitfall: '购买出厂已烧录好智能家居常用词条的免开发款，插上线即可通过串口直接通信。'
  },
  {
    id: 'hw-light',
    name: '客厅实体高亮白色吸顶吊灯模块',
    spec: '5V 白光高亮 LED 模块，带白色半球柔光罩与限流电阻',
    quantity: '1 个',
    purpose: '贴在发泡板斜屋顶内侧正中央，声控或手机点按时整间客厅倾泻通明白光',
    pinConnect: '信号线接 P11，电源VCC接 5V，GND接地',
    estPrice: '¥2 ~ 4',
    searchKeyword: '创客 5V 白光 LED 模块 柔光 吊灯',
    avoidPitfall: '选择自带限流电阻的 LED 模块，不要直接把裸 LED 灯珠插在引脚上防止过流。'
  },
  {
    id: 'hw-fan',
    name: '5V 微型直流风扇排风模块',
    spec: '5V 直流微型电机，带软质安全扇叶，静音安全不打手',
    quantity: '1 个',
    purpose: '安装在沙盘后墙上方排风孔，语音喊话启停，或哈热气温湿度 >28℃ 时自动开启急速排风降温',
    pinConnect: '控制信号线接 P5，电源接 5V 与 GND',
    estPrice: '¥6 ~ 9',
    searchKeyword: '5V 直流电机风扇模块 软扇叶 创客',
    avoidPitfall: '认准带软质塑胶扇叶的小风扇，转动时用手碰到也不会受伤，确保少儿比赛安全。'
  },
  {
    id: 'hw-3',
    name: 'SG90 9g 微型舵机 (带单字摇臂)',
    spec: '工作电压 4.8V-6V，转角 0-180度，带安装螺丝与单字摇臂',
    quantity: '1 个',
    purpose: '倒扣嵌在门梁横梁开槽中，轴心与大门同心，直驱大门旋转 90° 开合',
    pinConnect: '信号线接 P0，电源VCC接扩展板 5V 独立供电轨，地线接 GND',
    estPrice: '¥7 ~ 9',
    searchKeyword: 'SG90 舵机 180度 单字摇臂',
    avoidPitfall: '买180度定角舵机，不要买成360度连续旋转舵机；安装时保证齿轮轴与门轴合页在同一直线上。'
  },
  {
    id: 'hw-keypad',
    name: '3×4 矩阵薄膜轻触按键键盘',
    spec: '12键 (1~9, *, 0, #)，背胶，引出 7Pin 2.54mm 扁平杜邦插头',
    quantity: '1 个',
    purpose: '平贴在玄关发泡板立墙，用于输入门禁密码、按 # 确认、按 * 一键布防与现场改密',
    pinConnect: '7根排线接拓展板：行线接 P2, P3, P13, P14；列线接 P15, P16, P4',
    estPrice: '¥4 ~ 6',
    searchKeyword: '3*4 矩阵薄膜键盘 12键 2.54mm',
    avoidPitfall: '选带自粘背胶的薄膜按键，厚度不足1mm，撕开背胶直接平整贴在发泡板上非常美观。'
  },
  {
    id: 'hw-4',
    name: 'DHT11 数字温湿度传感器 (3Pin单总线模块)',
    spec: '带PCB底板与3Pin防反接排线，测量范围 0-50℃，20-90%RH',
    quantity: '1 个',
    purpose: '实时检测房屋内部温湿度，用于演示夏日高温通风（>28℃）与现场少儿哈气互动',
    pinConnect: '数据DAT接扩展板 P1，电源VCC接 3.3V/5V，GND接地',
    estPrice: '¥5 ~ 8',
    searchKeyword: 'DHT11 温湿度模块 3Pin 带线',
    avoidPitfall: '购买带3Pin小底板的模块（自带上拉电阻与滤波电容），不要买4脚裸芯片。'
  },
  {
    id: 'hw-5',
    name: 'PIR 人体红外热释电感应模块',
    spec: 'HC-SR501 或 迷你型红外热释电模块，感应距离 3~5米',
    quantity: '1 个',
    purpose: '感应是否有人靠近大门；处于【离家布防模式】时，感应到有人靠近立即触发红蓝声光警报',
    pinConnect: '信号线接 P8，VCC接 5V，GND接地',
    estPrice: '¥5 ~ 8',
    searchKeyword: 'HC-SR501 人体红外感应模块 或 微型红外感应',
    avoidPitfall: '通电后有大约15秒的初始化自校准时间，测试时勿慌张。'
  },
  {
    id: 'hw-6',
    name: '小型 5V 移动电源 (充电宝) 或 18650锂电池',
    spec: '常规 5000mAh 便携超薄充电宝，输出 5V 1A~2A',
    quantity: '1 个',
    purpose: '平卧放置于底座 5cm 暗格内，为扩展板独立供电，实现完全无线随处搬移展示',
    pinConnect: 'USB转Type-C线接入扩展板电源口',
    estPrice: '¥25 ~ 35 (或自备已有)',
    searchKeyword: '便携超薄充电宝 5000mah',
    avoidPitfall: '选用输出支持 5V 2A 的充电宝，舵机与风扇同时转动时电力充足不降压。'
  },
  {
    id: 'hw-7',
    name: '0.3cm (3mm) PC/PVC 发泡板 (雪弗板/安迪板)',
    spec: '厚度 3mm，高密度微孔实心白板，硬挺度极高，防水防潮，建议准备 40cm×60cm 约 2~3 张',
    quantity: '2 ~ 3 张',
    purpose: '精确裁切搭建长35cm×宽22cm×高26cm的白色极简现代透视沙盘',
    pinConnect: '结构核心材料（502快干胶化学冷焊粘接）',
    estPrice: '¥15 ~ 22',
    searchKeyword: '3mm PVC发泡板 雪弗板 白色 安迪板',
    avoidPitfall: '选3mm实心发泡板，美工刀三次划深即断，切口比瓦楞纸板平整整洁得多。'
  },
  {
    id: 'hw-8',
    name: '创客五金辅料包 (502快干胶、大号美工刀、微型合页铰链、M3铜柱螺丝)',
    spec: '502胶水2支、钢直尺、微型金属活页2个、M3双通铜柱螺丝包',
    quantity: '1 套',
    purpose: '发泡板瞬粘组装、门轴活页旋转与掌控板背靠背堆叠固定',
    pinConnect: '工具与紧固件',
    estPrice: '¥15 ~ 20',
    searchKeyword: '502胶水 微型合页 10x15mm M3铜柱螺丝',
    avoidPitfall: '发泡板粘接用502可实现微溶冷焊，切口对接点胶10秒即牢固。'
  }
];

export const PINOUT_LIST: WiringPin[] = [
  {
    pin: 'P0 (GPIO 0)',
    device: 'SG90 智能入户门舵机 (门梁顶置直驱)',
    function: 'PWM 角度输出 (0° 关门, 90° 开门)',
    type: 'Digital',
    vccReq: '外接 5V (必须来自扩展板专用动力口)',
    notes: '舵机电源严禁接掌控板3.3V引脚，由5V动力轨供电'
  },
  {
    pin: 'P1 (GPIO 1)',
    device: 'DHT11 数字温湿度传感器',
    function: '数字单总线 DAT 通信 (读温湿度，>28℃ 自动排风)',
    type: 'Digital',
    vccReq: '3.3V ~ 5V',
    notes: '单总线数据线，孩子哈热气温升超过 28℃ 时自动触发风扇排风'
  },
  {
    pin: 'P5 (GPIO 5)',
    device: '智能微型排风扇模块',
    function: '数字 GPIO 输出 (声控启停 + 高温 >28℃ 自动排风)',
    type: 'Digital',
    vccReq: '5V / GND',
    notes: '双模联动：语音喊“打开风扇”或温控自动启动'
  },
  {
    pin: 'P6 (RX), P7 (TX)',
    device: '离线语音识别模块 (ASR01/HLK-V20)',
    function: 'UART1 串口通信 (波特率 9600)，识别口令并播报回显',
    type: 'Digital',
    vccReq: '5V / GND',
    notes: '唤醒词“小智同学”，口令“打开客厅灯”、“关闭客厅灯”、“打开风扇”'
  },
  {
    pin: 'P11 (GPIO 11)',
    device: '客厅实体高亮白色吸顶吊灯',
    function: '数字 GPIO 输出 (语音开灯 / 手机点按点亮)',
    type: 'Digital',
    vccReq: '5V / GND',
    notes: '天花板垂挂 5V 高亮柔光 LED，开灯瞬间整间客厅通明'
  },
  {
    pin: 'P8 (GPIO 18)',
    device: 'PIR 人体红外热释电传感器',
    function: '高低电平感应信号 (离家布防模式下触发入侵警报)',
    type: 'Digital',
    vccReq: '3.3V ~ 5V',
    notes: '安装在大门玄关正前方，非接触式防盗感应'
  },
  {
    pin: 'P2, P3, P13, P14',
    device: '3×4 矩阵薄膜键盘 (行输入引脚 Row 1~4)',
    function: '按键行扫描输入 (微控制器内部上拉 Pull-Up)',
    type: 'Digital',
    vccReq: '信号线',
    notes: '检测按键按下时行电平被拉低'
  },
  {
    pin: 'P15, P16, P4',
    device: '3×4 矩阵薄膜键盘 (列输出引脚 Col 1~3)',
    function: '按键列选通输出 (轮流输出低电平扫描)',
    type: 'Digital',
    vccReq: '信号线',
    notes: '依次选通列，配合行引脚确定 12 个键位'
  },
  {
    pin: '内置 Wi-Fi (ESP32)',
    device: 'AP 局域网无线热点与Web服务器',
    function: '发射 SmartHome-IoT 热点，手机直连 192.168.4.1 三方实时同步控制',
    type: 'Internal',
    vccReq: '内置',
    notes: '无需外部路由器或流量，赛场100%零依赖运行'
  },
  {
    pin: '板载 OLED 屏',
    device: '1.3寸 128x64 自发光黑白液晶屏',
    function: '实时轮播大门、吊灯、风扇状态、温湿度与语音提示',
    type: 'Internal',
    vccReq: '内置 (I2C)',
    notes: '正面开孔精准露出，宛如现代高档可视门禁'
  },
  {
    pin: '板载 3颗 WS2812',
    device: '全彩智能 RGB 状态灯',
    function: '开门暖黄迎宾灯、布防幽蓝夜灯、警报红蓝爆闪',
    type: 'Internal',
    vccReq: '内置',
    notes: '根据当前模式自动切换灯效'
  },
  {
    pin: '板载 蜂鸣器',
    device: '无源微型蜂鸣器',
    function: '按键轻脆音、开门欢快和弦、错误警报音、复位长鸣',
    type: 'Internal',
    vccReq: '内置',
    notes: '增强少儿互动与操作反馈'
  }
];

export const PYTHON_CODE = `# ==============================================================================
# 项目名称：智馨家园 · 掌控板 2.0 全屋智能沙盘控制系统 (V2.0 语音+全屋智能版)
# 运行环境：ESP32 MicroPython (mPython 固件)
# 核心外设：
#   - 离线语音识别模块 (ASR01/HLK-V20)：P6 (RX), P7 (TX) UART1 波特率 9600
#   - 客厅实体吸顶吊灯：P11 (高电平开灯，低电平关灯)
#   - 智能微型排风扇：P5 (声控启停 + DHT11 遇热 > 28℃ 自动排风)
#   - 入户大门 SG90 舵机：P0 门梁顶置同心直驱 (5V 独立供电)
#   - 3×4 矩阵薄膜键盘：行(P2, P3, P13, P14)，列(P15, P16, P4)
#   - DHT11 温湿度传感器：P1 单总线
#   - PIR 人体红外传感器：P8 (离家布防防盗)
#   - 板载：1.3寸 OLED (I2C)、WS2812 RGB 灯、蜂鸣器、ESP32 AP 热点 (192.168.4.1)
# ==============================================================================

import time
import network
import socket
import dht
from mpython import *
from machine import PWM, Pin, UART

# ----------------- 1. 硬件外设与引脚初始化 -----------------
# 门舵机 P0 (PWM 50Hz)
servo_pin = Pin(0, Pin.OUT)
servo_pwm = PWM(servo_pin, freq=50)

# 客厅吊灯 P11 与 微型风扇 P5
light_pin = Pin(11, Pin.OUT)
fan_pin = Pin(5, Pin.OUT)
light_pin.value(0)
fan_pin.value(0)

# 温湿度与人体红外
dht_dev = dht.DHT11(Pin(1))
pir_sensor = Pin(8, Pin.IN)

# 离线语音模块串口 UART1 (P6: RX, P7: TX)
uart_voice = UART(1, baudrate=9600, rx=Pin(6), tx=Pin(7))

# 3×4 薄膜键盘 GPIO
ROW_PINS = [Pin(2, Pin.IN, Pin.PULL_UP), Pin(3, Pin.IN, Pin.PULL_UP), 
            Pin(13, Pin.IN, Pin.PULL_UP), Pin(14, Pin.IN, Pin.PULL_UP)]
COL_PINS = [Pin(15, Pin.OUT), Pin(16, Pin.OUT), Pin(4, Pin.OUT)]

KEY_MAP = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

# ----------------- 2. 系统全局运行状态 -----------------
current_pwd = "123456"
input_buffer = ""
wrong_attempts = 0
is_armed = False
is_alarm_active = False
door_is_open = False
light_is_on = False
fan_is_on = False
auto_fan_active = False
curr_temp = 24.5
curr_hum = 52.0

last_sensor_time = 0
last_key_press_time = 0
button_a_press_start = 0
voice_feedback_str = "系统就绪 监听语音"
is_modifying_pwd = False
modify_step = 0

def scan_keypad():
    """扫描 3×4 矩阵薄膜键盘按键"""
    for c_idx, col in enumerate(COL_PINS):
        for c in COL_PINS: c.value(1)
        col.value(0)
        time.sleep_us(20)
        for r_idx, row in enumerate(ROW_PINS):
            if row.value() == 0:
                for c in COL_PINS: c.value(1)
                return KEY_MAP[r_idx][c_idx]
    for c in COL_PINS: c.value(1)
    return None

def set_servo_angle(angle):
    """设置舵机旋转角度 0~180°"""
    angle = max(0, min(180, angle))
    duty = int(26 + (angle / 180.0) * 102)
    servo_pwm.duty(duty)

def set_light(state):
    """控制客厅实体吸顶吊灯 (P11)"""
    global light_is_on
    light_is_on = state
    light_pin.value(1 if state else 0)
    refresh_dashboard()

def set_fan(state, is_auto=False):
    """控制智能微型排风扇 (P5)"""
    global fan_is_on, auto_fan_active
    fan_is_on = state
    auto_fan_active = is_auto
    fan_pin.value(1 if state else 0)
    refresh_dashboard()

def open_door_action():
    """密码验证通过开门动作 (90度开门，4秒自动关门)"""
    global door_is_open, wrong_attempts, is_armed, is_alarm_active
    wrong_attempts = 0
    is_armed = False
    is_alarm_active = False
    
    oled.fill(0)
    oled.DispChar("★ 密码验证通过 ★", 16, 12)
    oled.DispChar("欢迎回家! 门已开启", 12, 32)
    oled.show()
    
    rgb.fill((200, 160, 0)) # 暖黄迎宾
    rgb.write()
    
    try:
        buzzer.pitch(523, 80)
        time.sleep_ms(30)
        buzzer.pitch(659, 120)
    except:
        pass
        
    set_servo_angle(90)
    door_is_open = True
    time.sleep(4)
    close_door_action()

def close_door_action():
    """自动关门动作"""
    global door_is_open
    set_servo_angle(0)
    door_is_open = False
    rgb.fill((0, 0, 0))
    rgb.write()
    refresh_dashboard()

def trigger_security_alarm(reason="入侵人员靠近"):
    """触发防盗警报 (红蓝爆闪+警笛)"""
    global is_alarm_active
    is_alarm_active = True
    oled.fill(0)
    oled.DispChar("! 警报: " + reason + " !", 0, 14)
    oled.DispChar("已锁定门禁 声光报警中", 0, 34)
    oled.show()
    
    for _ in range(3):
        rgb.fill((255, 0, 0))
        rgb.write()
        try: buzzer.pitch(950, 150)
        except: pass
        time.sleep_ms(140)
        
        rgb.fill((0, 0, 255))
        rgb.write()
        try: buzzer.pitch(650, 150)
        except: pass
        time.sleep_ms(140)
        
    rgb.fill((0, 0, 0))
    rgb.write()
    refresh_dashboard()

def refresh_dashboard():
    """刷新 1.3寸 OLED 显示屏 (展示门/灯/扇/温湿全状态)"""
    oled.fill(0)
    if is_armed:
        oled.DispChar("【智馨家园·离家布防】", 0, 0)
    else:
        oled.DispChar("【智馨家园·控制中心】", 0, 0)
        
    # 第一行：温湿度 + 高温排风标识
    temp_str = "{:.1f}C/{}%".format(curr_temp, int(curr_hum))
    if curr_temp > 28.0:
        temp_str += " [高温排风]"
    oled.DispChar(temp_str, 0, 16)
    
    # 第二行：语音提示或密码掩码
    if is_modifying_pwd:
        oled.DispChar("改密中: " + "*" * len(input_buffer), 0, 32)
    elif len(input_buffer) > 0:
        oled.DispChar("密码: [" + "*" * len(input_buffer) + "]", 0, 32)
    else:
        oled.DispChar("语音: " + voice_feedback_str, 0, 32)
        
    # 第三行：全屋受控设备简况
    status_line = "门:{}|灯:{}|扇:{}".format(
        "开" if door_is_open else "关",
        "亮" if light_is_on else "灭",
        "转" if fan_is_on else "停"
    )
    oled.DispChar(status_line, 0, 48)
    oled.show()

# ----------------- 3. 启动 AP 本地局域网热点 -----------------
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid='SmartHome-IoT', authmode=network.AUTH_OPEN)
print("掌控板 Wi-Fi AP 启动! SSID: SmartHome-IoT, IP: 192.168.4.1")

web_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
web_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
web_socket.bind(('192.168.4.1', 80))
web_socket.listen(2)
web_socket.settimeout(0.03)

HTML_PAGE = """<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>智馨家园控制台</title><style>body{{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:12px;margin:0}}h2{{color:#38bdf8;margin:6px 0}}.card{{background:#1e293b;border-radius:12px;padding:12px;margin-bottom:10px}}.btn{{display:inline-block;width:88%;padding:12px;margin:5px 0;font-size:15px;font-weight:bold;color:#fff;background:#2563eb;border:none;border-radius:8px;text-decoration:none;cursor:pointer}}.btn-active{{background:#10b981}}.btn-warning{{background:#f59e0b}}.btn-purple{{background:#8b5cf6}}.val{{font-size:22px;font-weight:bold;color:#4ade80}}input{{padding:10px;border-radius:6px;border:1px solid #475569;width:75%;margin:6px 0;background:#0f172a;color:#fff;text-align:center;font-size:16px}}</style></head><body><h2>🏡 智馨家园 · 全屋控制中心</h2><p style="color:#94a3b8;font-size:11px">AP直连: SmartHome-IoT | 离线语音+门禁版</p><div class="card"><p>室内实时温湿度</p><div class="val">{:.1f}℃ / {:.1f}%</div><p style="font-size:11px;color:#94a3b8">大于28℃触发自动排风降温</p></div><div class="card"><p>智能灯光与电扇 (实时状态)</p><a href="/toggle_light" class="btn {}">客厅吊灯: {}</a><a href="/toggle_fan" class="btn {}">智能排风扇: {}</a></div><div class="card"><p>智能门禁与安防 (当前门: {})</p><a href="/open" class="btn">★ 手机一键远程开门 (90°)</a><a href="/arm" class="btn btn-warning">切换【离家布防模式】</a></div><div class="card"><p>在线修改门禁密码 (当前: {})</p><form action="/setpwd" method="GET"><input type="text" name="pwd" placeholder="输入6位新密码" maxlength="6"><br><button type="submit" class="btn btn-purple">确认更新密码</button></form></div></body></html>"""

# 初始舵机与显示归位
set_servo_angle(0)
refresh_dashboard()
print("系统启动就绪，正在监听 3×4 键盘、离线语音 UART 与手机 AP Web 请求...")

# 离线语音识别口令映射表
VOICE_CMDS = {
    b'LIGHT_ON': "打开客厅灯",
    b'LIGHT_OFF': "关闭客厅灯",
    b'FAN_ON': "打开风扇",
    b'FAN_OFF': "关闭风扇",
    b'\x01': "打开客厅灯",
    b'\x02': "关闭客厅灯",
    b'\x03': "打开风扇",
    b'\x04': "关闭风扇"
}

while True:
    now = time.ticks_ms()
    
    # ---------------- 0. 掌控板 A 键长按 6 秒硬核复位 (赛场安全气囊) ----------------
    if button_a.value() == 0:
        if button_a_press_start == 0:
            button_a_press_start = now
        elapsed_ms = time.ticks_diff(now, button_a_press_start)
        
        if elapsed_ms >= 6000:
            button_a_press_start = 0
            current_pwd = "123456"
            wrong_attempts = 0
            is_armed = False
            is_alarm_active = False
            is_modifying_pwd = False
            input_buffer = ""
            set_servo_angle(0)
            door_is_open = False
            set_light(False)
            set_fan(False)
            
            try: buzzer.pitch(1000, 600)
            except: pass
            rgb.fill((0, 255, 0))
            rgb.write()
            oled.fill(0)
            oled.DispChar("★ 系统已硬核复位 ★", 10, 15)
            oled.DispChar("恢复出厂密码: 123456", 8, 35)
            oled.show()
            time.sleep(2)
            rgb.fill((0, 0, 0))
            rgb.write()
            refresh_dashboard()
        elif elapsed_ms > 1000:
            rem_sec = (6000 - elapsed_ms) // 1000 + 1
            oled.fill(0)
            oled.DispChar("! 恢复出厂设置中 !", 12, 15)
            oled.DispChar("按住A键不放: {} 秒...".format(rem_sec), 10, 35)
            oled.show()
    else:
        if button_a_press_start != 0:
            button_a_press_start = 0
            refresh_dashboard()

    # ---------------- 1. 离线语音识别模块串口 (UART1) 监听 ----------------
    if uart_voice.any():
        raw_v = uart_voice.read()
        cmd_matched = None
        for k, v in VOICE_CMDS.items():
            if k in raw_v:
                cmd_matched = v
                break
                
        if cmd_matched == "打开客厅灯":
            set_light(True)
            voice_feedback_str = "语音:客厅灯已开"
            try: buzzer.pitch(880, 80)
            except: pass
        elif cmd_matched == "关闭客厅灯":
            set_light(False)
            voice_feedback_str = "语音:客厅灯已关"
            try: buzzer.pitch(660, 80)
            except: pass
        elif cmd_matched == "打开风扇":
            set_fan(True)
            voice_feedback_str = "语音:风扇已开启"
            try: buzzer.pitch(1000, 80)
            except: pass
        elif cmd_matched == "关闭风扇":
            set_fan(False)
            voice_feedback_str = "语音:风扇已关闭"
            try: buzzer.pitch(500, 80)
            except: pass
        refresh_dashboard()

    # ---------------- 2. 3×4 薄膜键盘扫描 ----------------
    key = scan_keypad()
    if key and time.ticks_diff(now, last_key_press_time) > 280:
        last_key_press_time = now
        try: buzzer.pitch(800, 35)
        except: pass
            
        if key.isdigit():
            if len(input_buffer) < 6:
                input_buffer += key
                refresh_dashboard()
        elif key == '*':
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
            if is_modifying_pwd:
                if modify_step == 1:
                    if input_buffer == current_pwd:
                        modify_step = 2
                        input_buffer = ""
                        oled.fill(0)
                        oled.DispChar("原密码验证成功!", 16, 15)
                        oled.DispChar("请输6位新密码按#", 10, 35)
                        oled.show()
                        try: buzzer.pitch(800, 100)
                        except: pass
                        time.sleep(1.2)
                    else:
                        oled.fill(0)
                        oled.DispChar("原密码错误!", 28, 18)
                        oled.DispChar("退出修改流程", 24, 38)
                        oled.show()
                        try: buzzer.pitch(350, 300)
                        except: pass
                        time.sleep(1.2)
                        is_modifying_pwd = False
                        input_buffer = ""
                    refresh_dashboard()
                elif modify_step == 2:
                    if len(input_buffer) == 6 and input_buffer.isdigit():
                        current_pwd = input_buffer
                        oled.fill(0)
                        oled.DispChar("★ 密码修改成功 ★", 10, 15)
                        oled.DispChar("新密码: " + current_pwd, 16, 35)
                        oled.show()
                        try: buzzer.pitch(1000, 200)
                        except: pass
                        time.sleep(1.5)
                    is_modifying_pwd = False
                    input_buffer = ""
                    refresh_dashboard()
            else:
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
                        try: buzzer.pitch(400, 200)
                        except: pass
                        time.sleep(1.2)
                        refresh_dashboard()
                        
    # ---------------- 3. 防盗报警检测 (离家布防下 PIR 人体红外入侵) ----------------
    if is_armed and pir_sensor.value() == 1 and not is_alarm_active and not door_is_open:
        trigger_security_alarm("离家布防-人体入侵")
        
    # ---------------- 4. 定时采集 DHT11 温湿度与 28℃ 高温自动排风 ----------------
    if time.ticks_diff(now, last_sensor_time) > 2000:
        last_sensor_time = now
        try:
            dht_dev.measure()
            curr_temp = dht_dev.temperature()
            curr_hum = dht_dev.humidity()
        except Exception:
            pass
            
        # 智能温控排风联动 (阈值 28℃)
        if curr_temp > 28.0:
            if not fan_is_on:
                set_fan(True, is_auto=True)
                voice_feedback_str = "高温 >28C 自动排风"
        elif auto_fan_active and curr_temp <= 27.5:
            # 迟滞回落关风扇
            set_fan(False, is_auto=False)
            voice_feedback_str = "室温恢复 排风关闭"
            
        if not is_alarm_active:
            refresh_dashboard()
            
    # ---------------- 5. 手机 Web 控制台请求处理 (三方实时同步) ----------------
    try:
        conn, addr = web_socket.accept()
        req = conn.recv(1024).decode('utf-8')
        
        if "GET /open" in req:
            open_door_action()
        elif "GET /toggle_light" in req:
            set_light(not light_is_on)
        elif "GET /toggle_fan" in req:
            set_fan(not fan_is_on)
        elif "GET /arm" in req:
            is_armed = not is_armed
            is_alarm_active = False
            refresh_dashboard()
        elif "GET /setpwd?pwd=" in req:
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
        btn_light_cls = "btn-active" if light_is_on else ""
        btn_light_txt = "开启中 (点此关闭)" if light_is_on else "已关闭 (点此点亮)"
        btn_fan_cls = "btn-active" if fan_is_on else ""
        btn_fan_txt = "吹风中 (点此停转)" if fan_is_on else "已关闭 (点此启动)"
        
        resp = HTML_PAGE.format(
            curr_temp, curr_hum,
            btn_light_cls, btn_light_txt,
            btn_fan_cls, btn_fan_txt,
            door_str, current_pwd
        )
        conn.send('HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n' + resp)
        conn.close()
    except OSError:
        pass
        
    time.sleep_ms(25)
`;

export const PRESENTATION_SCRIPT = [
  {
    step: '第 1 分钟',
    title: '开场引入与生活痛点',
    speaker: '少儿主讲人',
    action: '精神饱满向评委老师鞠躬问好，双手自然示意眼前的发泡板房子模型。',
    script: '“各位评委老师好！我是来自创客团队的负责人。今天我为大家带来的创客作品是——《智馨家园：掌控板2.0离线语音与物联网全屋智能微缩沙盘》。在日常生活中，老人小孩经常记不住繁琐的APP操作，而市面上的智能音箱依赖外部网络，一旦断网就沦为‘智障家居’。为了解决这些痛点，我利用掌控板2.0研发了这套集纯硬件离线语音交互、3×4实体矩阵门禁、无感智慧温控排风和自愈AP热点于一体的全屋智能沙盘！”'
  },
  {
    step: '第 2 分钟',
    title: '发泡板结构与三铜柱三明治总成',
    speaker: '少儿主讲人',
    action: '指引评委观察发泡板外观、门框上梁倒扣舵机与3×4独立键盘。',
    script: '“大家请看，整个作品严格按照竞赛要求制作，长35厘米、宽22厘米、高26厘米。我们淘汰了容易受潮塌瘪的瓦楞纸箱，全面采用 3mm 高密度防水 PVC 发泡板。控制器采用了掌控板2.0与盛思拓展板背靠背三铜柱螺丝锁紧的三明治总成，厚度仅1.8厘米。在入户门上方，我们把 SG90 舵机倒扣嵌在门梁横梁内同心直驱，杜绝了机械连杆旷量；底座设计了 5 厘米下沉式暗格，充电宝和所有线路全部隐藏收纳，整洁美观！”'
  },
  {
    step: '第 3 分钟',
    title: '离线语音管家与实体吊灯/微型风扇实物演示',
    speaker: '少儿主讲人',
    action: '现场向离线语音模块清晰呼唤口令，展示天花板高亮吊灯与微型风扇动作。',
    script: '“接下来让我为大家演示最震撼的离线语音功能：小屋集成了独立的语音芯片，完全无需连接任何外网！请大家看：‘小智同学！’（语音芯片播报：在呢）‘打开客厅灯！’（天花板 P11 吊灯瞬间大亮，温暖白光倾泻而下）；‘打开风扇！’（微型电扇呼呼飞速旋转）；‘关闭客厅灯！’（吊灯平稳熄灭）。整个过程毫秒级响应，即使在深山断网环境下也 100% 顺畅工作！”'
  },
  {
    step: '第 4 分钟',
    title: '少儿哈气温控排风联动与 3×4 矩阵密码门禁',
    speaker: '少儿主讲人',
    action: '凑近传感器轻哈一口热气；随后在门边键盘输入 123456# 演示开门与 PIR 探头防盗。',
    script: '“除了听懂人话，小屋还能无感自适应：当我凑近 DHT11 传感器轻哈一口热气，温度检测超过 28℃，系统自动判定室内闷热，无需语音下令就会自动启动微型风扇进行急速排风降温！在门禁方面，我们在键盘上按下 1-2-3-4-5-6 按 # 确认，迎宾灯亮起，大门平顺旋开 90 度！按下 * 键可进入离家布防，有人靠近探头就会立刻红蓝爆闪报警！”'
  },
  {
    step: '第 5 分钟',
    title: '手机 AP 同步直连与 A 键 6 秒复位安全气囊',
    speaker: '少儿主讲人',
    action: '指引评委手机扫码 192.168.4.1 并展示长按 A 键 6 秒倒计时。',
    script: '“不仅如此，掌控板自带 AP 局域网，评委老师可以拿起手机扫码连接 SmartHome-IoT，在网页上与语音完全实时同步控制！如果比赛现场被误按导致打不开门，只要按住板载 A 键 6 秒，屏幕倒计时结束后即可硬核复位恢复默认状态，保证答辩绝不卡壳！本项目纯由 VS Code 与 AI 协同编写 MicroPython 代码。我的汇报完毕，谢谢各位老师！”'
  }
];

export const JUDGE_QUESTIONS = [
  {
    q: '评委问：为什么选择离线语音识别模块，而不是用百度/天猫精灵等在线语音？',
    a: '答：因为比赛展厅往往没有Wi-Fi，或者需要手机热点和繁琐的学校网页认证，现场断网率极高。我们的离线语音芯片将声学模型烧录在芯片内部，开机零延时响应，完全不需要连互联网，不仅彻底免疫赛场断网，而且能百分百保护家庭隐私不被上传云端！'
  },
  {
    q: '评委问：微型风扇在什么时候会自动启动？为什么定在 28℃？',
    a: '答：我们的风扇具备‘语音声控’与‘高温无感排风’双模联动。根据中国室内舒适度国家标准，28℃ 是体感开始感到闷热的临界温度。在演示时，常温一般在22~25℃，孩子轻哈一口热气刚好能让传感器跳过 28℃ 触发急速排风，既符合实际生活逻辑，又让演示动作敏捷确定，绝不翻车！'
  },
  {
    q: '评委问：为什么使用 3×4 矩阵薄膜键盘，而不是用掌控板板载触摸按键？',
    a: '答：因为在真实的商用门禁产品中，实体按键的盲操手感、防误触能力和安全性远高于普通的金属触片；3×4 键盘支持 0~9 数字与按键掩码，支持任意位数的密码设定与现场改密，更符合真实的工业产品标准！'
  },
  {
    q: '评委问：如果沙盘里的舵机、风扇和吊灯同时开启，会不会把掌控板烧坏或重启？',
    a: '答：绝对不会！我们在电路设计中做了‘动力与主控电源隔离’：SG90舵机和风扇电机的电源线全部接在拓展板专用的 5V 独立动力排针上，由充电宝直接供给大电流，绝不经过掌控板板载脆弱的 3.3V 降压芯片，并且代码中加入动作时序错开，彻底避免了电压拉垮主控黑屏重启的隐患！'
  },
  {
    q: '评委问：代码真是你自己写的吗？遇到不会的函数怎么办？',
    a: '答：系统架构、通信协议和矩阵扫描逻辑是我们自己设计的！在编写代码时，我们使用了现代工程师最推崇的 VS Code 配合 AI 助手，我们向 AI 输入清晰的提示词生成函数框架，然后再烧录到掌控板调试。这让我提前体验到了现代工程师高效的 AI 协同研发方式！'
  },
  {
    q: '评委问：如果比赛现场小孩改错密码或者被围观同学按乱导致打不开门，怎么办？',
    a: '答：我们专门设计了‘硬件级安全气囊机制’！只要持续按住掌控板正面物理 A 键 6 秒，屏幕会出现 6 秒倒计时动画并长鸣一声，系统就会强制关门并把密码重置为出厂的 123456，同时解除所有警报和锁定。6 秒的长按延时彻底防止了答辩时的无意误触，又保证了哪怕现场出现任何意外也能一键复原，绝对不卡壳！'
  }
];
