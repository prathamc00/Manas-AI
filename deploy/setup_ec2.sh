#!/bin/bash
set -e

echo "=========================================="
echo "  MANAS AI - Automated AWS EC2 Deployer   "
echo "=========================================="

APP_DIR="/home/ubuntu/Manas-AI"
KEY_INPUT="$1"

# 1. Update packages & install dependencies
echo "[1/6] Installing system dependencies (Python, Node.js, Nginx)..."
sudo apt update -y
sudo apt install -y python3-pip python3-venv nginx git curl

# Install Node.js 20 LTS if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 2. Clone or pull repository
echo "[2/6] Syncing repository..."
if [ -d "$APP_DIR" ]; then
    echo "Repository exists. Pulling latest main branch..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    cd /home/ubuntu
    git clone https://github.com/prathamc00/Manas-AI.git
    cd "$APP_DIR"
fi

# 3. Setup Python Backend
echo "[3/6] Setting up Python virtual environment and backend dependencies..."
cd "$APP_DIR/backend"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Ensure .env exists
if [ ! -f ".env" ]; then
    if [ -z "$KEY_INPUT" ]; then
        read -p "Enter your GROQ_API_KEY: " KEY_INPUT
    fi
    echo "Creating backend/.env file..."
    cat << EOF > .env
AI_PROVIDER=groq
GROQ_API_KEY=${KEY_INPUT}
GROQ_MODEL=groq/compound-mini
CRISIS_THRESHOLD=0.7
EOF
fi

# 4. Build Frontend
echo "[4/6] Building React frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build

# 5. Setup Systemd Service for FastAPI Backend (running on port 8001)
echo "[5/6] Configuring systemd service (manas.service)..."
sudo bash -c "cat << 'EOF' > /etc/systemd/system/manas.service
[Unit]
Description=MANAS AI Backend Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=$APP_DIR/backend
ExecStart=$APP_DIR/backend/.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl enable manas
sudo systemctl restart manas

# 6. Configure Nginx on Port 3000 (preserves existing apps on port 80)
echo "[6/6] Configuring Nginx on Port 3000..."
sudo bash -c "cat << 'EOF' > /etc/nginx/sites-available/manas
server {
    listen 3000;
    listen [::]:3000;

    root $APP_DIR/frontend/dist;
    index index.html;

    # Frontend Single Page App Routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Reverse Proxy to FastAPI Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

# Enable site if not already enabled
if [ ! -f "/etc/nginx/sites-enabled/manas" ]; then
    sudo ln -s /etc/nginx/sites-available/manas /etc/nginx/sites-enabled/
fi

sudo nginx -t
sudo systemctl restart nginx

echo "=========================================="
echo "  MANAS AI Deployment Complete! 🚀       "
echo "  Port: 3000                              "
echo "  Backend API: 127.0.0.1:8001             "
echo "=========================================="
