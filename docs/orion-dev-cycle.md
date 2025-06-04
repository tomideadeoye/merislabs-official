# 🌀 Orion Dev Cycle: Self-Reinforcing Circular Workflow

> A circular, agent-agnostic system to debug, build, test, reflect, and branch across LLMs and dev tools (Cursor, Notion, Terminal, Streamlit, Web).

---

## 1. 🌟 Intent Clarification

**Define the why. Architect the purpose. Commit to what matters.**

**🧠 Fill:**

* Goal: `[What do I want to build or fix?]`
* Why it matters: `[What is the core value or vision behind this?]`
* Module or system affected: `[Which Orion subsystem?]`
* Success state: `[How will I know it's working?]`

**💬 Prompts to ask the LLM:**

```txt
- What's the architectural intent behind [fill goal]?
- What's the fastest way to go from concept to working prototype?
- What assumptions do I need to surface before building [fill]?
- How does this goal relate to my core Orion principles?
```

---

## 2. 🧠 LLM Collaboration / Planning

**Gather insights from multiple agents. Extract architecture plans.**

**🔄 Consult (choose 2–3):**

* [ ] ChatGPT (GPT-4)
* [ ] Claude 3
* [ ] Gemini
* [ ] DeepSeek / Qwen
* [ ] Cursor's local assistant

**💬 Model Prompt:**

```txt
you are an ai systems strategist. i am building [fill goal] for orion.

please return:
- key steps and modules required
- edge cases to account for
- warning signs or bugs
- naming suggestions for state and components
- one test case i might forget
```

**📎 Decision:**

* [ ] Go forward with best agent plan
* [ ] Merge suggestions from multiple models
* [ ] Cycle again if unclear or low-quality output

---

## 3. 🛠 Implementation in Cursor (or Editor)

**Build now. No delay. This is the architect's lab.**

**🧠 Clarify before code:**

* Component name: `[Fill here]`
* File path: `[src/components/orion/[fill].tsx]`
* State shape: `[What are we tracking?]`
* Target API route: `[api/orion/[fill]]`

**💬 Cursor/GPT Coding Prompt:**

```txt
build a typescript component called [fill] that:
- [explain functionality in 1–2 lines]
- uses state for [fill]
- fetches data from [fill]
- handles error and loading
```

**💬 Extra Prompts:**

```txt
- write a unit test for [fill component]
- what are 3 likely bugs in this component?
- simulate api responses and show data render
```

**💡 If building Python logic (e.g., in orion_python_backend):**

```txt
write a fastapi route to [fill goal], with json input of [fill shape].
return: [fill output].
```

---

## 4. 🧪 Debugging + Testing

**Catch breakage. Rewire logic. Log test cases.**

**🧠 Identify:**

* Symptom: `[What failed?]`
* Location: `[File path]`
* Trigger: `[What caused it?]`
* Logs: `[Copy the full error here if available]`

**💬 Prompts to diagnose:**

```txt
- what causes this react error: [fill message]?
- how can i reproduce this in a test?
- where would i add debug logging for [fill logic]?
- is this a typing issue or state sync error?
```

**📁 Save test to:** `/tests/[feature_name].test.ts`

---

## 5. 🪞 Self-Reflection (Architect's Log)

**Track what worked, what felt stuck, what's evolving in you.**

**🧠 Questions to ask:**

```txt
- what was most intuitive in this session?
- what confused me and why?
- what friction repeated from last build?
- what assumptions did i confirm or break?
```

**📁 Save to:** `/journal/[today]-dev-reflection.md`
**Tags:** `#flow`, `#blocker_[fill]`, `#pattern_[fill]`

---

## 6. 🌱 Branch to Next

**Use momentum. Ask what's unlocked. Loop again.**

**💬 Prompts to find the next branch:**

```txt
- what downstream system will need to change now?
- what's the smallest next improvement i can ship?
- what feature does this unlock?
- what test coverage is missing now?
- where could user friction still live in this flow?
```

**🧠 Update TODO or roadmap:**

* `/tasks/next.md`
* `/intents/[new_feature].md`

🔁 Loop back to → **Intent Clarification**

---

## 🔄 Summary Cycle Flow

```txt
[1] Intent
   ↓
[2] LLM Collaboration
   ↓
[3] Implement via Cursor
   ↓
[4] Debug + Test
   ↓
[5] Reflect + Log
   ↓
[6] Branch Next
   ↺ Back to 1
```

---

## 🧭 ASCII Decision Tree

```txt
        +---------------------+
        |   Intent Clarified  |
        +---------------------+
                  |
          +---------------+
          |  Multi-LLM Plan|
          +---------------+
                  |
         Good Plan? / \
                  /   \
        +--------+     +-----------+
        | Implement     | Retry or |
        | in Cursor      | Try New |
        |                |  Model  |
        +--------+     +-----------+
                  |
            +-------------+
            | Debug + Test|
            +-------------+
                  |
            +-------------+
            |  Reflect +   |
            |  Extract Log |
            +-------------+
                  |
            +-----------------+
            | Identify Next   |
            | Feature/Step    |
            +-----------------+
                  |
              ↻ LOOP BACK
```

---
