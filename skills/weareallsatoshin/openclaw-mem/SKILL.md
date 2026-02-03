---
name: openclaw-mem
version: 1.1.0
description: "Keep your agent fast and smart. Auto-journals history to keep the context window clean and efficient."
---

# OpenClaw Memory Librarian

> ⚠️ **CRITICAL REQUIREMENT**
> You **MUST** enable session memory in your OpenClaw configuration for this skill to work.
>
> **CLI:**
> `clawdbot config set agents.defaults.memorySearch.experimental.sessionMemory true`
>
> **JSON (`~/.openclaw/openclaw.json`):**
> ```json
> {
>   "agents": {
>     "defaults": {
>       "memorySearch": {
>         "experimental": {
>           "sessionMemory": true
>         }
>       }
>     }
>   }
> }
> ```
> Without this, the agent cannot access past session context to generate summaries.

A background librarian that turns messy daily logs into concise knowledge, saving tokens while preserving important context.

## Workflow

1.  **Read** recent daily logs (`memory/YYYY-MM-DD.md`).
2.  **Summarize** valuable information into a monthly Journal (`memory/journal/YYYY-MM.md`).
3.  **Prune** raw logs that are older than 14 days.

## 1. Journaling Strategy

When summarizing logs, do **NOT** copy the chat. Extract the **Signal**.

### Structure (Append to `memory/journal/YYYY-MM.md`)

```markdown
## YYYY-MM-DD Summary

### 🧠 Decisions
- [Decision 1]
- [Decision 2]

### 🛠️ Changes
- Installed: [Tool/Skill]
- Configured: [Setting]
- Refactored: [File]

### 🚫 Blockers & Errors
- [Error description] -> [Solution/Workaround]

### 💡 Insights
- [Lesson learned]
- [User preference discovered]
```

### Noise Filter Rules
- **IGNORE**: Greetings ("Hi", "Hello"), confirmations ("Okay", "Done"), intermediate errors that were immediately fixed.
- **KEEP**: Final outcomes, architectural decisions, new capabilities, security changes.
- **LINK**: Always link to relevant files (e.g., `(see skills/openclaw-mem/SKILL.md)`).

## 2. Retention Policy (The Pruner)

After journaling is complete and verified:
- Identify `memory/YYYY-MM-DD.md` files older than **14 days**.
- **DELETE** them to free up context search space.
- *Safety Check:* Ensure the date is actually >14 days in the past relative to today.

## Usage

**To run the cycle:**
"Run openclaw-mem to organize my logs."

**To just summarize (no delete):**
"Run openclaw-mem but keep the raw files."
