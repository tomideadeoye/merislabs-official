# 🌀 orion dev cycle: self-reinforcing circular workflow

> a circular, agent-agnostic system to debug, build, test, reflect, and branch across llms and dev tools (cursor, notion, terminal, streamlit, web).

---

## 1. 🌟 intent clarification

define the why. architect the purpose. commit to what matters.

**🧠 fill:**

* goal: `[what do i want to build or fix?]`
* why it matters: `[what is the core value or vision behind this?]`
* module or system affected: `[which orion subsystem?]`
* success state: `[how will i know it's working?]`

**💬 prompts to ask the llm:**

```txt
- what's the architectural intent behind [fill goal]?
- what's the fastest way to go from concept to working prototype?
- what assumptions do i need to surface before building [fill]?
- how does this goal relate to my core orion principles?
```

---

## 2. 🧠 llm collaboration / planning

gather insights from multiple agents. extract architecture plans.

**🔄 consult (choose 2–3):**

* [ ] chatgpt (gpt-4)
* [ ] claude 3
* [ ] gemini
* [ ] deepseek / qwen
* [ ] cursor's local assistant

**💬 model prompt:**

```txt
you are an ai systems strategist. i am building [fill goal] for orion.

please return:
- key steps and modules required
- edge cases to account for
- warning signs or bugs
- naming suggestions for state and components
- one test case i might forget
```

**📎 decision:**

* [ ] go forward with best agent plan
* [ ] merge suggestions from multiple models
* [ ] cycle again if unclear or low-quality output

---

## 3. 🛠 implementation in cursor (or editor)

build now. no delay. this is the architect's lab.

**🧠 clarify before code:**

* component name: `[fill here]`
* file path: `[src/components/orion/[fill].tsx]`
* state shape: `[what are we tracking?]`
* target api route: `[api/orion/[fill]]`

**💬 cursor/gpt coding prompt:**

```txt
build a typescript component called [fill] that:
- [explain functionality in 1–2 lines]
- uses state for [fill]
- fetches data from [fill]
- handles error and loading
```

**💬 extra prompts:**

```txt
- write a unit test for [fill component]
- what are 3 likely bugs in this component?
- simulate api responses and show data render
```

**💡 if building python logic (e.g. in orion_python_backend):**

```txt
write a fastapi route to [fill goal], with json input of [fill shape].
return: [fill output].
```

---

## 4. 🧪 debugging + testing

catch breakage. rewire logic. log test cases.

**🧠 identify:**

* symptom: `[what failed?]`
* location: `[file path]`
* trigger: `[what caused it?]`
* logs: `[copy the full error here if available]`

**💬 prompts to diagnose:**

```txt
- what causes this react error: [fill message]?
- how can i reproduce this in a test?
- where would i add debug logging for [fill logic]?
- is this a typing issue or state sync error?
```

**📁 save test to:** `/tests/[feature_name].test.ts`

---

## 5. 🪞 self-reflection (architect's log)

track what worked, what felt stuck, what's evolving in you.

**🧠 questions to ask:**

```txt
- what was most intuitive in this session?
- what confused me and why?
- what friction repeated from last build?
- what assumptions did i confirm or break?
```

**📁 save to:** `/journal/[today]-dev-reflection.md`
**tags:** `#flow`, `#blocker_[fill]`, `#pattern_[fill]`

---

## 6. 🌱 branch to next

use momentum. ask what's unlocked. loop again.

**💬 prompts to find the next branch:**

```txt
- what downstream system will need to change now?
- what's the smallest next improvement i can ship?
- what feature does this unlock?
- what test coverage is missing now?
- where could user friction still live in this flow?
```

**🧠 update todo or roadmap:**

* `/tasks/next.md`
* `/intents/[new_feature].md`

🔁 loop back to → intent clarification

---

## 🔄 summary cycle flow

```txt
[1] intent
   ↓
[2] llm collaboration
   ↓
[3] implement via cursor
   ↓
[4] debug + test
   ↓
[5] reflect + log
   ↓
[6] branch next
   ↺ back to 1
```

---

## 🧭 ascii decision tree

```txt
        +---------------------+
        |   intent clarified  |
        +---------------------+
                  |
          +---------------+
          |  multi-llm plan|
          +---------------+
                  |
         good plan? / \
                  /   \
        +--------+     +-----------+
        | implement     | retry or |
        | in cursor      | try new |
        |                |  model  |
        +--------+     +-----------+
                  |
            +-------------+
            | debug + test|
            +-------------+
                  |
            +-------------+
            |  reflect +   |
            |  extract log |
            +-------------+
                  |
            +-----------------+
            | identify next   |
            | feature/step    |
            +-----------------+
                  |
              ↻ LOOP BACK
```

---
