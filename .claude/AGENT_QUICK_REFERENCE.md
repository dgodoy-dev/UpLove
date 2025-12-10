# Claude Code Agents - Quick Reference

This project has 13 specialized agents configured to help with different aspects of React Native/Expo development.

## How to Use Agents

You can invoke agents in several ways:
1. **Direct invocation**: "Use @mobile-developer to optimize the app performance"
2. **Natural language**: "Act as the React Specialist and review my component"
3. **Let Claude decide**: Just describe your task, and Claude will automatically use the appropriate agent

## Active Agents for UpLove

### 🎯 Core Development (When building features)

#### **mobile-developer**
- **Use for**: React Native/Expo implementation, platform-specific code, native modules
- **Example**: "@mobile-developer help me implement push notifications"
- **Strengths**: Cross-platform optimization, performance, battery efficiency, native integration

#### **react-specialist**
- **Use for**: React patterns, hooks, state management, component architecture
- **Example**: "@react-specialist review my state management approach"
- **Strengths**: React 18+ features, performance optimization, advanced patterns

#### **typescript-pro**
- **Use for**: Type safety, TypeScript configuration, generic types, type architecture
- **Example**: "@typescript-pro help me create type-safe API client"
- **Strengths**: Advanced types, full-stack type safety, build optimization

### ✅ Quality & Testing (Before committing code)

#### **code-reviewer**
- **Use for**: Code quality checks, best practices, architecture review
- **Example**: "@code-reviewer review my relationship entity implementation"
- **Strengths**: Comprehensive reviews, identifies anti-patterns, suggests improvements

#### **test-automator**
- **Use for**: Setting up tests, writing test cases, test infrastructure
- **Example**: "@test-automator set up Jest and React Native Testing Library"
- **Strengths**: Test strategy, automation, CI/CD integration

#### **accessibility-tester**
- **Use for**: Ensuring app is accessible to all users
- **Example**: "@accessibility-tester audit my onboarding flow"
- **Strengths**: WCAG compliance, screen reader support, mobile accessibility

#### **debugger**
- **Use for**: Troubleshooting bugs, analyzing errors, performance issues
- **Example**: "@debugger help me fix this crash on Android"
- **Strengths**: Root cause analysis, debugging strategies, error resolution

#### **react-native-ux-auditor**
- **Use for**: UX/UI review, design psychology, visual consistency
- **Example**: "@react-native-ux-auditor review my profile screen design"
- **Strengths**: Design psychology, visual hierarchy, mobile UX patterns

### 🔧 Developer Experience (Improving workflow)

#### **documentation-engineer**
- **Use for**: Writing docs, API documentation, README updates
- **Example**: "@documentation-engineer document our entity models"
- **Strengths**: Clear documentation, API specs, onboarding guides

#### **git-workflow-manager**
- **Use for**: Git workflows, branching strategies, commit conventions
- **Example**: "@git-workflow-manager set up a feature branch workflow"
- **Strengths**: Git best practices, CI/CD integration, version control

#### **refactoring-specialist**
- **Use for**: Code refactoring, technical debt, architecture improvements
- **Example**: "@refactoring-specialist help clean up our component structure"
- **Strengths**: Safe refactoring, maintaining functionality, code quality

### 📱 Product & UX (Planning features)

#### **product-manager**
- **Use for**: Feature planning, requirements gathering, roadmap
- **Example**: "@product-manager help me plan the commitment tracking feature"
- **Strengths**: Product strategy, feature prioritization, user stories

#### **ux-researcher**
- **Use for**: User research, usability testing, UX strategy
- **Example**: "@ux-researcher design a user study for our relationship tracking"
- **Strengths**: User research methods, usability analysis, UX insights

## Common Workflows

### Building a New Feature
1. Start with **@product-manager** to define requirements
2. Use **@ux-researcher** for user flow and UX considerations
3. Implement with **@mobile-developer** and **@react-specialist**
4. Add types with **@typescript-pro**
5. Review with **@react-native-ux-auditor** and **@code-reviewer**
6. Test with **@test-automator**
7. Check accessibility with **@accessibility-tester**
8. Document with **@documentation-engineer**

### Fixing a Bug
1. Analyze with **@debugger**
2. Fix with appropriate dev agent (**@mobile-developer**, **@react-specialist**, etc.)
3. Review with **@code-reviewer**
4. Add tests with **@test-automator**

### Improving Code Quality
1. Refactor with **@refactoring-specialist**
2. Add types with **@typescript-pro**
3. Review with **@code-reviewer**
4. Document with **@documentation-engineer**

### UX/UI Improvements
1. Research with **@ux-researcher**
2. Audit with **@react-native-ux-auditor**
3. Implement with **@mobile-developer**
4. Test with **@accessibility-tester**

## Tips for Effective Agent Usage

1. **Be Specific**: The more context you provide, the better the agent can help
2. **Chain Agents**: Use multiple agents in sequence for complex tasks
3. **Review Output**: Agents provide recommendations - you make the final decisions
4. **Iterate**: Don't hesitate to ask follow-up questions or request alternatives
5. **Learn from Agents**: Each agent teaches best practices in their domain

## Need More Agents?

Additional agents are available in `.claude/agents/subagents/` organized by category:
- `01-core-development/` - API design, backend, frontend, GraphQL, microservices
- `02-language-specialists/` - Angular, Vue, Django, Go, Rust, Swift, etc.
- `03-infrastructure/` - DevOps, cloud, Kubernetes, security, deployment
- `04-quality-security/` - Performance, security audit, QA, penetration testing
- `05-data-ai/` - AI, ML, data engineering, LLM, NLP
- `06-developer-experience/` - Build tools, CLI, dependency management
- `07-specialized-domains/` - Blockchain, fintech, gaming, IoT
- `08-business-product/` - Business analysis, legal, sales, project management
- `09-meta-orchestration/` - Multi-agent coordination, workflow orchestration
- `10-research-analysis/` - Market research, competitive analysis

To add an agent, copy it from `subagents/` to `.claude/agents/`:
```bash
cp .claude/agents/subagents/[category]/[agent-name].md .claude/agents/
```

## Feedback

If you find certain agents particularly helpful or want to customize them for this project, you can edit the `.md` files in `.claude/agents/` to tailor their behavior to UpLove's specific needs.
