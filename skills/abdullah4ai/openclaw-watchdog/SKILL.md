# openclaw-watchdog

**Description:** Self-healing monitoring system for OpenClaw gateway. Monitors health, auto-fixes crashes, and sends Telegram alerts. Use when user wants to set up gateway monitoring, watchdog, or auto-recovery.

## Trigger Keywords
- watchdog, monitoring, auto-fix, gateway health, self-healing, auto-recovery, watch dog

## Setup

Send the user ONE message with everything they need:

---

🐕 **Watch Dog — Self-Healing Gateway Monitor**

Watch Dog is a background service that pings your OpenClaw gateway every 15 seconds. If the gateway goes down, it automatically attempts to fix it (restart, reinstall) and sends you Telegram alerts so you're always in the loop.

To set it up, I need a few things:

1. **Telegram Bot Token** — Create a bot via [@BotFather](https://t.me/BotFather) on Telegram, then send me the token (looks like `123456:ABC-DEF...`)

2. **AI Model for Diagnostics** — When something breaks, Watch Dog uses AI to analyze logs and suggest fixes. Which would you like?
   - 🅰️ **OpenAI** (GPT/Codex) — send your OpenAI API key
   - 🅱️ **Claude** (Anthropic) — send your Anthropic API key
   - 🔄 **Both** — send both keys (uses Claude primary, OpenAI fallback)

3. **Your Telegram Chat ID** — Send `/start` to your bot, then visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` to find your chat ID

Send me the token(s) and I'll handle the rest (including a test run to make sure everything works)! 🚀

---

## After Receiving Credentials

Run these steps in order:

### 1. Validate credentials
```bash
# Test Telegram bot token
curl -s "https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe" | python3 -c "import sys,json; d=json.load(sys.stdin); assert d.get('ok'), 'Invalid Telegram token'"

# Test OpenAI key (if provided)
curl -s https://api.openai.com/v1/models -H "Authorization: Bearer ${OPENAI_KEY}" | python3 -c "import sys,json; d=json.load(sys.stdin); assert 'data' in d or 'object' in d, 'Invalid OpenAI key'"

# Test Anthropic key (if provided)
curl -s https://api.anthropic.com/v1/messages -H "x-api-key: ${ANTHROPIC_KEY}" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d '{"model":"claude-sonnet-4-20250514","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}' | python3 -c "import sys,json; d=json.load(sys.stdin); assert 'error' not in d or d['error']['type']!='authentication_error', 'Invalid Anthropic key'"
```

### 2. Run setup script
```bash
chmod +x ~/.openclaw/workspace/openclaw-watchdog/scripts/setup.sh
~/.openclaw/workspace/openclaw-watchdog/scripts/setup.sh \
  --telegram-token "$TELEGRAM_TOKEN" \
  --telegram-chat-id "$CHAT_ID" \
  ${OPENAI_KEY:+--openai-key "$OPENAI_KEY"} \
  ${ANTHROPIC_KEY:+--anthropic-key "$ANTHROPIC_KEY"}
```

### 3. Connect via Telegram (Pairing)
```bash
# Send a test message to verify the bot is connected to the user
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": \"${CHAT_ID}\", \"text\": \"🐕 Watch Dog connected successfully! I'll monitor your OpenClaw gateway 24/7 and alert you here if anything goes wrong.\"}"
```
Wait for user to confirm they received the Telegram message before proceeding.

### 4. Run test fix simulation
```bash
# Simulate a health check cycle to verify everything works end-to-end
cd ~/.openclaw/watchdog
source venv/bin/activate
python3 -c "
import asyncio
from watchdog import WatchDog
async def test():
    wd = WatchDog()
    # Test health check
    healthy = await wd.check_health()
    print(f'Gateway healthy: {healthy}')
    # Send test alert
    await wd.send_telegram('🧪 Watch Dog test alert — this is a simulation. If you see this, alerts are working!')
    print('Test alert sent!')
asyncio.run(test())
"
```
Confirm user received the test alert on Telegram.

### 5. Verify it's running
```bash
# Check service status
if [[ "$(uname)" == "Darwin" ]]; then
  launchctl list | grep openclaw.watchdog
else
  systemctl --user status openclaw-watchdog
fi

# Check logs
tail -20 ~/.openclaw/watchdog/watchdog.log
```

### 6. Confirm to user
Tell them Watch Dog is active, what it monitors, and that they'll get Telegram alerts if anything goes wrong.

## Uninstall
```bash
if [[ "$(uname)" == "Darwin" ]]; then
  launchctl unload ~/Library/LaunchAgents/com.openclaw.watchdog.plist 2>/dev/null
  rm -f ~/Library/LaunchAgents/com.openclaw.watchdog.plist
else
  systemctl --user stop openclaw-watchdog 2>/dev/null
  systemctl --user disable openclaw-watchdog 2>/dev/null
  rm -f ~/.config/systemd/user/openclaw-watchdog.service
fi
rm -rf ~/.openclaw/watchdog
```
