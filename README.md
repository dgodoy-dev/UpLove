# 💞 UpLove — Relationship Tracker

UpLove is a **React Native mobile app** built with **Expo** that helps users track and improve their relationships through structured check-ins, commitments, and emotional pillars.

---

## 📱 Overview

UpLove empowers users to build stronger relationships through:
- **Pillars**: Core aspects of relationships (trust, communication, quality time, etc.) with priority levels and satisfaction scores
- **UpLove Check-ins**: Regular reflections on what's working (to praise) and what needs improvement
- **Commitments**: Actionable todos and values to keep
- **People & Necessities**: Track important people and their needs
- **Stats & Analytics**: Visualize relationship health over time

---

## 🏗️ Tech Stack

- **Framework**: React Native with Expo SDK ~54
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Database**: SQLite with expo-sqlite
- **State Management**: React Query (@tanstack/react-query)
- **Styling**: Custom theme system with light/dark mode
- **UI Components**: Custom component library with pastel design
- **Testing**: Jest with React Native Testing Library

---

## 📂 Project Structure

```
src/
├── app/                        # File-based routing (Expo Router)
│   ├── (tabs)/                # Main tab navigation
│   │   ├── index.tsx          # Home screen
│   │   ├── stats.tsx          # Statistics view
│   │   ├── dev-tools.tsx      # Development utilities
│   │   └── (register)/        # Onboarding flow
│   └── _layout.tsx            # Root layout
│
├── components/                # Reusable UI components
│   ├── entity/                # Domain-specific components
│   │   ├── PersonCard.tsx
│   │   ├── PillarCard.tsx
│   │   ├── UpLoveCard.tsx
│   │   └── CommitmentCard.tsx
│   ├── AppText.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   └── StatsPentagon.tsx
│
├── entities/                  # Domain models (TypeScript classes)
│   ├── Person/
│   │   ├── Person.tsx
│   │   └── Necessity.tsx
│   ├── Relationship/
│   │   ├── Relatioship.tsx
│   │   └── Pillar.tsx
│   ├── UpLove/
│   │   └── UpLove.tsx
│   ├── Commitment/
│   │   ├── Commitment.tsx (abstract)
│   │   ├── ToDo.tsx
│   │   └── ToKeep.tsx
│   └── types/
│       └── Priority.tsx
│
├── services/                  # Business logic & data access
│   └── database/
│       ├── DatabaseService.ts
│       ├── DatabaseContext.tsx
│       ├── schema.ts
│       └── IDatabase.ts
│
├── hooks/                     # Custom React hooks
│   └── database/
│       ├── usePeople.ts
│       ├── usePillars.ts
│       ├── useRelationship.ts
│       └── useUpLove.ts
│
├── theme/                     # Design system
│   ├── theme.ts              # Color palettes (light/dark)
│   ├── spacing.ts
│   └── ThemeContext.tsx
│
└── utils/                     # Helper functions
    ├── seedDatabase.ts
    └── clearDatabase.ts
```

---

## 🗄️ Database Schema

```sql
-- Core entities
relationship_metadata (id, name, created_at)
persons (id, name, created_at)
necessities (id, person_id, name, description, created_at)
pillars (id, name, priority, satisfaction, created_at)
commitments (id, type, description, is_done, created_at)

-- UpLove check-ins
up_loves (id, date, created_at)
up_love_items (id, up_love_id, item_type, content)
up_love_pillars (up_love_id, pillar_id)  -- junction table
```

---

## 🎨 Domain Model

```
Person ──┬─> Necessity
         └─> Relationship ──┬─> Pillar (priority, satisfaction)
                            ├─> UpLove (date, pillars, toImprove, toPraise)
                            └─> Commitment (abstract)
                                  ├─> ToDo
                                  └─> ToKeep
```

**Key Entities:**

- **Person**: Represents an individual with their personal necessities
- **Necessity**: Important needs or values for a person
- **Relationship**: Container for a relationship with its pillars and check-ins
- **Pillar**: A core aspect of the relationship (e.g., Trust, Communication)
  - `priority`: very low | low | medium | high | very high
  - `satisfaction`: 1-10 score
- **UpLove**: A check-in reflection with:
  - `pillars`: Which pillars were addressed
  - `toImprove`: Areas needing work
  - `toPraise`: Positive highlights
- **Commitment**: Actions and values
  - `ToDo`: Actionable tasks
  - `ToKeep`: Values to maintain

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Expo Go app (for testing on device)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Development Commands

```bash
# Testing
npm test                    # Run tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# Database
npm run db:seed            # Seed database with sample data

# Code quality
npm run lint               # Run ESLint

# Security
npm run security:audit     # Check for vulnerabilities
npm run security:full      # Full security scan
```

---

## 🎨 Design System

UpLove features a beautiful **pastel theme** with full dark mode support:

**Light Theme:**
- Primary: Warm pastel pink (#F6C5D8)
- Secondary: Soft lavender (#C9C7F4)
- Background: Soft pinkish white (#FDFBFF)

**Dark Theme:**
- Primary: Deep pastel pink (#E6AFC8)
- Secondary: Saturated lavender (#B6B3F0)
- Background: Dark bluish gray (#1B1A22)

---

## 🧪 Testing

The project uses Jest for unit and integration testing:

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

Test files are located alongside source files with `.test.ts` or `.test.tsx` extensions.

---

## 🔒 Security

Security checks are built into the project:

- NPM audit for dependency vulnerabilities
- Malware detection scripts
- Pre-install script validation
- Security scanning tools

Run `npm run security:full` for a comprehensive security audit.

---

## 📄 License

Private project - All rights reserved

---

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the repository owner.
