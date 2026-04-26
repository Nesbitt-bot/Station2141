---
title: "CSE 247 — Class 4"
image: "cover.png"
date: 2023-02-18T04:19:53Z
lastmod: 2023-02-18T04:45:10Z
categories: ["CSE 247"]
draft: false
aliases:
  - /class-4/
---

## Analyzing complexity via recurrences

Exam 1: Wed 10/5 6:30-8:30pm

- In-person

Academic Integrity

## Tool tip

Debugger for null pointer exception. don't try to access null pointers.

## Recurrences: defining and solving T(n) for recursive procedures.

4 methods:

### empirical analysis method

```pseudocode
bubbleDown(tree rooted at v)
	if (v is bigger than its smallest child c)
		swap values of nodes v and c
		bubbleDown(tree rooted at c)
```

T(n)=T(recursive part)+ non-recursive part For bubbleDown method, T(n)=T(2n/3)+k In heap, the node in child size is no worse than 2n/3 of the tree node count n. T(100)=T(66)+k = T(44)+2k =T(1)+9k =10k T(150)=11k And, using some magic we have not yet studies but will.

empirical analysis is just plotting the graph and approximate the graph to function.

### substitution method

For T(n)=T(n-1)+k Claim: T(n)=nk; Base (n=1): T(1)=k=1\*k <- claim holds. Inductive Hypothesis (IH): For n>1, assume T(m)=m\*k for m<n.

- T(n)=T(n-1)+k //Given recurrence
- T(n)=(n-1)\*k +k //Set m to n-1
- \=nk
- \=\\Theta(n)

Example: Binary Search Search for element in sorted array.

```pseudocode
BinarySearch (startIndex, endIndex, array, target)
//base case
	mid=(startIndex+endIndex)/2+startIndex
	if startIndex>endIndex
		return don't exist
	if middle element is greater than target
		BinarySearch(startIndex, mid, array, target)
	else
		BinarySearch(mid+1, endIndex, array, target)
	
```

T(n)=T(n/2)+c

#### Guess try #1

Claim: T(n)=c Base case: T(1)=c IH: T(n)= T(n/2)+c T(n)=c+c=2c 2c!=c, proof failed.

#### Guess try #2

Claim: T(n)=nc Base case: T(1)=c IH: T(n)=T(n/2)+c cn/2+c T(n)<=cn for all n. Therefore, T(n)=O(n)

#### Guess try #3

Claim: T(n)=c log\_2 n Base case: T(1)=0 but we can start base case on 2 actually. (base case can be any constant...) T(2)=c log\_2 2=c IH:T(n)=T(n/2)+c =c log\_2(n/2)+c =c(log\_2 n -log\_2 2)+c =c log\_2 n -c+c =c log\_2 n T(n)=Theta(log\_2 n) Pros and Cons of Guess and Check Pros:

- For any\* recurrence, given right guess, can prove that it is correct.
- Can use separate upper-, lower- bound proofs to prove Theta result

Cons:

- you mush guess first.

##### Common case

### recursion tree method

Accounting:

- Root contains the first problem with size of c
- Expand once to get second term
- Then repeat...
- Until you hit base case..

Depth

Problem size

Local work

0

n

c

1

n/2

c

2

n/4

c

log\_2 n

1

c

Accounting:

- Root contains the first problem with size of c
- Expand once to get second term
- Then repeat...
- Until you hit base case..

Depth

Problem size

\# Nodes per level

Local Work per Level

Local work per node

0

n

1

cn

cn

1

n/2

2

cn

cn/2

2

n/4

4

cn

cn/4

log\_2 n

1

2^log\_2 n=n

dn

d

Overall equation for works done: for

we have

Depth

Problem size

\# Nodes per level

Local Work per Level

Local work per node

0

n

1

f(n)

f(n)

1

n/b

a

f(n/b)\*a

f(n/b)

2

n/b^2

a^2

f(n/b2)\*a2

f(n/b^2)

log\_b n

1

a^log\_b n

f(1)\*a^log\_b n

f(1)

Thus, the work done for the algorithm should be
