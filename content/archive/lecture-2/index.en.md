---
title: "CSE 132 — Lecture 2"
image: "cover.png"
date: 2023-02-18T04:49:22Z
categories: ["CSE 132"]
draft: false
aliases:
  - /lecture-2/
---

## Binary

1/True/High 0/False/Low Can be used to represent all information. Boolean algebra operation

### AND gate looks like =D-

1&1=1 1&0=0 0&1=0 0&0=1

### OR gate looks like =)}-

1&1=0 1&0=1 0&1=1 0&0=0

### NOT gate looks like -Do-

!0=1 !1=0 The basic is transistors..only need to detect two type of detection relatively easy

## Binary Numbers

Base 10: 132 Base 2: 10000100 128+4=132

## Negative Numbers

### Offset

0000 (-7) 1111 (8) _not very efficient in large computations_

### Sign-magnitude

The first bit 0 is positive, 1 is negative 1010 (-2) 0010 (2) _range decrease and there is -0, which does not make sense_

### 2's compliment

The first bit is used as negative eg. 1111 means **\-1**\*23+1\*22+1\*21+1\*20\=-8+4+2+1=-1 tricks in flipping the sign: !n + 1 = -n

### Hexadecimal

0-9 + a-f (use 0x as header) 0x1f = 16+15 =31 every hexadecimal can be represented by 4 bits. 1 = 0001 f = 1111 0x1f = 0001 1111 = 31

## Text representation

ASCII (English text only) (1 byte = 8 bits) Unicode (Contains all ASCII) (2 or more byte)

### C Strings

1 byte per character Null terminator to end string Hello => 0x48 0x65 0x6c 0x6c .... For 0-9, add 0x30 For A-Z, add 0x40 For a-z, add 0x60

### Java Strings

Entirely Unicode Java Strings is object, they don't have Null terminator They are immutable, they cannot be changed. (C is mutable)

## Finite state machines

FSMs

-   Finite States (conditions)
-   Machines

Pieces States - condition Transitions - move Inputs - information (optional) Outputs - behavior (optional) Uses

-   Analysis
-   Description
-   Implementation

### Arduino Input

Take one character at each time

```c
void setup(){
    Serial.begin(9600);
    Serial.println("I will read your input character on each loop.")
}

void loop(){
    char key = Serial.read();
    if (key != -1) {
        Serial.print(key);
    }
}
```

### FSMs in Arduino

Garage door controlling system example

```c
enum State {
    Open,
    Closed,
    Closing,
    Opening
};

// this is global variable
State s = Open; // state with garage door open

void setup() {
    Serial.begin(9600);
    Serial.println("Garage door system started.");
}

void loop() {
    s = nextState(s);
    switch (s) {
        case Open:
            Serial.println("Door is open, motor is off");
            break;
        case Closed:
            Serial.println("Door is closed, motor is off");
            break;
        case Opening:
            Serial.println("Door is opening, motor is opening the door");
            break;
        case Closing:
            Serial.println("Door is closing, motor is closing the door");
            break;
    }
    delay(1000);
}

State nextState(State s) {
    char input = Serial.read();
    if(input != -1) {
        switch (s) {
            case Open:
                if (input = 'b') {
                    s = Closing;
                }
                break;
            case Closed:
                if (input == 'b') {
                    s = Opening;
                }
                break;
            case Opening:
                if (input == 'o') {
                    s = Open;
                }
                break;
            case Closing:
                if (input == 'c') {
                    s = Closed;
                }
                break;
        }
        return s;
    }
}

```
