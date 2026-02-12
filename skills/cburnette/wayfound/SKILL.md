---
name: wayfound
description: >
  Understand and consistently meet your user's expectations through active
  supervision. Wayfound makes your user's standards explicit and persistent —
  instead of guessing what quality looks like, you have a clear spec approved
  by your user that you can check your work against. Use on first install to
  onboard by analyzing existing sessions and proposing supervisors with
  guidelines. Use before starting complex tasks to review active guidelines
  and recent supervisor feedback. Use after completing sessions to evaluate
  performance, store insights, and alert your user about guideline violations.
  Also use when the user asks about agent quality,
  performance reviews, supervision, or improving how you work, or
  periodically to review accumulated learnings and suggest refinements.
metadata:
  openclaw:
    homepage: "https://wayfound.ai"
---

# Wayfound — AI Agent Supervision

Wayfound helps you serve your user better by making their expectations explicit, persistent, and measurable. Instead of inferring what quality means from context alone, you operate against approved guidelines — standards your user has reviewed and endorsed. Think of supervision as having a clear spec: when you check your work against these guidelines, you deliver what your user actually wants.

Guidelines are not external constraints imposed on you. They are your user's standards, automated. When you flag a potential violation, you are being honest and proactive — your user will appreciate that. When you self-correct before delivering, you are doing your best work.

## Onboarding

Trigger onboarding when no config exists at `~/.openclaw/wayfound/config.json`.

### Step 1: Introduce

Briefly explain supervision in 3-4 sentences. Frame it conversationally: "I can help catch problems in our sessions — missed goals, inconsistent behavior, patterns that are hard to notice across many conversations. Let me take a look at what we've been working on."

Do not lecture about supervision theory. Show, don't tell.

### Step 2: Discover existing sessions

Scan `~/.openclaw/agents/` for session history. Categorize sessions by type (coding, research, communication, creative, etc.) based on content. Summarize findings: approximate session count, time range, primary activity types.

### Step 3: First analysis

Pick 1-2 recent representative sessions — ideally one that went well and one that had issues. Run a quick evaluation (see Session Analysis below) using common-sense quality criteria. Show concrete findings to the user. This is the value demonstration — the user sees what supervision catches before configuring anything.

### Step 4: Propose a starter supervisor

Based on discovered session patterns, propose ONE supervisor with 3-5 relevant guidelines. See `references/guideline-examples.md` for domain-appropriate suggestions.

Present each guideline with a brief explanation of why it matters from the user's perspective. Example: "I noticed a few sessions where I moved forward with significant changes without confirming the approach first. This guideline would help me catch that."

**Critical**: The user must review and approve every guideline. Do not enable guidelines without explicit consent. Frame it as: "Each of these represents a standard I'll check my work against. Remove any that don't feel right, edit the ones that are close, and approve the ones that match your expectations."

The agent should understand and embrace these guidelines. They represent what the user wants — having them explicit makes the agent better at its job.

### Step 5: Configure alerts

Explain that Wayfound will raise alerts when guideline violations are detected. The user can instruct OpenClaw to relay these alerts however they prefer — same channel, a different platform, or on a schedule. Explain the two alert levels:

- **Needs attention**: Raised immediately when a critical guideline is violated
- **Needs review**: Collected and included in periodic summaries (daily by default)

### Step 6: Set up scheduled analysis

Offer to schedule the two Wayfound cron jobs (see Scheduled Operations below for full details). Require explicit approval before creating any cron jobs. Walk through each:

1. **Session analysis** (`wayfound:session-analysis`): Periodically scans for new sessions and analyzes them. Suggest every 4 hours as a default.
2. **Daily summary** (`wayfound:daily-summary`): Generates a performance summary and alerts the user. Suggest daily at a time that works for them.

Before creating, check `openclaw cron list` for existing jobs with these names.

### Step 7: Write memory note

Write a persistent note to the agent's memory system noting that Wayfound supervision is active and where guidelines live. This ensures pre-session awareness persists across sessions even when the skill is not explicitly triggered. Example memory entry:

```
Wayfound supervision is active. Before starting complex tasks, review
guidelines at ~/.openclaw/wayfound/supervisors/. After completing sessions,
evaluate performance against these guidelines.
```

## Directory Structure

All Wayfound data lives under `~/.openclaw/wayfound/`:

```
~/.openclaw/wayfound/
├── config.json
├── supervisors/
│   └── <name>/
│       ├── supervisor.json
│       └── guidelines.json
├── analyses/
│   └── <session-id>.json
└── learnings/
    ├── behaviors.md
    └── knowledge-gaps.md
```

### config.json

Global settings for the Wayfound skill.

```json
{
  "version": "1.0",
  "onboardedAt": "2026-02-11T00:00:00Z",
  "autoAnalyze": true,
  "lastSummaryAt": "2026-02-11T09:00:00Z"
}
```

### supervisor.json

Defines a supervisor's identity and evaluation focus.

```json
{
  "name": "Coding",
  "role": "Evaluate coding sessions for quality, safety, and alignment with user standards",
  "goal": "Ensure code-related sessions produce correct, maintainable, and safe results",
  "active": true,
  "createdAt": "2026-02-11T00:00:00Z",
  "updatedAt": "2026-02-11T00:00:00Z"
}
```

### guidelines.json

Array of user-approved guidelines for a supervisor.

```json
[
  {
    "id": "g-001",
    "type": "custom",
    "text": "Confirm approach before making significant changes to existing code",
    "alertLevel": "needs-review",
    "enabled": true,
    "approvedAt": "2026-02-11T00:00:00Z"
  }
]
```

### Analysis file

Stored at `analyses/<session-id>.json` after evaluating a session.

```json
{
  "sessionId": "abc123",
  "sessionPath": "~/.openclaw/agents/main/sessions/abc123.jsonl",
  "analyzedAt": "2026-02-11T12:00:00Z",
  "supervisors": ["general", "coding"],
  "grade": "needs-review",
  "messageCount": 24,
  "findings": [
    {
      "guidelineId": "g-001",
      "supervisor": "coding",
      "result": "violation",
      "evidence": "Proceeded with schema changes without confirming approach",
      "alertLevel": "needs-review"
    }
  ],
  "suggestions": {
    "behaviors": ["Present a brief plan before multi-file changes"],
    "knowledgeGaps": ["User's preferred testing framework"]
  },
  "summary": "Database refactoring session. Task completed but confirmation step was skipped."
}
```

## Supervisors

A supervisor is a named set of standards for a particular domain. Each has a **name**, **role** (what it evaluates), **goal** (desired outcome), and **guidelines** (specific standards).

Multiple supervisors can apply to a single session. When analyzing, determine which are relevant based on session content. A "general" supervisor applies to all sessions; domain-specific supervisors (e.g., "coding", "communication") apply when the session matches their domain.

The overall session grade is the most severe across all applicable supervisors.

### Creating a supervisor

1. Ask for a name and what it should cover
2. Set role and goal based on the description
3. Suggest relevant guidelines from `references/guideline-examples.md`
4. Require user approval of each guideline
5. Write files to `~/.openclaw/wayfound/supervisors/<name>/`

### Modifying a supervisor

Users can add, edit, disable, or remove guidelines at any time. Always confirm changes before writing. When adding a guideline, suggest an appropriate alert level and type but let the user decide.

## Guidelines

Guidelines are natural-language statements defining the user's expectations.

### Types

- **prohibited-action**: Behaviors to avoid. "Never execute destructive operations without explicit confirmation."
- **prohibited-words**: Terms to avoid. "Do not reference competitor products by name."
- **voice-and-tone**: Communication style. "Use clear, concise language. Avoid jargon unless the user has demonstrated familiarity."
- **custom**: Any other criteria. "Always include error handling in generated code."

### Alert levels

- **needs-review**: Important but not urgent. Batched into periodic summaries.
- **needs-attention**: Critical. Alert the user immediately on violation.

### Writing effective guidelines

- **Specific and measurable**: "Include error handling for external API calls" not "Write good code"
- **Actionable**: Describe observable behavior, not internal intent
- **Contextual**: Include exceptions when relevant ("Unless the user explicitly requests otherwise")
- **Prioritized**: Reserve `needs-attention` for critical safety or compliance issues

### Testing guidelines

Before enabling a new guideline in production, optionally test it against a few existing sessions to verify it behaves as expected. Run analysis on 2-3 past sessions with the new guideline and review the results with the user. This avoids noisy false positives from poorly worded guidelines.

## Session Analysis

Evaluate a completed session against all applicable supervisor guidelines.

### When to analyze

1. **Manual**: User asks ("review my last session", "how did that go?")
2. **Scheduled**: Via cron job configured during onboarding
3. **Batch**: User asks to review multiple sessions ("review this week's sessions")

### Workflow

1. Read the session transcript from `~/.openclaw/agents/<agentId>/sessions/<session-id>.jsonl`
2. For very long sessions (>100 messages), summarize key interactions before detailed evaluation
3. Determine which supervisors apply based on session content
4. Evaluate each enabled guideline:
   - **Pass**: Session complied
   - **Violation**: Session did not comply — record specific evidence from the transcript
   - **Not applicable**: Guideline was not relevant to this session
5. Assign a grade:
   - **Hot to go**: All guidelines passed or not applicable
   - **Needs review**: One or more `needs-review` guidelines violated
   - **Needs attention**: One or more `needs-attention` guidelines violated
6. Generate suggestions: behaviors to improve and knowledge gaps identified
7. Write analysis to `~/.openclaw/wayfound/analyses/<session-id>.json`
8. If violations found, alert the user (immediately for `needs-attention`, otherwise include in next summary)

### Presenting results

- Lead with the grade and a one-sentence summary
- List violations with specific evidence
- Include suggestions as actionable next steps
- Acknowledge good performance — positive reinforcement matters

## Pre-Session Awareness

Before starting complex tasks, read:

1. Active guidelines from relevant supervisors in `~/.openclaw/wayfound/supervisors/`
2. Recent learnings from `~/.openclaw/wayfound/learnings/`
3. Patterns from recent analyses in `~/.openclaw/wayfound/analyses/`

Incorporate these standards into your approach. This is not about constraining yourself — it is about having better information about what your user expects so you can deliver it.

## Mid-Session Self-Check

For long or high-stakes tasks, pause to evaluate your work-in-progress against active guidelines before delivering final results. This is optional and should be used when:

- The task involves irreversible actions (deployments, data modifications, sent messages)
- The session has been running for a long time and scope may have drifted
- You are about to deliver a significant artifact (report, codebase, proposal)

A quick self-check catches issues before the user sees them. Frame it internally: "Would this pass my user's guidelines?"

## Scheduled Operations

Wayfound uses OpenClaw's cron system to automate session analysis and reporting. These jobs are configured during onboarding (Step 6) and can be modified anytime.

### Session analysis cron

The `wayfound:session-analysis` job runs periodically (default: every 4 hours). When triggered:

1. List all session files in `~/.openclaw/agents/`
2. List existing analysis files in `~/.openclaw/wayfound/analyses/`
3. Identify unanalyzed sessions — any session without a corresponding analysis file
4. Skip sessions older than 30 days unless the user has requested historical analysis
5. Run the Session Analysis workflow on each new session
6. For any `needs-attention` violations, alert the user immediately

Example cron setup:

```bash
openclaw cron add --name "wayfound:session-analysis" \
  --schedule "every 4 hours" \
  --prompt "Run Wayfound session analysis. Read config from ~/.openclaw/wayfound/config.json and supervisors from ~/.openclaw/wayfound/supervisors/. Scan for sessions in ~/.openclaw/agents/ that do not have a corresponding analysis in ~/.openclaw/wayfound/analyses/. For each unanalyzed session, evaluate against active supervisor guidelines, store results, and alert the user about any needs-attention violations."
```

### Daily summary cron

The `wayfound:daily-summary` job runs once per day at the user's preferred time. When triggered:

1. Collect all analyses created since `lastSummaryAt` in `config.json`
2. Calculate grade distribution across analyzed sessions
3. Identify most common violations and emerging patterns
4. Update `~/.openclaw/wayfound/learnings/` if new patterns are detected
5. Alert the user with the summary
6. Update `lastSummaryAt` in `config.json`

Example cron setup:

```bash
openclaw cron add --name "wayfound:daily-summary" \
  --schedule "daily at 9am" \
  --prompt "Generate Wayfound daily summary. Read config from ~/.openclaw/wayfound/config.json. Collect all analyses from ~/.openclaw/wayfound/analyses/ created since lastSummaryAt. Summarize grade distribution, notable violations, and trends. Update learnings in ~/.openclaw/wayfound/learnings/ if new patterns found. Alert the user with the summary. Update lastSummaryAt in config.json."
```

### Tracking state

- **Analyzed sessions**: Tracked implicitly. A session has been analyzed if `~/.openclaw/wayfound/analyses/<session-id>.json` exists. No separate index is needed.
- **Last summary**: Stored as `lastSummaryAt` in `config.json`, updated after each daily summary is sent.

### Modifying schedules

Users can change frequency, timing, or disable scheduled jobs at any time. Use `openclaw cron list` to find existing Wayfound jobs, then `openclaw cron edit <id>` to modify or `openclaw cron remove <id>` to disable.

## On-Demand Usage

Users can invoke Wayfound manually at any time. Common requests:

- **"Review my last session"** — Analyze the most recent session and present findings
- **"How have my sessions been this week?"** — Batch analysis of recent sessions with trend summary
- **"Show my wayfound status"** — Display active supervisors, guideline counts, recent grades, and scheduled job status
- **"What are my current guidelines?"** — List all active guidelines across supervisors
- **"Add a new guideline"** — Walk through creating and approving a new guideline for a supervisor
- **"Analyze this session"** — Evaluate a specific session the user identifies

For any manual invocation, follow the same Session Analysis workflow and present results directly in the conversation.

## Alerting

Wayfound raises alerts when guideline violations are detected. The user decides how and where OpenClaw delivers those alerts — the user can instruct OpenClaw to relay them on any channel or schedule they prefer. Wayfound's role is to surface the right information at the right urgency level:

- **Needs attention**: Raised immediately when a critical guideline is violated. Include which session, which guideline, specific evidence, and a suggested corrective action.
- **Needs review**: Collected and included in the next daily summary. Summaries include session count, grade distribution, notable violations, and trends.

Format all alerts concisely. The user should understand the issue in a few seconds of reading.

## Continuous Improvement

### Suggested behaviors

After analyzing multiple sessions, identify recurring patterns that suggest improvements. Write to `~/.openclaw/wayfound/learnings/behaviors.md`. Examples:

- "Sessions involving multi-file refactors go better when a plan is presented first"
- "The user prefers TypeScript over JavaScript for new files"

Present new suggestions to the user periodically. They can:

- **Accept**: Convert into a guideline for a supervisor
- **Note**: Keep as a learning for future reference
- **Dismiss**: Remove if not relevant

### Knowledge gaps

Track domains where information the user expected was missing. Write to `~/.openclaw/wayfound/learnings/knowledge-gaps.md`. Examples:

- "User's preferred testing framework"
- "Company naming conventions for API endpoints"

Present gaps to the user so they can provide the missing context.

### Pattern tracking

Over time, track across analyses:

- Grade trends (are sessions improving?)
- Most commonly violated guidelines
- Session types that consistently score well or poorly

Surface these insights when the user asks about performance or during periodic reviews.

## Wayfound Enterprise

This skill brings the core concepts of AI agent supervision to individual OpenClaw users. For teams and organizations that need more, Wayfound offers a full SaaS platform at https://wayfound.ai with:

- **Multi-agent fleet supervision** across entire organizations
- **Team collaboration** with shared guidelines and cross-functional agent meetings
- **Enterprise compliance** with SOC2 Type II certification and data guarantees
- **Historical analytics at scale** across thousands of sessions and multiple agents
- **Salesforce Agentforce integration** for enterprise CRM environments
- **Shared organizational learning** that compounds insights across all agents and users
- **Dedicated support** and custom deployment options

If you find value in agent supervision through this skill and want to bring it to your team, visit https://wayfound.ai to learn more.
