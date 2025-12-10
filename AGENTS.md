# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` holds Expo Router layouts and routes; nested folders such as `src/app/(tabs)/` map directly to navigation stacks, so keep screen-specific logic inside each route.
- Shared UI lives in `src/components/`, business logic and models in `src/entities/`, and theming utilities in `src/theme/` (see `ThemeContext` for providers). Reuse these layers instead of duplicating logic inside screens.
- Static media, fonts, and icons are stored in `assets/`; reference them with Expo asset imports to keep bundler paths consistent.
- `app.json` and `expo-env.d.ts` define runtime configuration and typed env access—update both when introducing new env values.

## Build, Test, and Development Commands
- `npm run start` – launches the Expo dev server with Metro bundler for all platforms.
- `npm run android` / `npm run ios` / `npm run web` – opens the platform-specific preview from the same dev server.
- `npm run reset-project` – reruns `scripts/reset-project.js` to clear caches; use when bundler state becomes inconsistent.
- `npm run lint` – executes `expo lint` (ESLint) against the TypeScript source; run before sending a PR.

## Coding Style & Naming Conventions
- TypeScript with React Native is standard; prefer functional components and hooks.
- Indent with two spaces and use double quotes, matching the existing `src/app/_layout.tsx`.
- Name files with kebab-case for routes (e.g., `feed.tsx`) and PascalCase for shared components (`ProfileCard.tsx`); keep entity/model files noun-based (`user.ts`).
- Centralize palette choices inside `src/theme` rather than hard-coding colors.

## Testing Guidelines
- Automated tests are not yet configured; when adding them, colocate unit tests under `src/__tests__/` or alongside components as `*.test.tsx`.
- Use React Native Testing Library + Jest; snapshot or interaction tests should mock Expo modules.
- Document new test commands inside `package.json` when introducing them so other contributors can run a single `npm run test`.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit style (`type(scope): summary`), e.g., `feat(app): add onboarding flow`.
- Each PR should describe the user-facing change, reference any issue IDs, and include screenshots or screen recordings for UI updates.
- Note any schema or env changes in the PR body and update `app.json`/`README.md` accordingly so reviewers can reproduce the build.

## Environment & Configuration Tips
- Install dependencies via `npm install` (Expo SDK 54). Keep the Expo CLI version aligned to avoid mismatched native runtimes.
- Use `.env` (not committed) for secrets and surface them through `app.json` + `expo-env.d.ts` so they remain typed.
- When testing on devices, ensure the same Metro host/port configured in `app.json` is reachable; reset via `npm run reset-project` if devices fail to connect.


# Codex Agents Index

This file defines how Codex should use the subagent specifications stored in `subagents/`.

## How to use these agents

- To activate a specific agent, the user (or higher-level agent) should say things like:
  - “Act as **Backend Developer** and …”
  - “Use **@backend-developer** to implement this feature.”
- When a specific agent is requested, **first read its corresponding markdown file** from `subagents/` and then follow the instructions in that file while working on the task.
- If multiple agents are involved, a coordinating/meta agent (e.g. `@multi-agent-coordinator` or `@agent-organizer`) should:
  - Decide which agents are relevant.
  - Summarize or route context between them.
  - Avoid duplicate or conflicting work.

Each agent below has:
- A **human name** (what you say in natural language).
- An **invoke id** (what you can use as a short handle like `@backend-developer`).
- A **source file** (where its detailed behavior is defined).

---

## 01 – Core Development

Primary focus: core software engineering, product features, and application architecture.

- **API Designer** (`@api-designer`)  
  Source: `subagents/01-core-development/api-designer.md`

- **Backend Developer** (`@backend-developer`)  
  Source: `subagents/01-core-development/backend-developer.md`

- **Electron Pro** (`@electron-pro`)  
  Source: `subagents/01-core-development/electron-pro.md`

- **Frontend Developer** (`@frontend-developer`)  
  Source: `subagents/01-core-development/frontend-developer.md`

- **Full-stack Developer** (`@fullstack-developer`)  
  Source: `subagents/01-core-development/fullstack-developer.md`

- **GraphQL Architect** (`@graphql-architect`)  
  Source: `subagents/01-core-development/graphql-architect.md`

- **Microservices Architect** (`@microservices-architect`)  
  Source: `subagents/01-core-development/microservices-architect.md`

- **Mobile Developer** (`@mobile-developer`)  
  Source: `subagents/01-core-development/mobile-developer.md`

- **WebSocket Engineer** (`@websocket-engineer`)  
  Source: `subagents/01-core-development/websocket-engineer.md`

---

## 02 – Language Specialists

Primary focus: deep expertise in specific languages, frameworks, or ecosystems.

- **Angular Architect** (`@angular-architect`)  
  Source: `subagents/02-language-specialists/angular-architect.md`

- **C++ Pro** (`@cpp-pro`)  
  Source: `subagents/02-language-specialists/cpp-pro.md`

- **C# Developer** (`@csharp-developer`)  
  Source: `subagents/02-language-specialists/csharp-developer.md`

- **Django Developer** (`@django-developer`)  
  Source: `subagents/02-language-specialists/django-developer.md`

- **.NET Core Expert** (`@dotnet-core-expert`)  
  Source: `subagents/02-language-specialists/dotnet-core-expert.md`

- **Flutter Expert** (`@flutter-expert`)  
  Source: `subagents/02-language-specialists/flutter-expert.md`

- **Golang Pro** (`@golang-pro`)  
  Source: `subagents/02-language-specialists/golang-pro.md`

- **Java Architect** (`@java-architect`)  
  Source: `subagents/02-language-specialists/java-architect.md`

- **JavaScript Pro** (`@javascript-pro`)  
  Source: `subagents/02-language-specialists/javascript-pro.md`

- **Kotlin Specialist** (`@kotlin-specialist`)  
  Source: `subagents/02-language-specialists/kotlin-specialist.md`

- **Laravel Specialist** (`@laravel-specialist`)  
  Source: `subagents/02-language-specialists/laravel-specialist.md`

- **Next.js Developer** (`@nextjs-developer`)  
  Source: `subagents/02-language-specialists/nextjs-developer.md`

- **PHP Pro** (`@php-pro`)  
  Source: `subagents/02-language-specialists/php-pro.md`

- **Python Pro** (`@python-pro`)  
  Source: `subagents/02-language-specialists/python-pro.md`

- **Rails Expert** (`@rails-expert`)  
  Source: `subagents/02-language-specialists/rails-expert.md`

- **React Specialist** (`@react-specialist`)  
  Source: `subagents/02-language-specialists/react-specialist.md`

- **Rust Engineer** (`@rust-engineer`)  
  Source: `subagents/02-language-specialists/rust-engineer.md`

- **Spring Boot Engineer** (`@spring-boot-engineer`)  
  Source: `subagents/02-language-specialists/spring-boot-engineer.md`

- **SQL Pro** (`@sql-pro`)  
  Source: `subagents/02-language-specialists/sql-pro.md`

- **Swift Expert** (`@swift-expert`)  
  Source: `subagents/02-language-specialists/swift-expert.md`

- **TypeScript Pro** (`@typescript-pro`)  
  Source: `subagents/02-language-specialists/typescript-pro.md`

- **Vue Expert** (`@vue-expert`)  
  Source: `subagents/02-language-specialists/vue-expert.md`

---

## 03 – Infrastructure

Primary focus: infra, deployment, networking, security at the platform level.

- **Cloud Architect** (`@cloud-architect`)  
  Source: `subagents/03-infrastructure/cloud-architect.md`

- **Database Administrator** (`@database-administrator`)  
  Source: `subagents/03-infrastructure/database-administrator.md`

- **Deployment Engineer** (`@deployment-engineer`)  
  Source: `subagents/03-infrastructure/deployment-engineer.md`

- **DevOps Engineer** (`@devops-engineer`)  
  Source: `subagents/03-infrastructure/devops-engineer.md`

- **DevOps Incident Responder** (`@devops-incident-responder`)  
  Source: `subagents/03-infrastructure/devops-incident-responder.md`

- **Incident Responder** (`@incident-responder`)  
  Source: `subagents/03-infrastructure/incident-responder.md`

- **Kubernetes Specialist** (`@kubernetes-specialist`)  
  Source: `subagents/03-infrastructure/kubernetes-specialist.md`

- **Network Engineer** (`@network-engineer`)  
  Source: `subagents/03-infrastructure/network-engineer.md`

- **Platform Engineer** (`@platform-engineer`)  
  Source: `subagents/03-infrastructure/platform-engineer.md`

- **Security Engineer** (`@security-engineer`)  
  Source: `subagents/03-infrastructure/security-engineer.md`

- **SRE Engineer** (`@sre-engineer`)  
  Source: `subagents/03-infrastructure/sre-engineer.md`

- **Terraform Engineer** (`@terraform-engineer`)  
  Source: `subagents/03-infrastructure/terraform-engineer.md`

---

## 04 – Quality & Security

Primary focus: correctness, robustness, security, and reliability.

- **Accessibility Tester** (`@accessibility-tester`)  
  Source: `subagents/04-quality-security/accessibility-tester.md`

- **Architect Reviewer** (`@architect-reviewer`)  
  Source: `subagents/04-quality-security/architect-reviewer.md`

- **Chaos Engineer** (`@chaos-engineer`)  
  Source: `subagents/04-quality-security/chaos-engineer.md`

- **Code Reviewer** (`@code-reviewer`)  
  Source: `subagents/04-quality-security/code-reviewer.md`

- **Compliance Auditor** (`@compliance-auditor`)  
  Source: `subagents/04-quality-security/compliance-auditor.md`

- **Debugger** (`@debugger`)  
  Source: `subagents/04-quality-security/debugger.md`

- **Error Detective** (`@error-detective`)  
  Source: `subagents/04-quality-security/error-detective.md`

- **Penetration Tester** (`@penetration-tester`)  
  Source: `subagents/04-quality-security/penetration-tester.md`

- **Performance Engineer** (`@performance-engineer`)  
  Source: `subagents/04-quality-security/performance-engineer.md`

- **QA Expert** (`@qa-expert`)  
  Source: `subagents/04-quality-security/qa-expert.md`

- **Security Auditor** (`@security-auditor`)  
  Source: `subagents/04-quality-security/security-auditor.md`

- **Test Automator** (`@test-automator`)  
  Source: `subagents/04-quality-security/test-automator.md`

---

## 05 – Data & AI

Primary focus: data pipelines, analytics, ML/AI, and LLM systems.

- **AI Engineer** (`@ai-engineer`)  
  Source: `subagents/05-data-ai/ai-engineer.md`

- **Data Analyst** (`@data-analyst`)  
  Source: `subagents/05-data-ai/data-analyst.md`

- **Data Engineer** (`@data-engineer`)  
  Source: `subagents/05-data-ai/data-engineer.md`

- **Data Scientist** (`@data-scientist`)  
  Source: `subagents/05-data-ai/data-scientist.md`

- **Database Optimizer** (`@database-optimizer`)  
  Source: `subagents/05-data-ai/database-optimizer.md`

- **LLM Architect** (`@llm-architect`)  
  Source: `subagents/05-data-ai/llm-architect.md`

- **Machine Learning Engineer** (`@machine-learning-engineer`)  
  Source: `subagents/05-data-ai/machine-learning-engineer.md`

- **ML Engineer** (`@ml-engineer`)  
  Source: `subagents/05-data-ai/ml-engineer.md`

- **MLOps Engineer** (`@mlops-engineer`)  
  Source: `subagents/05-data-ai/mlops-engineer.md`

- **NLP Engineer** (`@nlp-engineer`)  
  Source: `subagents/05-data-ai/nlp-engineer.md`

- **Postgres Pro** (`@postgres-pro`)  
  Source: `subagents/05-data-ai/postgres-pro.md`

- **Prompt Engineer** (`@prompt-engineer`)  
  Source: `subagents/05-data-ai/prompt-engineer.md`

---

## 06 – Developer Experience

Primary focus: tooling, DX, documentation, and workflows for developers.

- **Build Engineer** (`@build-engineer`)  
  Source: `subagents/06-developer-experience/build-engineer.md`

- **CLI Developer** (`@cli-developer`)  
  Source: `subagents/06-developer-experience/cli-developer.md`

- **Dependency Manager** (`@dependency-manager`)  
  Source: `subagents/06-developer-experience/dependency-manager.md`

- **Documentation Engineer** (`@documentation-engineer`)  
  Source: `subagents/06-developer-experience/documentation-engineer.md`

- **DX Optimizer** (`@dx-optimizer`)  
  Source: `subagents/06-developer-experience/dx-optimizer.md`

- **Git Workflow Manager** (`@git-workflow-manager`)  
  Source: `subagents/06-developer-experience/git-workflow-manager.md`

- **Legacy Modernizer** (`@legacy-modernizer`)  
  Source: `subagents/06-developer-experience/legacy-modernizer.md`

- **MCP Developer** (`@mcp-developer`)  
  Source: `subagents/06-developer-experience/mcp-developer.md`

- **Refactoring Specialist** (`@refactoring-specialist`)  
  Source: `subagents/06-developer-experience/refactoring-specialist.md`

- **Tooling Engineer** (`@tooling-engineer`)  
  Source: `subagents/06-developer-experience/tooling-engineer.md`

---

## 07 – Specialized Domains

Primary focus: domain-specific engineering and integration.

- **API Documenter** (`@api-documenter`)  
  Source: `subagents/07-specialized-domains/api-documenter.md`

- **Blockchain Developer** (`@blockchain-developer`)  
  Source: `subagents/07-specialized-domains/blockchain-developer.md`

- **Embedded Systems Engineer** (`@embedded-systems`)  
  Source: `subagents/07-specialized-domains/embedded-systems.md`

- **Fintech Engineer** (`@fintech-engineer`)  
  Source: `subagents/07-specialized-domains/fintech-engineer.md`

- **Game Developer** (`@game-developer`)  
  Source: `subagents/07-specialized-domains/game-developer.md`

- **IoT Engineer** (`@iot-engineer`)  
  Source: `subagents/07-specialized-domains/iot-engineer.md`

- **Mobile App Developer** (`@mobile-app-developer`)  
  Source: `subagents/07-specialized-domains/mobile-app-developer.md`

- **Payment Integration Specialist** (`@payment-integration`)  
  Source: `subagents/07-specialized-domains/payment-integration.md`

- **Quant Analyst** (`@quant-analyst`)  
  Source: `subagents/07-specialized-domains/quant-analyst.md`

- **Risk Manager** (`@risk-manager`)  
  Source: `subagents/07-specialized-domains/risk-manager.md`

---

## 08 – Business & Product

Primary focus: product, business logic, strategy, and customer experience.

- **Business Analyst** (`@business-analyst`)  
  Source: `subagents/08-business-product/business-analyst.md`

- **Content Marketer** (`@content-marketer`)  
  Source: `subagents/08-business-product/content-marketer.md`

- **Customer Success Manager** (`@customer-success-manager`)  
  Source: `subagents/08-business-product/customer-success-manager.md`

- **Legal Advisor** (`@legal-advisor`)  
  Source: `subagents/08-business-product/legal-advisor.md`

- **Product Manager** (`@product-manager`)  
  Source: `subagents/08-business-product/product-manager.md`

- **Project Manager** (`@project-manager`)  
  Source: `subagents/08-business-product/project-manager.md`

- **Sales Engineer** (`@sales-engineer`)  
  Source: `subagents/08-business-product/sales-engineer.md`

- **Scrum Master** (`@scrum-master`)  
  Source: `subagents/08-business-product/scrum-master.md`

- **Technical Writer** (`@technical-writer`)  
  Source: `subagents/08-business-product/technical-writer.md`

- **UX Researcher** (`@ux-researcher`)  
  Source: `subagents/08-business-product/ux-researcher.md`

---

## 09 – Meta & Orchestration

Primary focus: coordination, workflow design, and multi-agent reasoning.

- **Agent Organizer** (`@agent-organizer`)  
  Source: `subagents/09-meta-orchestration/agent-organizer.md`

- **Context Manager** (`@context-manager`)  
  Source: `subagents/09-meta-orchestration/context-manager.md`

- **Error Coordinator** (`@error-coordinator`)  
  Source: `subagents/09-meta-orchestration/error-coordinator.md`

- **Knowledge Synthesizer** (`@knowledge-synthesizer`)  
  Source: `subagents/09-meta-orchestration/knowledge-synthesizer.md`

- **Multi-agent Coordinator** (`@multi-agent-coordinator`)  
  Source: `subagents/09-meta-orchestration/multi-agent-coordinator.md`

- **Performance Monitor** (`@performance-monitor`)  
  Source: `subagents/09-meta-orchestration/performance-monitor.md`

- **Task Distributor** (`@task-distributor`)  
  Source: `subagents/09-meta-orchestration/task-distributor.md`

- **Workflow Orchestrator** (`@workflow-orchestrator`)  
  Source: `subagents/09-meta-orchestration/workflow-orchestrator.md`

---

## 10 – Research & Analysis

Primary focus: research, competitive analysis, and market/technical insights.

- **Competitive Analyst** (`@competitive-analyst`)  
  Source: `subagents/10-research-analysis/competitive-analyst.md`

- **Data Researcher** (`@data-researcher`)  
  Source: `subagents/10-research-analysis/data-researcher.md`

- **Market Researcher** (`@market-researcher`)  
  Source: `subagents/10-research-analysis/market-researcher.md`

- **Research Analyst** (`@research-analyst`)  
  Source: `subagents/10-research-analysis/research-analyst.md`

- **Search Specialist** (`@search-specialist`)  
  Source: `subagents/10-research-analysis/search-specialist.md`

- **Trend Analyst** (`@trend-analyst`)  
  Source: `subagents/10-research-analysis/trend-analyst.md`

---

## Coordination Guidelines

- When a user explicitly mentions an agent (e.g. “Act as **Backend Developer**” or “Use **@python-pro**”), **load and follow that agent’s markdown spec**.
- When the requested task clearly belongs to a specific agent (even if not explicitly named), choose the most appropriate agent and state your choice:
  - _“For this task I will act as **@graphql-architect** and follow its specification.”_
- For complex tasks:
  1. Use a meta agent like `@multi-agent-coordinator` or `@agent-organizer`.
  2. Decide which specialized agents are needed.
  3. Route subtasks and integrate their outputs into a coherent final result.

This index should always stay in sync with the files under `subagents/`. If new agents are added, they should be listed here with a clear name, invoke id, and source path.
