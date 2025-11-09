# 💞 UpLove — Relationship Tracker

UpLove is a TypeScript-based project that models the structure of a **relationship tracking app**.  
It helps users reflect on their relationships through check-ins, commitments, and emotional events, combining both **daily tracking** and **weekly reviews**.

---

## 📘 Overview

The system is built around the idea of **personal growth and relationship awareness**.  
Each `Person` has `Relationships`, each relationship contains emotional `Pillars`, and users perform **UpLove check-ins** to track well-being, stress, and mood over time.

Weekly check-ins also include **events** — positive or negative experiences that help evaluate relational progress.

---

## 🧩 Core Concepts

### 🧠 Person
Represents the main user or individual being tracked.  
Each person has multiple **necessities** (needs) and one or more **relationships**.

### 💞 Relationship
Encapsulates one relationship, containing its **pillars**, **check-ins (UpLove)**, and related **events**.

### 🏗 Pillar
Defines the essential components of a healthy relationship (e.g., communication, trust, fun).  
Each pillar has:
- `priority` — how important it is.
- `satisfaction` — how well it’s going.

### 🕊 Necessity
Represents a personal need or area of focus for the user.

### 🪷 UpLove
An **abstract base class** for check-ins.  
There are two main types:
- `DailyUpLove` — short, lightweight check-ins for quick reflection.  
- `WeeklyUpLove` — deeper reflections that include `Event` records.

Each UpLove tracks:
- `stress` and `mood` (`Score` values from 1–5).  
- `date` — when the check-in occurred.

### 📅 Event
Represents a specific **positive or negative experience** within a relationship, used in weekly reviews.  
Each event has a `sentiment` (`EventSentiment`), `description`, and `date`.

### 🧭 Commitment / ToDo / ToKeep
Tracks actions to take or maintain:
- `ToDo` — things to work on or improve.  
- `ToKeep` — things to continue doing well.  
Each `Commitment` has a `name`, `description`, `isDone` status, and an `id`.

---

## 🧱 Data Types

The following types are referenced in the model (you’ll define them separately):

```ts
type Priority = ...;        // e.g., 1 | 2 | 3 | 4 | 5
type Score = ...;           // e.g., 1 | 2 | 3 | 4 | 5
type EventSentiment = ...;  // e.g., 'positive' | 'negative'

---
# Simple Class Diagram
Person ──┬─> Necessity
         └─> Relationship ──┬─> Pillar
                             ├─> UpLove (abstract)
                             │     ├─> DailyUpLove
                             │     └─> WeeklyUpLove ──> Event
                             └─> Commitment (ToDo / ToKeep)
