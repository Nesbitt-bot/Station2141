---
title: "CSE 132 — Lecture 4"
image: "cover.png"
date: 2023-02-18T04:50:50Z
categories: ["CSE 132"]
draft: false
aliases:
  - /lecture-4/
---

## Delta Timing

Timing lag in Arduino

```
int delta = 100;
int nextTime = 0;

void loop(){
  // stop using delay(1000);
  int time = millis();
  if (time > nextTime){
    Serial.print(“Total time since begin = ”)
    Serial.println(time);
    nextTime += delta;
  }

  Serial.println(“do work”);
}
```

## Rolling Average Filter

### Analog components

There is noise. (comes from interactions and cosmic particles..)

## Filters

Create reading based on the average.

## Digit representation

Information representation Fractions… Radix point

### Fixed point representation

After radix point, we use 2^{-1} for representing binary values. Q notation Q\_{n.m} total bit = n+m+1(the sign bit)

### Floating Point

The point is really “floating”, letting them go to wherever they want to go. Higher range and accuracy. By Scientific notation x = mantissa y = exponent

##### Single Precision (32 bit)

bit 31: sign bit bit 30-23: exponent bit 22-0: fraction

##### Double Precision (64 bit)

Higher precision (2x10^127), comparing to single precision (2x10^38)

### Normalization

+-INF and NaN shift till the first digit of mantissa is 1.
