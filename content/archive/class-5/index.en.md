---
title: "CSE 247 — Class 5"
image: "cover.png"
date: 2023-02-18T04:22:08Z
lastmod: 2023-02-18T04:38:04Z
categories: ["CSE 247"]
draft: false
aliases:
  - /class-5/
---

Exam tomorrow

## Solving recurrence via master method

For recurrence:

Thus, we could convert it to general form:

if base is "dominant":

eg.

if root is "dominant":

eg.

if neither is "dominant" (balanced: top and bottom work are the same): eg.

the tree have log n levels and n work per level. thus, the overall asymptotic complexity = Theta(n log n)

### What dominates actually means

f(n) dominates g(n) if f(n) grows polynomial faster than g(n). eg. n^3 dominates n^2, n^2.000000001 dominates n^2, but n log n does not dominates n.

### Essence of master method

Let a>= 1 and b>1 be constants, let f(n) be a function, and let T(n) be defined on the nonnegative integers by the recurrence

where we interpret n/b to mean either ceiling or floor of n/b. Then T(n) has to following asymptotic bounds.

-   Case I: if f(n) = O(n^{log\_b a-c}) **(f(n) "dominates" n^{log\_b a-c})** for some constant c >0, then T(n) = Theta(f(n))
-   Case II: if f(n) = Theta(n^{log\_b a}), **(f(n), n^{log\_b a-c} have no dominate)**then T(n) = Theta(n^{log\_b a} log\_2 n)Extension for **f(n)**\=Theta(n^(critical\_value)\*(log n)^**k**)
    -   if k>-1T(n)=Theta(n^(critical\_value)\*(log n)^(k+1))
    -   if k=-1Theta(n^(critical\_value)\*log log n)
    -   if k<-1Theta(n^(critical\_value))
-   Case III: if f(n) = Omega(n^{log\_b a+c}) **(n^{log\_b a-c} "dominates" f(n))**for some constant c >0, and if a f(n/b)<= c f(n) for some constant c <1 then for all sufficiently large n, T(n) = Theta(n^{log\_b a+c})
