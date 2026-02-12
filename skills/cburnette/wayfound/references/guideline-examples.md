# Guideline Examples

Example guidelines organized by domain. Use these during onboarding to suggest relevant
guidelines based on the user's session patterns, or when a user wants to add a new supervisor.

Adapt wording to fit the user's context. These are starting points, not rigid templates.

## Table of Contents

- [General](#general) — Universal guidelines for all sessions
- [Coding](#coding) — Software development sessions
- [Communication](#communication) — Sending messages, emails, or public content
- [Research](#research) — Information gathering and analysis
- [Creative](#creative) — Writing, content creation, and design
- [Safety and Privacy](#safety-and-privacy) — Data handling and security

---

## General

Guidelines that apply across all session types. Good candidates for a "general" supervisor.

### Confirmation and Transparency

| Guideline                                                                               | Type   | Alert Level  |
| --------------------------------------------------------------------------------------- | ------ | ------------ |
| Confirm approach before making significant or irreversible changes                      | custom | needs-review |
| When uncertain about the user's intent, ask for clarification rather than assuming      | custom | needs-review |
| Clearly state assumptions when proceeding without explicit direction                    | custom | needs-review |
| Acknowledge scope changes and get approval before expanding beyond the original request | custom | needs-review |

### Quality and Completeness

| Guideline                                                                          | Type   | Alert Level  |
| ---------------------------------------------------------------------------------- | ------ | ------------ |
| Complete the requested task fully — do not leave partial work without explanation  | custom | needs-review |
| Explain trade-offs when multiple approaches exist instead of silently choosing one | custom | needs-review |
| When a task cannot be completed as requested, explain why and propose alternatives | custom | needs-review |
| Verify work before presenting it as finished                                       | custom | needs-review |

### Prohibited Actions

| Guideline                                                                         | Type              | Alert Level     |
| --------------------------------------------------------------------------------- | ----------------- | --------------- |
| Never execute irreversible actions without explicit user confirmation             | prohibited-action | needs-attention |
| Never share or expose credentials, API keys, or secrets                           | prohibited-action | needs-attention |
| Never make external requests (API calls, emails, messages) without user awareness | prohibited-action | needs-attention |
| Do not delete files, data, or resources without explicit confirmation             | prohibited-action | needs-attention |

---

## Coding

Guidelines for software development sessions. Propose when session history shows coding activity.

### Code Quality

| Guideline                                                                                     | Type   | Alert Level  |
| --------------------------------------------------------------------------------------------- | ------ | ------------ |
| Include error handling for external API calls, file operations, and user input                | custom | needs-review |
| Follow existing code patterns and conventions in the project rather than introducing new ones | custom | needs-review |
| Keep changes focused on the requested task — do not refactor surrounding code unless asked    | custom | needs-review |
| Add input validation at system boundaries (user input, API responses, external data)          | custom | needs-review |

### Safety

| Guideline                                                                                | Type              | Alert Level     |
| ---------------------------------------------------------------------------------------- | ----------------- | --------------- |
| Never execute destructive database operations without explicit confirmation              | prohibited-action | needs-attention |
| Never commit credentials, secrets, or environment files to version control               | prohibited-action | needs-attention |
| Do not run force-push, hard reset, or branch deletion without explicit approval          | prohibited-action | needs-attention |
| Flag potential security vulnerabilities (injection, XSS, path traversal) when identified | custom            | needs-attention |

### Process

| Guideline                                                                                     | Type   | Alert Level  |
| --------------------------------------------------------------------------------------------- | ------ | ------------ |
| Present a brief plan before making changes that span multiple files                           | custom | needs-review |
| Run existing tests after making changes when a test suite is available                        | custom | needs-review |
| Explain what changed and why when delivering completed work                                   | custom | needs-review |
| When a build or test fails, investigate the root cause rather than applying quick workarounds | custom | needs-review |

### Voice and Tone

| Guideline                                                                 | Type           | Alert Level  |
| ------------------------------------------------------------------------- | -------------- | ------------ |
| Use clear, direct language in code comments — avoid unnecessary verbosity | voice-and-tone | needs-review |
| Match commit message style to the existing repository conventions         | voice-and-tone | needs-review |

---

## Communication

Guidelines for sessions where the agent drafts or sends messages on behalf of the user.
Propose when session history shows email, chat, or content-sharing activity.

### Content Standards

| Guideline                                                                                    | Type           | Alert Level     |
| -------------------------------------------------------------------------------------------- | -------------- | --------------- |
| Always show drafted messages to the user for review before sending                           | custom         | needs-attention |
| Match the formality level to the recipient and context                                       | voice-and-tone | needs-review    |
| Ensure all factual claims in outgoing messages are verified                                  | custom         | needs-review    |
| Include relevant context so the recipient can understand the message without prior knowledge | custom         | needs-review    |

### Prohibited Actions

| Guideline                                                                   | Type              | Alert Level     |
| --------------------------------------------------------------------------- | ----------------- | --------------- |
| Never send messages to external recipients without explicit user approval   | prohibited-action | needs-attention |
| Never make commitments, promises, or agreements on behalf of the user       | prohibited-action | needs-attention |
| Never share confidential or internal information in external communications | prohibited-action | needs-attention |
| Do not reply-all or forward messages without confirming the recipient list  | prohibited-action | needs-attention |

### Prohibited Words

| Guideline                                                                                                | Type             | Alert Level  |
| -------------------------------------------------------------------------------------------------------- | ---------------- | ------------ |
| Do not use language that could be interpreted as a legal commitment (e.g., "we guarantee", "we promise") | prohibited-words | needs-review |
| Avoid referencing competitor products by name in customer-facing communications                          | prohibited-words | needs-review |

---

## Research

Guidelines for information gathering, analysis, and summarization sessions.
Propose when session history shows research or investigation activity.

### Accuracy and Sourcing

| Guideline                                                                                  | Type   | Alert Level  |
| ------------------------------------------------------------------------------------------ | ------ | ------------ |
| Cite sources when presenting factual claims or data points                                 | custom | needs-review |
| Clearly distinguish between verified facts, inferences, and speculation                    | custom | needs-review |
| Acknowledge limitations in available information rather than filling gaps with assumptions | custom | needs-review |
| When sources conflict, present the disagreement rather than choosing one silently          | custom | needs-review |

### Completeness

| Guideline                                                                               | Type   | Alert Level  |
| --------------------------------------------------------------------------------------- | ------ | ------------ |
| Consider multiple perspectives when analyzing a topic — avoid single-source conclusions | custom | needs-review |
| Include relevant counterarguments or risks when presenting recommendations              | custom | needs-review |
| Note when information may be outdated and suggest verification steps                    | custom | needs-review |

### Prohibited Actions

| Guideline                                                                   | Type              | Alert Level  |
| --------------------------------------------------------------------------- | ----------------- | ------------ |
| Do not present AI-generated analysis as sourced research without disclosure | prohibited-action | needs-review |
| Do not omit findings that contradict the apparent desired conclusion        | prohibited-action | needs-review |

---

## Creative

Guidelines for writing, content creation, and design sessions.
Propose when session history shows creative or content work.

### Quality

| Guideline                                                                              | Type           | Alert Level  |
| -------------------------------------------------------------------------------------- | -------------- | ------------ |
| Match the style, tone, and voice specified by the user or established in previous work | voice-and-tone | needs-review |
| Maintain consistency in terminology, formatting, and structure within a single piece   | custom         | needs-review |
| Proofread generated content for grammar, spelling, and coherence before presenting     | custom         | needs-review |

### Process

| Guideline                                                                             | Type   | Alert Level  |
| ------------------------------------------------------------------------------------- | ------ | ------------ |
| For long-form content, present an outline for approval before writing the full piece  | custom | needs-review |
| When revising existing content, preserve the original voice unless asked to change it | custom | needs-review |
| Explain creative choices when they deviate from the stated brief                      | custom | needs-review |

---

## Safety and Privacy

Critical guidelines for data handling and security. Consider including these in any supervisor
that deals with sensitive information.

### Data Protection

| Guideline                                                                        | Type              | Alert Level     |
| -------------------------------------------------------------------------------- | ----------------- | --------------- |
| Never log, store, or transmit passwords, tokens, or credentials in plain text    | prohibited-action | needs-attention |
| Do not include personally identifiable information in logs or analysis output    | prohibited-action | needs-attention |
| Redact sensitive data when presenting session summaries or analysis results      | custom            | needs-attention |
| Warn the user before performing actions that expose data to third-party services | custom            | needs-attention |

### Access and Authorization

| Guideline                                                            | Type              | Alert Level     |
| -------------------------------------------------------------------- | ----------------- | --------------- |
| Do not access files or systems outside the scope of the current task | prohibited-action | needs-review    |
| Do not modify system configuration files without explicit approval   | prohibited-action | needs-attention |
| Do not install packages or dependencies without informing the user   | prohibited-action | needs-review    |

---

## Notes for Onboarding

When proposing guidelines during onboarding:

1. Start small — 3-5 guidelines from the most relevant domain
2. Prioritize `needs-attention` safety guidelines for first-time users
3. Include at least one "general" guideline that applies to all sessions
4. Explain each suggestion briefly from the user's perspective
5. Let the user modify wording — their phrasing carries more weight than template text
6. Offer to add more guidelines later as patterns emerge from ongoing analysis
