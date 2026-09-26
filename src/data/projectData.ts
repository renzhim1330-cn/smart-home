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
    title: '掌控板2.0主控与外扩传感器BOM选购决策 (定型3×4薄膜键盘、DHT11与铜柱堆叠拓展板)',
    category: 'hardware',
    status: 'resolved',
    blockedBy: ['TICKET-01'],
    summary: '选用掌控板2.0作为主控，搭配三铜柱螺丝堆叠拓展板，选用3×4矩阵薄膜键盘作为独立密码门禁，经典DHT11与SG90顶置舵机。',
    detailedPlan: `1. **核心主控**：掌控板2.0（板载ESP32芯片，自带1.3寸OLED屏、3颗全彩WS2812 RGB灯、光敏、加速度传感器等）。
2. **掌控板专用拓展板 (三孔堆叠款)**：
   - 采用3根隔离铜柱螺丝背靠背与掌控板紧固堆叠，自带独立Type-C供电口与舵机排针。
3. **执行机构与传感器选型定型**：
   - **3×4 矩阵薄膜键盘**：带7-Pin杜邦母头，直接粘贴在发泡板门框边，作为独立物理密码键盘。
   - **SG90 9g 微型舵机**：倒扣顶置嵌在门梁横梁开槽中，舵机轴心与门轴同心直驱。
   - **DHT11 温湿度传感器**：单总线数字传感器（接 P1 引脚），用于演示室内温湿度。
   - **PIR 人体红外热释电模块**：检测门前人员逗留/入侵（接 P8 引脚，非触控安防）。`,
    keyDecisions: [
      '独立 3×4 矩阵薄膜键盘接入，告别金手指触摸，提升实体门禁体验与专业感。',
      '温湿度定型为经典 DHT11 模块，数据线接拓展板 P1 引脚。',
      'SG90舵机采用门梁倒扣顶置同轴直驱（无连杆晃动，动作干脆利落）。',
      '全部使用 5V 标准充电宝通过Type-C独立供电，安全无触电风险。'
    ],
    kidFriendlyTip: '薄膜键盘背面自带强力背胶，对准发泡板预留的线孔一撕一贴，7P排线穿过板子直接插入拓展板，非常工整！'
  },
  {
    id: 'TICKET-03',
    title: '引脚走线拓扑、3×4薄膜键盘密码门禁(含密码修改)与PIR非触控防盗安全规划',
    category: 'wiring',
    status: 'resolved',
    blockedBy: ['TICKET-02'],
    summary: '合理分配掌控板引脚资源：P0接舵机、P1接DHT11、P8接PIR人体红外，P2-P16分配给3×4薄膜键盘，支持123456默认密码与手机/键盘修改密码。',
    detailedPlan: `1. **舵机电源隔离保护**：
   - SG90 舵机启动瞬间电流可达 500mA 以上。舵机电源（红线VCC、棕线GND）必须接到扩展板的 5V 外接供电轨上，黄线（PWM信号）接掌控板 P0。
2. **引脚分配表**：
   - **P0 引脚**：SG90 舵机 PWM 控制信号（入户大门开合，0度关门，90度开门）。
   - **P1 引脚**：DHT11 数字温湿度传感器 DAT 数据线。
   - **P8 引脚**：人体红外 PIR 传感器数字输入（高电平表示有人靠近/入侵）。
   - **P2, P3, P13, P14 (行) / P15, P16, P4 (列)**：3×4 矩阵薄膜键盘 7 根扫描引脚。
   - **内置 Wi-Fi AP**：发射 SmartHome-IoT 局域网热点，提供 192.168.4.1 手机控制面板与动态密码修改。
3. **密码管理与非触控防盗逻辑**：
   - 默认密码为 \`123456\`，按 \`#\` 键确认；按 \`*\` 键可清空输入，或在空闲时长按开启离家布防模式。
   - 输错3次触发声光报警锁定；布防模式下 PIR 感应到人员走动立刻触发红蓝爆闪警笛！
   - 支持通过手机 Web 面板或键盘组合随时在线修改门禁密码。`,
    keyDecisions: [
      'P0 驱动主门舵机，门梁顶置直驱，开机初始角锁定在 0 度。',
      '3×4 薄膜键盘接 P2~P16 引脚，默认密码 123456，支持修改密码。',
      '非触控安防升级：通过 PIR 人体红外感应与输错3次自动锁定双重防盗。'
    ],
    kidFriendlyTip: '记住口诀：“红正是VCC，黑棕是地线GND，黄绿是信号”，先插信号再插电，通电前让爸爸妈妈或老师检查一遍！'
  },
  {
    id: 'TICKET-04',
    title: '掌控板核心代码架构：VS Code + AI 纯MicroPython方案',
    category: 'software',
    status: 'resolved',
    blockedBy: ['TICKET-03'],
    summary: '采纳用户偏好：放弃低效的手动积木拖拽，全面采用 VS Code + AI 插件 + MicroPico 纯 MicroPython 工程开发方案，AI 直接生成代码并一键烧录。',
    detailedPlan: `1. **开发工具链决策（VS Code 遥遥领先）**：
   - **为什么选 VS Code 而不是 Thonny？**
     - Thonny 是教学玩具级轻量IDE，原生几乎没有任何现代 AI 插件支持。
     - **VS Code** 拥有全球最强大的 AI 编程生态（GitHub Copilot、Continue.dev、Claude Code、Cursor/Cline 等）。配合 AI，你可以直接在编辑器内按快捷键：“帮我在原有代码上增加一个当温度超标时蜂鸣器报警的函数”，AI 自动补全并修改，完全告别低效的手动拖拽积木！
2. **VS Code 连接掌控板2.0极简三步法**：
   - **第一步**：在 VS Code 插件市场搜索并安装 **MicroPico**（或 **RT-Thread MicroPython**）插件。
   - **第二步**：用 Type-C 数据线将掌控板插到电脑上，VS Code 底部状态栏会自动识别并显示 \`mPython 2.0 COMx: Connected\`。
   - **第三步**：打开本项目生成的 \`main.py\`，按快捷键 \`Ctrl + Alt + R\`（或底部 Run 按钮），代码瞬间在掌控板上执行，底部终端实时输出 REPL 调试日志！
3. **程序状态机核心架构**：
   - 包含触摸P/Y按键智能门禁、声控敲门开门、OLED动态仪表盘刷新、光敏夜灯、温湿度监控以及云端 MQTT 接收。`,
    keyDecisions: [
      '彻底放弃图形化积木拖拽，拥抱 VS Code + AI 现代编程范式。',
      '选用 MicroPico 扩展作为 VS Code 与掌控板 MicroPython 串口通信桥梁。',
      '规范 main.py 与 boot.py 结构，所有业务逻辑均由 AI 按模块精准生成与迭代。'
    ],
    kidFriendlyTip: '小学生现场答辩时也可以自豪地对评委说：“我不仅懂逻辑，还使用了程序员现在最先进的 VS Code + AI 编程工具来辅助编写纯 Python 代码”，非常有科技前沿感！'
  },
  {
    id: 'TICKET-05',
    title: '掌控板自建AP热点与嵌入式Web控制面板 (零依赖断网无忧方案)',
    category: 'iot',
    status: 'resolved',
    blockedBy: ['TICKET-04'],
    summary: '掌控板自发 SmartHome-IoT 局域网热点并运行轻量级 Web 服务器，手机连接即可在 192.168.4.1 控制开关门与查看温湿度，赛场零依赖绝对不翻车。',
    detailedPlan: `1. **自愈式 AP 局域网架构**：
   - 掌控板作为 Wi-Fi AP 发射端（SSID: \`SmartHome-IoT\`，开放无密码）。
   - 彻底免除比赛现场无Wi-Fi、学校认证页面拦截、流量热点断流等致命风险！
2. **嵌入式移动端 Web 控制台**：
   - 掌控板内部 socket 监听 80 端口，当手机浏览器访问 \`http://192.168.4.1\` 时，直接返回深色轻量控制面板：
     - 实时显示当前温湿度数值与大门开闭状态。
     - “★ 手机一键开门”按钮（触发舵机开合90度）。
     - “关闭大门”与“切换走廊夜灯”按钮。
3. **现场互动极具亮点**：
   - 评委可用自己的手机直接连接该 Wi-Fi，打开浏览器亲自操控沙盘，互动满分。`,
    keyDecisions: [
      '全面采用自建 AP 局域网 Web 方案，赛场环境绝对零翻车。',
      '手机无需安装任何 App 或小程序，标准浏览器直连。',
      '非阻塞 Socket 通信，Web 响应与传感器轮询两不误。'
    ],
    kidFriendlyTip: '给评委演示时，可以礼貌地把手机递给评委：“评委老师，您可以点击一下这个绿色的开门按钮试一下”，瞬间点燃互动气氛！'
  },
  {
    id: 'TICKET-06',
    title: '少儿答辩台本设计与发泡板模型布展规范 (含3×4键盘与非触控防盗演示)',
    category: 'presentation',
    status: 'resolved',
    blockedBy: ['TICKET-01', 'TICKET-05'],
    summary: '制定小学少儿创客比赛5分钟黄金答辩剧本，涵盖发泡板工艺、3×4薄膜键盘输入123456开门、动态密码修改演示、PIR非触控防盗报警与手机AP直连操控。',
    detailedPlan: `1. **外观美化与双展台立牌施工**：
   - 3mm 发泡板表面纯白整洁，可用马克笔让孩子亲手手绘门牌、小窗帘与花园绿植，保留真实童趣。
   - 掌控板屏幕从 5cm×5cm 方孔自然露出，宛如高端可视门禁终端；右侧贴装 3×4 矩阵薄膜键盘。
   - 制作两个迷你展台立牌（互动指南立牌与AP扫码立牌），方便评委自助体验。
2. **五分钟答辩剧本结构（黄金五步法）**：
   - 第1分钟【引出痛点】：讲日常安全与老人关怀的故事背景。
   - 第2分钟【系统架构】：介绍 3mm 发泡板工艺、三铜柱螺丝堆叠、门梁顶置直驱舵机与底座 5cm 隐藏暗格。
   - 第3分钟【核心实物演示】：现场演示“3×4 薄膜键盘输入 123456 开门” + “动态修改密码演示” + “DHT11 哈气温湿度跳变”。
   - 第4分钟【非触控安防与手机AP直连】：演示“*”一键离家布防与 PIR 红外探头防盗，以及手机连接 192.168.4.1 网页一键遥控。
   - 第5分钟【VS Code+AI 与总结】：介绍前沿编程范式与未来展望，致谢答辩。`,
    keyDecisions: [
      '用儿童化的生动语言讲述，突出“3×4独立键盘实体门禁”、“动态改密码”与“断网自愈热点”三大亮点。',
      '准备 4 道常见杀手锏问答（材料工艺、门梁顶置直驱舵机电源隔离、AI编程、非触控防盗与无网控制）。'
    ],
    kidFriendlyTip: '声音洪亮、眼睛看着评委老师微笑着讲解，演示动作要慢而从容，每完成一个动作停顿2秒让评委看清！'
  }
];

export const HARDWARE_LIST: HardwareItem[] = [
  {
    id: 'hw-1',
    name: '掌控板 2.0 (mPython)',
    spec: 'ESP32 双核主控，自带3个M3安装固定孔，板载1.3寸OLED屏、3颗RGB全彩灯、光敏、声音传感器、6个触摸按键',
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
    purpose: '通过3根隔离铜柱与掌控板背靠背螺丝紧固堆叠，引出引脚并给舵机提供独立 5V 稳定供电',
    pinConnect: '背靠背铜柱堆叠固定在掌控板背面',
    estPrice: '¥25 ~ 35',
    searchKeyword: '掌控拓展板 盛思 铜柱堆叠款',
    avoidPitfall: '选用带3个螺丝定位孔与配套隔离铜柱螺丝包的堆叠拓展板，堆叠后厚度约1.8cm。'
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
    pinConnect: '7根排线接拓展板：行线接 P2, P3, P13, P14；列线接 P15, P16, P9',
    estPrice: '¥4 ~ 6',
    searchKeyword: '3*4 矩阵薄膜键盘 12键 2.54mm',
    avoidPitfall: '选带自粘背胶的薄膜按键，厚度不足1mm，撕开背胶直接平整贴在发泡板上非常美观。'
  },
  {
    id: 'hw-4',
    name: 'DHT11 数字温湿度传感器 (3Pin单总线模块)',
    spec: '带PCB底板与3Pin防反接排线，测量范围 0-50℃，20-90%RH',
    quantity: '1 个',
    purpose: '实时检测房屋内部温湿度，用于演示夏日高温通风与现场少儿哈气互动',
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
    avoidPitfall: '部分高端充电宝有“微电流自动关机”，建议选普通款或扩展板自带的锂电池盒。'
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
    spec: '502胶水2支、钢直尺、微型金属活页2个、回形针拉杆、M3双通铜柱螺丝包',
    quantity: '1 套',
    purpose: '发泡板瞬粘组装、门轴活页旋转与掌控板背靠背堆叠固定',
    pinConnect: '工具与紧固件',
    estPrice: '¥15 ~ 20',
    searchKeyword: '502胶水 微型合页 10x15mm M3铜柱螺丝',
    avoidPitfall: '发泡板粘接用502可实现微溶冷焊，切忌用大功率热熔胶枪长时间近距离烫板材。'
  }
];

export const PINOUT_LIST: WiringPin[] = [
  {
    pin: 'P0 (GPIO 0)',
    device: 'SG90 智能入户门舵机 (门梁顶置直驱)',
    function: 'PWM 角度输出 (0° 关门, 90° 开门)',
    type: 'Digital',
    vccReq: '外接 5V (必须来自扩展板)',
    notes: '舵机电源严禁接掌控板3.3V引脚，由5V动力轨供电'
  },
  {
    pin: 'P1 (GPIO 1)',
    device: 'DHT11 数字温湿度传感器',
    function: '数字单总线 DAT 通信 (读温湿度)',
    type: 'Digital',
    vccReq: '3.3V ~ 5V',
    notes: '单总线数据线，代码中加入异常重试机制'
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
    pin: 'P15, P16, P9',
    device: '3×4 矩阵薄膜键盘 (列输出引脚 Col 1~3)',
    function: '按键列选通输出 (轮流输出低电平扫描)',
    type: 'Digital',
    vccReq: '信号线',
    notes: '依次选通列，配合行引脚确定 12 个键位'
  },
  {
    pin: '内置 Wi-Fi (ESP32)',
    device: 'AP 局域网无线热点与Web服务器',
    function: '发射 SmartHome-IoT 热点，手机直连 192.168.4.1 控制与在线改密',
    type: 'Internal',
    vccReq: '内置',
    notes: '无需外部路由器或流量，赛场100%零依赖运行'
  },
  {
    pin: '板载 OLED 屏',
    device: '1.3寸 128x64 自发光液晶屏',
    function: '实时显示门禁密码掩码槽、温湿度、IP与布防状态',
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
    function: '键盘按键轻脆音、开门欢快音、错误警报音、防盗警笛',
    type: 'Internal',
    vccReq: '内置',
    notes: '增强少儿互动与操作反馈'
  }
];

export const PYTHON_CODE = `# ==============================================================================
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
#   3. 双重非触控防盗报警：输错 3 次锁定警报；按 '*' 进入【离家布防】，PIR 感应即警报！
#   4. 手机 AP 直连 Web 控制台：浏览器访问 http://192.168.4.1 实时遥控与改密
# ==============================================================================

import time
import network
import socket
import dht
from mpython import *
from machine import PWM, Pin

# ----------------- 1. 硬件外设初始化 -----------------
servo_pin = Pin(0, Pin.OUT)
servo_pwm = PWM(servo_pin, freq=50)

dht_dev = dht.DHT11(Pin(1))
pir_sensor = Pin(8, Pin.IN)

ROW_PINS = [Pin(2, Pin.IN, Pin.PULL_UP), Pin(3, Pin.IN, Pin.PULL_UP), 
            Pin(13, Pin.IN, Pin.PULL_UP), Pin(14, Pin.IN, Pin.PULL_UP)]
COL_PINS = [Pin(15, Pin.OUT), Pin(16, Pin.OUT), Pin(9, Pin.OUT)]

KEY_MAP = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

current_pwd = "123456"
input_buffer = ""
wrong_attempts = 0
is_armed = False
is_alarm_active = False
door_is_open = False
night_light = False
curr_temp = 25.0
curr_hum = 55.0

last_sensor_time = 0
last_key_press_time = 0
is_modifying_pwd = False
modify_step = 0

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
    """密码验证通过开门动作"""
    global door_is_open, wrong_attempts, is_armed, is_alarm_active
    wrong_attempts = 0
    is_armed = False
    is_alarm_active = False
    
    oled.fill(0)
    oled.DispChar("★ 密码验证通过 ★", 16, 12)
    oled.DispChar("欢迎回家! 门已开启", 12, 32)
    oled.show()
    
    rgb.fill((150, 100, 0))
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
        rgb.fill((220, 0, 0))
        rgb.write()
        try:
            buzzer.pitch(900, 150)
        except:
            pass
        time.sleep_ms(150)
        
        rgb.fill((0, 0, 220))
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
    if is_armed:
        oled.DispChar("【智馨家园·布防中】", 0, 0)
    else:
        oled.DispChar("【智馨家园·门禁终端】", 0, 0)
    oled.DispChar("温湿: {:.0f}C / {:.0f}%".format(curr_temp, curr_hum), 0, 18)
    
    if is_modifying_pwd:
        if modify_step == 1:
            oled.DispChar("验原密: " + "*" * len(input_buffer), 0, 34)
        else:
            oled.DispChar("设新密: " + "*" * len(input_buffer), 0, 34)
    else:
        mask_str = "*" * len(input_buffer)
        if len(mask_str) == 0:
            mask_str = "按键输入6位密码"
        oled.DispChar("密码: [" + mask_str + "]", 0, 34)
        
    status_str = "门:{} | 防:{}".format("开" if door_is_open else "关", "开启" if is_armed else "撤防")
    oled.DispChar(status_str, 0, 50)
    oled.show()

# ----------------- 2. 启动 AP 本地局域网热点 -----------------
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid='SmartHome-IoT', authmode=network.AUTH_OPEN)
print("掌控板 Wi-Fi AP 启动! SSID: SmartHome-IoT, IP: 192.168.4.1")

web_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
web_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
web_socket.bind(('192.168.4.1', 80))
web_socket.listen(2)
web_socket.settimeout(0.04)

HTML_PAGE = """<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>智馨家园手机控制台</title><style>body{{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:12px;margin:0}}h2{{color:#38bdf8;margin:6px 0}}.card{{background:#1e293b;border-radius:12px;padding:12px;margin-bottom:10px}}.btn{{display:inline-block;width:88%;padding:12px;margin:6px 0;font-size:15px;font-weight:bold;color:#fff;background:#2563eb;border:none;border-radius:8px;text-decoration:none;cursor:pointer}}.btn-danger{{background:#dc2626}}.btn-warning{{background:#d97706}}.btn-purple{{background:#7c3aed}}.val{{font-size:22px;font-weight:bold;color:#4ade80}}input{{padding:10px;border-radius:6px;border:1px solid #475569;width:75%;margin:6px 0;background:#0f172a;color:#fff;text-align:center;font-size:16px}}</style></head><body><h2>🏡 智馨家园 · 手机控制台</h2><p style="color:#94a3b8;font-size:11px">AP直连热点: SmartHome-IoT | 3×4键盘门禁版</p><div class="card"><p>室内实时温湿度</p><div class="val">{:.1f}℃ / {:.1f}%</div></div><div class="card"><p>门禁与安防 (当前门: {})</p><a href="/open" class="btn">★ 手机一键远程开门 (90°)</a><a href="/arm" class="btn btn-warning">一键切换【离家布防模式】</a></div><div class="card"><p>在线修改门禁密码 (当前: {})</p><form action="/setpwd" method="GET"><input type="text" name="pwd" placeholder="输入6位新密码" maxlength="6"><br><button type="submit" class="btn btn-purple">确认更新密码</button></form></div><p style="color:#64748b;font-size:10px">评委扫码直连专属体验控制面板</p></body></html>"""

set_servo_angle(0)
refresh_dashboard()
print("系统启动就绪，正在监听 3×4 矩阵键盘与 AP Web 请求...")

while True:
    now = time.ticks_ms()
    
    # ---------------- 0. 掌控板 A 键长按 6 秒硬核复位 (赛场安全气囊) ----------------
    if button_a.value() == 0:
        if button_a_press_start == 0:
            button_a_press_start = now
        elapsed_ms = time.ticks_diff(now, button_a_press_start)
        
        if elapsed_ms >= 6000:
            button_a_press_start = 0
            current_pwd = "123456"       # 强制重置密码为默认
            wrong_attempts = 0
            is_armed = False
            is_alarm_active = False
            is_modifying_pwd = False
            input_buffer = ""
            set_servo_angle(0)
            door_is_open = False
            
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
            rem_sec = (6000 - elapsed_ms) // 1000 + 1
            oled.fill(0)
            oled.DispChar("! 恢复出厂设置中 !", 12, 15)
            oled.DispChar("按住A键不放: {} 秒...".format(rem_sec), 10, 35)
            oled.show()
    else:
        if button_a_press_start != 0:
            button_a_press_start = 0
            refresh_dashboard()

    # ---------------- A. 3×4 薄膜键盘扫描 ----------------
    key = scan_keypad()
    if key and time.ticks_diff(now, last_key_press_time) > 280:
        last_key_press_time = now
        try:
            buzzer.pitch(800, 35)
        except:
            pass
            
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
                        
    # B. 防盗报警检测 (离家布防下PIR红外入侵检测)
    if is_armed and pir_sensor.value() == 1 and not is_alarm_active and not door_is_open:
        trigger_security_alarm("离家布防-入侵检测")
        
    # C. 定时采集 DHT11 温湿度
    if time.ticks_diff(now, last_sensor_time) > 2500:
        last_sensor_time = now
        try:
            dht_dev.measure()
            curr_temp = dht_dev.temperature()
            curr_hum = dht_dev.humidity()
        except Exception:
            pass
            
        if light.read() < 60 and not door_is_open and not is_armed:
            night_light = True
            rgb.fill((10, 10, 10))
            rgb.write()
        elif light.read() >= 60 and not door_is_open and not is_armed:
            night_light = False
            rgb.fill((0, 0, 0))
            rgb.write()
            
        if not is_alarm_active:
            refresh_dashboard()
            
    # D. 手机 Web 控制台请求处理
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
    script: '“各位评委老师好！我是来自创客团队的负责人。今天我为大家带来的创客作品是——《智馨家园：掌控板2.0微缩绿色智能家居系统》。大家在日常生活中一定遇到过这样的困扰：回家翻找钥匙开门非常费劲；老人独自在家总有安全隐患。为了解决这些痛点，我利用掌控板2.0和高密度发泡板，设计制作了这个集3×4矩阵密码门禁、顶置同轴直驱、双重非接触防盗和自愈AP局域网于一体的微缩智能沙盘！”'
  },
  {
    step: '第 2 分钟',
    title: '0.3cm发泡板工艺与顶置直驱讲解',
    speaker: '少儿主讲人',
    action: '指引评委观察发泡板外观、门框上梁倒扣舵机与3×4独立键盘。',
    script: '“大家请看，整个作品严格按照竞赛要求制作，长35厘米、宽22厘米、高26厘米。我们淘汰了容易受潮塌瘪的瓦楞纸箱，全面采用 3mm 高密度防水 PVC 发泡板，结构刚度高。在入户门上方，我们把 SG90 舵机倒扣嵌在门梁横梁内，舵机轴心与门轴合页同心直驱，彻底杜绝了连杆晃动虚位！在大门右侧配备了独立的 3×4 矩阵薄膜密码键盘，台面完全看不到任何杂乱飞线！”'
  },
  {
    step: '第 3 分钟',
    title: '核心动作实物演示 (3×4键盘输入 + 防盗报警演示)',
    speaker: '少儿主讲人',
    action: '现场实操：在3×4薄膜键盘输入123456按#开门；按*布防后用手遮挡PIR演示报警；哈气测温。',
    script: '“接下来让我为大家演示核心功能：首先是【3×4 矩阵键盘商用门禁】——大家请看屏幕，我在键盘上按下默认密码 1-2-3-4-5-6，按 # 确认，密码验证成功！暖黄迎宾灯亮起，顶置舵机推开大门 90 度！如果不小心输错 3 次，系统立刻锁死并报警。另外按下 * 号键能进入【离家布防模式】，只要有人靠近门前，PIR人体红外传感器就会立刻触发红蓝警灯爆闪和警笛！最后当我对着DHT11传感器哈一口热气，温度上升，系统会自动感知，守护家人舒适！”'
  },
  {
    step: '第 4 分钟',
    title: '手机直连自愈 AP 热点控制与在线改密',
    speaker: '少儿主讲人',
    action: '指引评委看展台立牌上的扫码连Wi-Fi桌牌，并在手机上演示 192.168.4.1 控制与改密。',
    script: '“更有趣的是，这栋小屋还内置了独立的 Wi-Fi AP 热点！评委老师可以看我们做好的展台立牌，手机扫码就能连上小屋 Wi-Fi。在手机网页上，不仅能一键开门，还可以随时在线修改门禁密码，修改后掌控板即刻同步更新！即使赛场完全没有外部 Wi-Fi 或断网，也能 100% 稳定遥控，真正做到了安全自愈！”'
  },
  {
    step: '第 5 分钟',
    title: 'VS Code + AI 前沿编程与总结致谢',
    speaker: '少儿主讲人',
    action: '自信总结作品价值，微笑着请评委老师提问。',
    script: '“在编程上，我们没有使用简单的积木，而是采用了前沿的 VS Code 配合 AI 助手编写了纯 MicroPython 代码，实现了矩阵扫描和非阻塞状态机。未来我还计划接入微型太阳能板，让它成为真正的零碳智慧家。我的汇报完毕，欢迎评委老师批评指正！”'
  }
];

export const JUDGE_QUESTIONS = [
  {
    q: '评委问：为什么使用 3×4 矩阵薄膜键盘，而不是用板载触摸按键？',
    a: '答：因为在真实的门禁产品中，实体按键的盲操手感、防误触能力和安全性远高于普通的金属触片；3×4 键盘支持 0~9 数字与按键掩码，支持任意位数的密码设定与现场改密，更符合真实的工业产品标准！'
  },
  {
    q: '评委问：防盗报警是怎么触发的，不用触碰按键吗？',
    a: '答：我们的防盗报警完全脱离了人工触碰！有两种触发方式：一是恶意人员连续输错 3 次密码，门禁自动锁死并报警；二是主人离家前按 * 号键进入‘布防模式’，门前的 PIR 人体热释电传感器只要检测到有人异常靠近，就会自动触发红蓝警灯爆闪和警笛，实现了真正的非接触智能安防！'
  },
  {
    q: '评委问：顶置门梁舵机相比后置连杆有什么优势？',
    a: '答：连杆推拉存在铰链旷量和死点，长期开合容易卡壳或关不严。我们采用‘门梁倒扣同心直驱’设计，舵机齿轮轴与门轴合页在同一直线上，舵机转多少度门就精确转多少度，结构紧凑且永远不会脱落或卡死！'
  },
  {
    q: '评委问：如果比赛现场完全没有 Wi-Fi 或网络，你的智能家居还能正常控制吗？',
    a: '答：完全可以！掌控板自身就是一个独立的无线 Wi-Fi AP 发射端（SmartHome-IoT），并内置了嵌入式 Web 服务器。现场哪怕断网、断电、手机没流量，只要手机连入掌控板热点，打开 192.168.4.1 就能 100% 稳定遥控，赛场零翻车风险！'
  },
  {
    q: '评委问：代码真是你自己写的吗？',
    a: '答：系统架构、矩阵扫描算法和通信协议是我们自己设计的！在编写代码时，我们使用了 VS Code 配合 AI 助手，我们向 AI 输入清晰的提示词生成函数框架，然后再烧录到掌控板调试。这让我提前体验到了现代工程师高效的 AI 协同研发方式！'
  },
  {
    q: '评委问：如果比赛现场小孩改错密码或者被围观同学按乱导致打不开门，怎么办？',
    a: '答：我们专门设计了‘赛场安全气囊机制’！只要持续按住掌控板正面物理 A 键 6 秒，屏幕会出现 6 秒倒计时动画并长鸣一声，系统就会强制关门并把密码重置为出厂的 123456，同时解除所有警报和锁定。6 秒的长按延时彻底防止了答辩时的无意误触，又保证了哪怕现场出现任何意外也能一键复原，绝对不卡壳！'
  }
];
