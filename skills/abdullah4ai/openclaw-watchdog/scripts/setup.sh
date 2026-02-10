#!/usr/bin/env bash
set -euo pipefail

# ===========================================================================
# OpenClaw Watch Dog — Setup Script
# ===========================================================================

WATCHDOG_DIR="$HOME/.openclaw/watchdog"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$WATCHDOG_DIR/venv"
CONFIG_ENC="$WATCHDOG_DIR/config.enc"

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[✗]${NC} $*"; exit 1; }

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
TELEGRAM_TOKEN="" TELEGRAM_CHAT_ID="" OPENAI_KEY="" ANTHROPIC_KEY=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --telegram-token)  TELEGRAM_TOKEN="$2";  shift 2 ;;
        --telegram-chat-id) TELEGRAM_CHAT_ID="$2"; shift 2 ;;
        --openai-key)      OPENAI_KEY="$2";      shift 2 ;;
        --anthropic-key)   ANTHROPIC_KEY="$2";   shift 2 ;;
        *) error "Unknown argument: $1" ;;
    esac
done

[[ -z "$TELEGRAM_TOKEN" ]] && error "Missing --telegram-token"
[[ -z "$TELEGRAM_CHAT_ID" ]] && error "Missing --telegram-chat-id"
[[ -z "$OPENAI_KEY" && -z "$ANTHROPIC_KEY" ]] && error "Need at least one AI key (--openai-key or --anthropic-key)"

# ---------------------------------------------------------------------------
# Machine-specific password (must match watchdog.py logic)
# ---------------------------------------------------------------------------
machine_password() {
    local parts=""
    if [[ "$(uname)" == "Darwin" ]]; then
        local uuid
        uuid=$(ioreg -rd1 -c IOPlatformExpertDevice | awk -F'"' '/IOPlatformUUID/{print $4}') || true
        parts="${uuid}:"
    fi
    parts="${parts}$(hostname):${USER:-openclaw}"
    echo -n "$parts" | shasum -a 256 | awk '{print $1}'
}

# ---------------------------------------------------------------------------
# 1. Create working directory
# ---------------------------------------------------------------------------
info "Creating $WATCHDOG_DIR"
mkdir -p "$WATCHDOG_DIR"

# ---------------------------------------------------------------------------
# 2. Copy watchdog script
# ---------------------------------------------------------------------------
info "Installing watchdog.py"
cp "$SCRIPT_DIR/watchdog.py" "$WATCHDOG_DIR/watchdog.py"
chmod +x "$WATCHDOG_DIR/watchdog.py"

# ---------------------------------------------------------------------------
# 3. Python venv + dependencies
# ---------------------------------------------------------------------------
info "Setting up Python virtual environment"
python3 -m venv "$VENV_DIR"
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet aiohttp anthropic openai
info "Dependencies installed"

# ---------------------------------------------------------------------------
# 4. Encrypt credentials
# ---------------------------------------------------------------------------
info "Encrypting credentials"
PASSWORD=$(machine_password)

CONFIG_JSON=$(cat <<EOF
{
  "telegram_token": "$TELEGRAM_TOKEN",
  "telegram_chat_id": "$TELEGRAM_CHAT_ID",
  "openai_key": "$OPENAI_KEY",
  "anthropic_key": "$ANTHROPIC_KEY"
}
EOF
)

echo "$CONFIG_JSON" | openssl enc -aes-256-cbc -pbkdf2 -pass "pass:$PASSWORD" -out "$CONFIG_ENC"
chmod 600 "$CONFIG_ENC"
info "Credentials encrypted at $CONFIG_ENC"

# ---------------------------------------------------------------------------
# 5. Install as service
# ---------------------------------------------------------------------------
PYTHON_BIN="$VENV_DIR/bin/python3"
WATCHDOG_PY="$WATCHDOG_DIR/watchdog.py"

if [[ "$(uname)" == "Darwin" ]]; then
    # macOS LaunchAgent
    PLIST="$HOME/Library/LaunchAgents/com.openclaw.watchdog.plist"
    info "Installing LaunchAgent → $PLIST"
    mkdir -p "$HOME/Library/LaunchAgents"
    cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.watchdog</string>
    <key>ProgramArguments</key>
    <array>
        <string>$PYTHON_BIN</string>
        <string>$WATCHDOG_PY</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$WATCHDOG_DIR/watchdog.log</string>
    <key>StandardErrorPath</key>
    <string>$WATCHDOG_DIR/watchdog-error.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
PLIST

    launchctl unload "$PLIST" 2>/dev/null || true
    launchctl load "$PLIST"
    info "LaunchAgent loaded"

else
    # Linux systemd user service
    SERVICE_DIR="$HOME/.config/systemd/user"
    SERVICE_FILE="$SERVICE_DIR/openclaw-watchdog.service"
    info "Installing systemd service → $SERVICE_FILE"
    mkdir -p "$SERVICE_DIR"
    cat > "$SERVICE_FILE" <<UNIT
[Unit]
Description=OpenClaw Watch Dog
After=network.target

[Service]
Type=simple
ExecStart=$PYTHON_BIN $WATCHDOG_PY
Restart=always
RestartSec=10
Environment=PATH=/usr/local/bin:/usr/bin:/bin

[Install]
WantedBy=default.target
UNIT

    systemctl --user daemon-reload
    systemctl --user enable openclaw-watchdog
    systemctl --user restart openclaw-watchdog
    info "systemd service started"
fi

# ---------------------------------------------------------------------------
# 6. Verify
# ---------------------------------------------------------------------------
sleep 3
if [[ "$(uname)" == "Darwin" ]]; then
    if launchctl list | grep -q "com.openclaw.watchdog"; then
        info "Watch Dog is running! 🐕"
    else
        warn "Service may not have started — check $WATCHDOG_DIR/watchdog-error.log"
    fi
else
    if systemctl --user is-active openclaw-watchdog >/dev/null 2>&1; then
        info "Watch Dog is running! 🐕"
    else
        warn "Service may not have started — check: journalctl --user -u openclaw-watchdog"
    fi
fi

echo ""
info "Setup complete! Watch Dog is monitoring your gateway."
info "Logs: $WATCHDOG_DIR/watchdog.log"
info "Config: $CONFIG_ENC (encrypted)"
