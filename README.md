# Company Website

**English** | [中文](#中文)

---

## English

Official company website for **Blitzball Analytics** — showcasing our AI-powered products (Blitz DAW, CloseCrab AI Assistant), customer accounts, pricing, legal pages, and blog.

### Features

- **12-Language Internationalization** — Full i18n scaffolds for account pages and mobile remote control
- **Customer Accounts** — Login, register, account management, password reset
- **GeeTest v4 Captcha** — Anti-bot protection on login/register
- **Pricing Page** — Open-core model with feature comparison
- **Legal Pages** — Terms, Privacy, Refund policies (aligned to Paddle as MOR)
- **Blog** — Latest news and updates (bilingual)
- **Mobile Remote Control** — Cross-link to CloseCrab mobile access
- **One-Click Scripts** — `start.bat` / `stop.bat` for local development

### Quick Start

```bash
# Development mode (double-click or run manually)
start.bat              # Windows: starts HTTP server on :8000
```

Open `http://localhost:8000` in your browser.

### Project Structure

```
CompanyWebsite/
├── index.html        # Homepage with hero + product showcase
├── blog.html        # Blog page (latest news)
├── pricing.html         # Pricing page (open-core model)
├── account.html            # Customer account dashboard
├── login.html              # Login/register with GeeTest
├── reset-password.html     # Password reset
├── verify-email.html       # Email verification
├── terms.html              # Terms of service
├── privacy.html         # Privacy policy
├── refund.html        # Refund policy
├── closecrab.html      # CloseCrab product page
├── closecrab-mobile.html   # CloseCrab mobile remote guide
├── blitz.html              # Blitz DAW product page
├── i18n/                   # 12-language scaffolds (zh-CN, en, ja, es, fr...)
│   ├── account/            # Account page translations
│   └── mobile-remote/      # Mobile remote translations
├── css/              # Stylesheets
├── js/              # JavaScript (GeeTest, i18n, backend client)
└── images/                 # Assets
```

### Backend Integration

The site connects to `CompanyWebsite-Backend` for:
- Customer account operations (login/register/logout)
- License lookup (serial number by email)
- Payment webhook (Paddle → auto-issue license)
- Team leaderboard (when CloseCrab Team Mode is enabled)

Set backend URL via env-aware config:
- **Development**: `http://localhost:8080`
- **Production**: Same-origin (relative URLs)

### i18n System

Run `build_i18n.js` to generate translation scaffolds for new pages:

```bash
node build_i18n.js
```

Supported languages: `zh-CN`, `en`, `ja`, `es`, `fr`, `de`, `ru`, `ar`, `pt`, `it`, `ko`, `zh-TW`

### License

Proprietary. © 2024-2026 Blitzball Analytics. All rights reserved.

---

## 中文

**Blitzball Analytics** 官网 — 展示 AI 驱动产品（Blitz 音频工作站、CloseCrab AI 助手）、客户账户、定价、法律页面和博客。

### 功能

- **12 语言国际化** — 账户页面和手机遥控的完整 i18n 脚手架
- **客户账户** — 登录、注册、账户管理、重置密码
- **极验 v4 验证码** — 登录/注册防机器人
- **定价页面** — Open-core 模式功能对比
- **法律页面** — 条款、隐私、退款政策（对齐 Paddle 作为 MOR）
- **博客** — 最新消息和更新（双语）
- **手机遥控** — 跨链接到 CloseCrab 手机访问
- **一键脚本** — `start.bat` / `stop.bat` 本地开发

### 快速开始

```bash
# 开发模式（双击或手动运行）
start.bat              # Windows: 在 :8000 启动 HTTP 服务器
```

在浏览器打开 `http://localhost:8000`。

### 项目结构

```
CompanyWebsite/
├── index.html              # 首页（英雄区 + 产品展示）
├── blog.html               # 博客页面（最新新闻）
├── pricing.html            # 定价页面（开放核心模式）
├── account.html            # 客户账户面板
├── login.html           # 登录/注册（含极验）
├── reset-password.html     # 重置密码
├── verify-email.html       # 邮箱验证
├── terms.html          # 服务条款
├── privacy.html         # 隐私政策
├── refund.html           # 退款政策
├── closecrab.html          # CloseCrab 产品页
├── closecrab-mobile.html   # CloseCrab 手机遥控指南
├── blitz.html           # Blitz DAW 产品页
├── i18n/              # 12 语言脚手架（zh-CN、en、ja、es、fr...）
│   ├── account/            # 账户页面翻译
│   └── mobile-remote/    # 手机遥控翻译
├── css/                  # 样式表
├── js/                     # JavaScript（极验、i18n、后端客户端）
└── images/           # 资源文件
```

### 后端集成

网站连接 `CompanyWebsite-Backend` 用于：
- 客户账户操作（登录/注册/登出）
- 许可证查询（邮箱查序列号）
- 支付 webhook（Paddle → 自动发码）
- 团队排行榜（CloseCrab 团队模式启用时）

后端 URL 通过环境配置：
- **开发**: `http://localhost:8080`
- **生产**: 同源（相对 URL）

### i18n 系统

运行 `build_i18n.js` 为新页面生成翻译脚手架：

```bash
node build_i18n.js
```

支持语言：`zh-CN`, `en`, `ja`, `es`, `fr`, `de`, `ru`, `ar`, `pt`, `it`, `ko`, `zh-TW`

### 许可证

专有。© 2024-2026 Blitzball Analytics。保留所有权利。
