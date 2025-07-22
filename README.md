# 🌐 RatioMaster Web

Modern web version of RatioMaster.NET - A BitTorrent ratio faker with React frontend and ASP.NET Core backend.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple)](https://dotnet.microsoft.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ⚠️ Disclaimer

This tool is for educational purposes only. Use at your own risk and respect tracker rules and local laws.

## ✨ Features

- 🌐 Modern web interface accessible from any browser
- 🚀 Real-time updates with SignalR
- 🎯 Multiple BitTorrent client emulation
- 🔄 Session management (save/load configurations)
- 📊 Statistics dashboard with charts
- 🔐 Proxy support (HTTP, SOCKS4, SOCKS5)
- 🐳 Docker containerized deployment
- 📱 Responsive design for mobile devices

## 🚀 Quick Start

```bash
git clone https://github.com/nitroshady4000/ratiomaster-web.git
cd ratiomaster-web
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

Visit http://localhost:3000 to access the web interface.

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Migration from Original](docs/MIGRATION.md)

## 🏗️ Architecture

- **Backend**: ASP.NET Core 8.0 with SignalR
- **Frontend**: React 18 with Material-UI
- **Database**: SQL Server
- **Cache**: Redis
- **Proxy**: Nginx

## 📸 Screenshots

[Add screenshots here]

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

Based on the original [RatioMaster.NET](https://github.com/NikolayIT/RatioMaster.NET) by NikolayIT.
