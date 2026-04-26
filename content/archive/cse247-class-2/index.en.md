---
title: "CSE 247 — Class 2"
image: "cover.png"
date: 2023-02-18T03:57:57Z
lastmod: 2023-02-18T04:40:42Z
categories: ["CSE 247"]
draft: false
aliases:
  - /class-2/
---

Studio in groups, labs in individuals.

### Tool tip: Java debugger in Eclipse

- Setting break points,
- Running program: observer stop points.
- Step into will go into method call, step over will execute the next line of code only.
- Debug/ Java options change view of workplace in Eclipse.

### Review in Studio 0

- Ticks are a useful way to measure complexity -- count of # of times we reach a specific place in the code.
- Growing a array by doubling takes time linear in # of elements added.
- Naive approach took quadratic time~
- we can reason about the number of ticks of a program analytically, without actually running it.

Counting the number of ticks exactly.

## Asymptotic complexity

Constant time: basic operation ( \*, /, &, |, +, -, ^) Big - O notation Big - Omega notation Big - Theta notation  

### for one for loop

```java
for(int i=0;i<n;i++) {
			this.value+=i;
			ticker.tick();
		}
```

### for two loop

```java
for(int i=0;i<n;i++) {
	for (int j=i;j<n;j++) {
			this.value+=i;
			ticker.tick();
	}
}
```

inner loop

outer loop

### Pseudo code example

```pseudocode
for j in i ... n
	tick()
	for k in 0 ... j
		tick ()
		tick ()
		tick ()
```

inner loop

outer loop

How do we Actually use Running Times?

- Predict exact time to complete a task.
- Compare running time in different order of growth rate.

Desirable Properties of Running Time Estimates

- only care for long time growth rather than small sample size.

### Definition of Big-O Notation (upper bound of algorithm)

- Let f(n), g(n) be non-negative functions for n>0. (eg. running time)
- We say that f(n) = O(g(n)), if there exist constants c>0, n0>0, such that for all n>= n0, f(n)<=c\*g(n).
- When specifying running times, never write a constant inside O(), it is unnecessary.

Steps of validation:

1.  Pick c >0, n0 >0.
2.  Write down desired inequality f(n) <= c g(n).
3.  Prove that for all n>=n0, the equation holds.

eg. prove that

c=33 (coefficient of 3\*11), n0=1 for n>=1, difference

**When the equation be come complex, try to take derivative of the equation.** Example: Does 1000 n log n = O (n^2)? set c =1000, n0=1, when n=1 1000 n^2 -1000 n log n =1000 > 0 moreover, this difference only grows with increasing n >1

which is > 0 for n =1. Furthermore,

which is >0 for n>=1. Hence, the derivative remains positive, and so the difference increases for n>=1 as claimed.

### Extensions of Big-O

#### Definition of Big-Omega Notation (lower bound of algorithm)

- Let f(n), g(n) be non-negative functions for n>0. (eg. running time)
- We say that f(n) = Omega(g(n)), if there exist constants c>0, n0>0, such that for all n>= n0, f(n)>=c\*g(n).
- This is basically, lower bound of algorithm f(n)

#### Definition of Big-Theta Notation (medium of algorithm)

- Let f(n), g(n) be non-negative functions for n>0. (eg. running time)
- We say that f(n) = Theta(g(n)), if there exist constants c1,c2>0, n0>0, such that for all n>= n0, c2\*g(n) >=f(n)>=c1\*g(n).
