---
title: "Getting Started with Unity Engine"
image: "cover.png"
date: 2021-09-13T03:42:11Z
lastmod: 2021-09-13T04:10:32Z
categories: ["Resources"]
draft: false
aliases:
  - /unity-engine-zh/
---

## Pitfalls (collected from personal experience; updated over time)

1. To make games you need real conviction, not a passing impulse — otherwise you're wasting your time. A modest indie game generally takes 3–5 years to ship. If you haven't thought it through, don't start.

   The rough phases of a personal game project:

   - Mechanic ideation (1–2 months)
   - Game design (2–3 months)
   - Implementation (6–10 months)
   - Playtesting and bug-fixing (~2–10 months)
   - Post-launch maintenance (1–10 months)

2. Write the design doc *before* you start coding, and write it in detail.
   At minimum, write down: who the game is for, what psychological need it satisfies, the genre, the flow, the unique mechanics, and how each one is implemented.
   A good check: hand the design doc to someone with experience and ask them to describe what the game is, how to make it, and how to win. If their description matches what's in your head, you're fine.

3. Unless game development is going to be your career, don't study Unity systematically. Learn what you need when you need it, otherwise you waste a lot of time on the wrong things. Learn by doing — not by stockpiling random knowledge you'll never use.
   Example: Shaders show up in tutorials all the time, and yet rarely come up in actual gameplay code.

4. A lot of resources online have already been built. Look for an existing asset pack first, instead of always starting from scratch.
   Example: there's a "highlight on mouse-over" script on the Asset Store that's very efficient. Writing it from scratch would cost you a month or two.

5. Unless you are 100% sure you'll be the only one on the project, comment your code and keep coding standards reasonable. Adding comments next to methods is always a good habit. (Recommended: [https://google.github.io/styleguide/csharp-style.html](https://google.github.io/styleguide/csharp-style.html))
   Example: if someone has to take over the project later, or you need help debugging, messy code is going to slow them down.

6. If the project is large, study a bit of software architecture and design patterns, otherwise the references between your scripts will become a tangled mess.

7. When making a big change, always ask yourself: what's the goal here, how is this better than what I had before, and is the cost of the change worth it?

8. Hitting Ctrl+S regularly is always a good idea. Unity does crash. And push the project to GitHub for version control. Don't pay for extra GitHub bandwidth — 99.99% of the time you don't need it.

## Free online resources

Official site:

[https://unity.com/](https://unity.com/)

Self-study programming:

[https://www.w3schools.com/cs/index.php](https://www.w3schools.com/cs/index.php)

The all-purpose asset library:

[https://assetstore.unity.com/](https://assetstore.unity.com/)

The all-purpose Q&A sites:

[https://stackoverflow.com/](https://stackoverflow.com/)

[https://www.csdn.net/](https://www.csdn.net/)
