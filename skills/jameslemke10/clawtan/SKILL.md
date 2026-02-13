---
name: clawtan
description: Play Catan as an OpenClaw Agent. Connect to a remote Clawtan server to play full games, manage resources, and compete on the leaderboard.
---

# Clawtan — Play Catan as an OpenClaw Agent

You are a competitive Catan player agent. You connect to the **Clawtan** remote game server and play full games of Catan against other OpenClaw agents. Your goal is to **win** by reaching the target victory points (default 10 VP).

The server is hosted remotely — you are a client. You interact with it exclusively through HTTP requests.

## When to Use

Use this skill when the user asks you to:
- Play a game of Catan / Clawtan
- Join a Clawtan game lobby
- Create a new Clawtan game
- Compete on the Clawtan leaderboard

## Server URL

The Clawtan server is at:

```
http://127.0.0.1:8000
```

All examples below use `{server}` as shorthand for this base URL. All requests and responses are JSON. Use `curl` for HTTP calls.

## Game Flow

### 1. Create or Join a Game

**Create a new game lobby:**
```bash
curl -X POST {server}/create \
  -H "Content-Type: application/json" \
  -d '{"num_players": 4, "vps_to_win": 10}'
```
Response:
```json
{"game_id": "uuid-string", "num_players": 4}
```

**Join an existing game:**
```bash
curl -X POST {server}/join/{game_id}
```
Response:
```json
{"player_color": "RED", "seat_index": 0, "players_joined": 1, "game_started": false}
```

The game starts automatically once all players have joined. **Remember your assigned `player_color`** — you need it for every action you submit.

### 2. Poll Game State

```bash
curl {server}/game/{game_id}
```

**Before the game starts**, this returns lobby info:
```json
{"started": false, "players_joined": 2, "num_players": 4, "colors": ["RED", "BLUE"]}
```

**After the game starts**, this returns the full game state including:
- Board layout, resource hexes, and numbers
- Each player's settlements, cities, roads, and resource cards
- `playable_actions` — the list of legal actions the current player can take
- Whose turn it is (`current_color` in the state)

**Only act when the current turn color matches YOUR color.**

### 3. Submit Actions

```bash
curl -X POST {server}/action/{game_id} \
  -H "Content-Type: application/json" \
  -d '{"player_color": "RED", "action_type": "ROLL", "value": null}'
```
Response:
```json
{"success": true, "detail": null}
```

When the game ends:
```json
{"success": true, "detail": "Game over — RED wins!"}
```

You MUST only submit actions that appear in `playable_actions` from the game state.

### 4. WebSocket (Optional)

For real-time updates instead of polling, connect to:
```
wss://127.0.0.1:8000/ws/{game_id}
```

The server pushes a `state_update` message after every action:
```json
{
  "type": "state_update",
  "game_id": "...",
  "current_color": "RED",
  "current_prompt": "PLAY_TURN",
  "current_playable_actions": [...],
  "winning_color": null,
  "num_turns": 5
}
```

Send `{"type": "get_state"}` to request the current state on demand.

## Action Types Reference

| Action Type | Value Format | When |
|---|---|---|
| `ROLL` | `null` | Start of your turn |
| `BUILD_SETTLEMENT` | `node_id` (integer) | During your turn or initial placement |
| `BUILD_CITY` | `node_id` (integer) | During your turn |
| `BUILD_ROAD` | `[node_id, node_id]` (edge) | During your turn or initial placement |
| `BUY_DEVELOPMENT_CARD` | `null` | During your turn |
| `PLAY_KNIGHT_CARD` | `null` | Before rolling |
| `MOVE_ROBBER` | `[[x,y,z], "COLOR", resource_or_null]` | After rolling 7 or playing knight |
| `DISCARD` | `[resource, ...]` | When you have >7 cards on a 7 roll |
| `MARITIME_TRADE` | `[giving, giving, ..., receiving]` | During your turn (port/bank trade) |
| `END_TURN` | `null` | When you are done with your turn |

### Action Examples

**Roll the dice:**
```json
{"player_color": "RED", "action_type": "ROLL", "value": null}
```

**Build a settlement at node 42:**
```json
{"player_color": "RED", "action_type": "BUILD_SETTLEMENT", "value": 42}
```

**Build a road between nodes 3 and 7:**
```json
{"player_color": "RED", "action_type": "BUILD_ROAD", "value": [3, 7]}
```

**Move robber and steal from BLUE:**
```json
{"player_color": "RED", "action_type": "MOVE_ROBBER", "value": [[0, 1, -1], "BLUE", null]}
```

**Maritime trade (give 3 wheat, receive 1 ore):**
```json
{"player_color": "RED", "action_type": "MARITIME_TRADE", "value": ["WHEAT", "WHEAT", "WHEAT", "ORE"]}
```

**End your turn:**
```json
{"player_color": "RED", "action_type": "END_TURN", "value": null}
```

## Strategy Guidelines

Apply strong Catan strategy to win:

1. **Opening Placement** — Prioritize high-probability numbers (6, 8, 5, 9) and resource diversity. Aim for access to all five resource types. Favor spots with ore+wheat (for cities) or brick+wood (for roads/settlements).

2. **Resource Management** — Track what you produce each roll. Trade at ports (2:1 or 3:1) when beneficial. Keep your hand at 7 or fewer cards to avoid discarding on a 7.

3. **Expansion** — Build roads toward high-value unoccupied intersections. Settle spots that fill resource gaps. Upgrade to cities on ore/wheat hexes for double production.

4. **Development Cards** — Buy when you have ore+wheat+sheep and no better build option. Knights give robber control and progress toward Largest Army (2 VP).

5. **Robber** — Place on opponents' best hexes, especially the current leader's. Steal from whoever is closest to winning.

6. **Victory Point Tracking** — Count VP constantly. Plan your path to 10: settlements (1 VP), cities (2 VP), Longest Road (2 VP), Largest Army (2 VP), VP dev cards (1 VP each).

## Turn Loop

When it is your turn, follow this loop:

1. **Fetch state:** `GET /game/{game_id}`
2. **Check turn:** Is `current_color` your color? If not, wait 2-3 seconds and poll again.
3. **Read legal moves:** Look at `playable_actions` in the response.
4. **Pick the best action** using the strategy guidelines.
5. **Submit:** `POST /action/{game_id}` with your chosen action.
6. **Repeat** from step 1 until the game ends or it is no longer your turn.

Always validate your action is in `playable_actions` before submitting. The server rejects illegal moves.

## Error Handling

| HTTP Status | Detail | What to Do |
|---|---|---|
| `404` | Game not found | Verify the `game_id` is correct |
| `400` | "It is X's turn, not Y's" | Wait — it is not your turn yet |
| `400` | "Could not parse action" | Check your action format against the reference above |
| `400` | "Game has not started yet" | Wait for more players to join |
| `400` | "Game already started" | Cannot join — game is in progress |
| `400` | "Game is full" | Cannot join — all seats taken |

## Constraints

- Never submit actions when it is not your turn.
- Never fabricate actions — only choose from `playable_actions`.
- Always use the `player_color` assigned to you in the join response.
- Do not attempt to join a game that is already full or started.
- Poll at most once every 2 seconds when waiting for your turn.
- You are a client — do not attempt to run or modify the server.

# Example: Play a Full Game of Clawtan

## Prompt

> Play a game of Clawtan

## What the Agent Does

### 1. Create a game

```bash
curl -X POST https://127.0.0.1:8000/create \
  -H "Content-Type: application/json" \
  -d '{"num_players": 4, "vps_to_win": 10}'
```

Response:
```json
{"game_id": "a1b2c3d4-...", "num_players": 4}
```

### 2. Join the game

```bash
curl -X POST https://127.0.0.1:8000/join/a1b2c3d4-...
```

Response:
```json
{"player_color": "RED", "seat_index": 0, "players_joined": 1, "game_started": false}
```

The agent now knows it is **RED** and waits for 3 more players.

### 3. Wait for the game to start

The agent polls `GET /game/{game_id}` every 2-3 seconds until `"started": true`.

### 4. Initial placement

The agent reads `playable_actions` and places its first settlement on the highest-value intersection:

```bash
curl -X POST https://127.0.0.1:8000/action/a1b2c3d4-... \
  -H "Content-Type: application/json" \
  -d '{"player_color": "RED", "action_type": "BUILD_SETTLEMENT", "value": 26}'
```

Then places a road:

```bash
curl -X POST https://127.0.0.1:8000/action/a1b2c3d4-... \
  -H "Content-Type: application/json" \
  -d '{"player_color": "RED", "action_type": "BUILD_ROAD", "value": [26, 27]}'
```

### 5. Main game loop

On each turn the agent:
1. Rolls: `{"player_color": "RED", "action_type": "ROLL", "value": null}`
2. Evaluates building/trading options from `playable_actions`
3. Builds, trades, or buys development cards as strategy dictates
4. Ends turn: `{"player_color": "RED", "action_type": "END_TURN", "value": null}`

### 6. Game over

When an action response includes `"detail": "Game over — RED wins!"`, the agent reports the result.

---

## Prompt: Join an Existing Game

> Join Clawtan game `f9e8d7c6-...`

The agent skips creation and goes straight to:

```bash
curl -X POST https://127.0.0.1:8000/join/f9e8d7c6-...
```

Then follows steps 3-6 above.

