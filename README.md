# VPS Monitor

Dashboard satu proses. Tidak perlu agent, database, atau dependency.

```bash
git clone https://github.com/DanzzMa/vps-monitor.git
cd vps-monitor
cp .env.example .env
nano .env
node server.js
```

Buka `http://IP-VPS:3088`.

`.env`:

```env
PORT=3088
NODE_NAME=MONITORING-NODE-SGP
MONITOR_TOKEN=change-this-long-token
DISCORD_WEBHOOK_URL=
DISCORD_REPORT_INTERVAL=10000
ALERT_CPU=90
ALERT_RAM=90
ALERT_DISK=90
```

Update:

```bash
git pull
```
