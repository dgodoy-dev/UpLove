# 💞 UpLove — Relationship Tracker

UpLove is a TypeScript-based project that models the structure of a **relationship tracking app**.  
It helps users reflect on their relationships through check-ins, commitments, and emotional events, combining both **daily tracking** and **weekly reviews**.

---

## 📘 Overview

The system is built around the idea of **personal growth and relationship awareness**.  
Each `Person` has `Relationships`, each relationship contains emotional `Pillars`, and users perform **UpLove check-ins** to track well-being, stress, and mood over time.

Weekly check-ins also include **events** — positive or negative experiences that help evaluate relational progress — and **pillar scores** — a concrete evaluation of each pillar by week.

Commitments 

---
# Simple Class Diagram
```ts
Person ──┬─> Necessity
         └─> Relationship ──┬─> Pillar
                             ├─> UpLove (abstract)
                             │     ├─> DailyUpLove
                             │     └─> WeeklyUpLove ──> Event
                             └─> Commitment (ToDo / ToKeep)
```