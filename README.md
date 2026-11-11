# VPS Monitor

Dashboard Node.js tanpa dependency. Monitor CPU, RAM, disk, load, uptime, latency, network speed, online/offline. Alert Discord webhook.

## Dashboard
```bash
cp .env.example .env
# isi MONITOR_TOKEN + DISCORD_WEBHOOK_URL opsional
node server.js
# buka http://IP:3088
```

## Agent tiap VPS
```bash
MONITOR_URL=http://DASHBOARD_IP:3088 MONITOR_TOKEN=TOKEN NODE_NAME=MONITORING-NODE-SGP node agent/agent.js
```

Agent hanya memakai Node.js 18+ bawaan. Untuk service permanen, gunakan systemd/PM2. Jangan expose port tanpa firewall/reverse proxy; gunakan token panjang + HTTPS tunnel/Nginx.
