# 01: 零基础开发环境搭建与掌控板首跑点亮 (VS Code + MicroPico)

**What to build:**
家长与孩子使用家用电脑（Windows 或 Mac），安装现代专业级编程工具 VS Code 与 MicroPico 扩展插件；使用常规 Type-C 数据线将掌控板 2.0 连接到电脑，识别串口 COM 口，并成功运行第一段简短 Python 测试程序，使掌控板 1.3 寸 OLED 屏幕亮起“Hello mPython!”与孩子名字，彻底打通“电脑 -> 掌控板”的通信开发链路。

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] 电脑端下载并安装 Visual Studio Code 官方客户端
- [ ] 在 VS Code 扩展市场搜索并安装 `MicroPico` 插件（原 RT-Thread MicroPython）
- [ ] 确保掌控板 2.0 CH340 串口驱动正常（插上电脑设备管理器能识别到 COM 端口）
- [ ] 在 VS Code 底部状态栏成功看到掌控板连接提示（如 `mPython Connected`）
- [ ] 新建 `hello.py`，编写 5 行测试代码，按快捷键 `Ctrl+Alt+R` 成功在掌控板屏幕输出孩子名字
- [ ] 掌握底层 REPL 交互终端的基本使用与常用排错方法（如线缆仅充电无数据线的问题）
