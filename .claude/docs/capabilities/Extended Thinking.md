Here’s a **simple, ready-to-use prompt** for Claude Code (or Cursor) to set up and explain **Extended Thinking** with best practices, examples, and when to use it 👇

---

### 🧠 Prompt: Setup & Best Practices for Claude Extended Thinking

**Goal:**
Create a short developer guide that explains how to **set up and use Extended Thinking** in Claude’s Messages API — including **features, benefits, best practices, use cases, and example workflows**.

**Sources:**

* [https://docs.claude.com/en/docs/build-with-claude/extended-thinking](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)
* [https://www.anthropic.com/news/extended-thinking](https://www.anthropic.com/news/extended-thinking)
* [https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking](https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking)

---

**Instructions for Claude Code:**
Build a markdown guide that includes:

1. **Overview (in plain language)**

   * What “extended thinking” means: Claude performs step-by-step reasoning before replying.
   * Supported models: Claude Sonnet 4.5, Opus 4.1, Haiku 4.5, etc.
   * API requirement: `"thinking": { "type": "enabled", "budget_tokens": n }`.

2. **Setup Guide**

   * How to enable thinking in **Python**, **TypeScript**, and **curl** using `messages.create`.
   * Show example with `budget_tokens: 10000`.
   * Mention streaming setup with `client.messages.stream()`.

3. **When to Use It**

   * For **complex reasoning tasks** (math, code generation, data analysis, event scheduling, RAG logic).
   * When you need Claude to **analyze, plan, and justify decisions** before answering.
   * Not needed for short Q&A or quick summaries.

4. **Benefits (table)**

   | Benefit           | Description                         | Example                      |
   | ----------------- | ----------------------------------- | ---------------------------- |
   | Better accuracy   | Claude reasons through edge cases   | Financial projections        |
   | Debug visibility  | Thinking summaries help trace logic | Code review & bug tracing    |
   | Safe tool use     | Keeps context when using tools      | Event planner agent workflow |
   | Modular reasoning | Interleaved with tool results       | Multi-step automation        |

5. **Best Practices**

   * Start with 4–8 k `budget_tokens` and adjust by task complexity.
   * Use **streaming** for long runs (> 21 k tokens).
   * Keep prompts clear; no temperature or top-k changes when thinking is on.
   * Combine with **Prompt Caching** for large or repeated sessions.
   * Use **Context Editing** or **Memory Tool** to keep continuity between turns.

6. **Real-World Examples**

   * 🧾 *EventOS*: AI event planner reasons through budget, schedule, and sponsor selection.
   * 💻 *DevOps*: Debugs deployment pipelines step-by-step.
   * 🔍 *Data Analyst*: Interprets sales data and explains reasoning chain.

7. **Visual Flow (Mermaid)**

   ```
   graph TD
     A[User prompt] --> B[Claude thinking enabled]
     B --> C[Thinking blocks generated]
     C --> D[Summarized reasoning → Text output]
     D --> E[Tool use or API continuation]
     E --> F[Final response with insight]
   ```

8. **Success Criteria:**

   * Setup examples run correctly in API.
   * Guide clearly explains when & why to use thinking.
   * Includes practical workflow + best practice summary.

---

✅ **Expected Output:**
A single markdown file titled `EXTENDED_THINKING_GUIDE.md` with code samples, one table, and one diagram.
Keep it simple, structured, and written in natural language so developers can apply it immediately.
