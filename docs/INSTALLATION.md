# 📖 Installation Guide

## 🔧 Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** for cloning the repository
- **2GB RAM** minimum
- **5GB disk space** for Docker images and data
- Ports **80**, **3000**, **5000** must be available

## 🚀 Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nitroshady4000/ratiomaster-web.git
cd ratiomaster-web
```

### 2. Make Scripts Executable

```bash
chmod +x scripts/deploy.sh
chmod +x scripts/stop.sh
```

### 3. Deploy the Application

```bash
./scripts/deploy.sh
```

The script will:
- Create necessary directories
- Build Docker images
- Start all services
- Perform health checks

### 4. Access the Application

- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health

## 🔧 Manual Installation

### Step 1: Environment Setup

Create a `.env` file in the root directory:

```env
# Database
SA_PASSWORD=YourStrongPassword123!
MSSQL_PID=Express

# Redis
REDIS_PASSWORD=YourRedisPassword456!

# API URLs
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000/hub
```

### Step 2: Build and Start Services

```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# Check service status
docker-compose ps
```

### Step 3: Database Migration

```bash
# Run database migrations
docker-compose exec ratiomaster-api dotnet ef database update
```

## 🔍 Verification

### Health Checks

```bash
# Test frontend
curl -f http://localhost:3000

# Test API
curl -f http://localhost:5000/health

# Test database connection
docker-compose exec ratiomaster-api dotnet ef migrations list
```

### Service Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f ratiomaster-api
docker-compose logs -f ratiomaster-web
```

## 🛠️ Configuration

### Custom Ports

Edit `docker-compose.yml` to change default ports:

```yaml
services:
  ratiomaster-web:
    ports:
      - "8080:80"  # Change from 3000 to 8080
  
  ratiomaster-api:
    ports:
      - "8081:80"  # Change from 5000 to 8081
```

### SSL/HTTPS Setup

1. Generate certificates:
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/server.key \
  -out nginx/ssl/server.crt
```

2. Update `nginx/nginx.conf` for HTTPS configuration

### Performance Tuning

For production environments:

```yaml
# docker-compose.prod.yml
services:
  ratiomaster-api:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
    restart: unless-stopped
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Database Connection Error**
```bash
# Reset database
docker-compose down
docker volume rm ratiomaster-web_ratiomaster-db-data
docker-compose up -d ratiomaster-db
```

**Build Failures**
```bash
# Clean Docker cache
docker system prune -a
# Rebuild without cache
docker-compose build --no-cache
```

### Log Analysis

```bash
# Check API logs for errors
docker-compose logs ratiomaster-api | grep -i error

# Monitor real-time logs
docker-compose logs -f --tail=100 ratiomaster-api
```

## 🔄 Updates

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Backup Before Update

```bash
# Backup database
docker-compose exec ratiomaster-db \
  /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword \
  -Q "BACKUP DATABASE RatioMasterDB TO DISK = '/tmp/backup.bak'"

# Copy backup out of container
docker cp ratiomaster-web_ratiomaster-db_1:/tmp/backup.bak ./backup.bak
```

## 🔒 Security Considerations

### Production Security

1. **Change Default Passwords**
   - Update database passwords in `.env`
   - Use strong, unique passwords

2. **Enable Firewall**
   ```bash
   # Allow only necessary ports
   ufw allow 80
   ufw allow 443
   ufw deny 5000  # Block direct API access
   ```

3. **Use HTTPS in Production**
   - Configure SSL certificates
   - Redirect HTTP to HTTPS

4. **Regular Updates**
   - Keep Docker images updated
   - Monitor security advisories

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review Docker logs
3. Check GitHub issues
4. Create a new issue with logs and configuration

## 🎯 Next Steps

After successful installation:

1. Read the [User Guide](USER_GUIDE.md)
2. Configure your first torrent
3. Set up sessions for backup
4. Customize settings for your needs
