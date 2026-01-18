# Contributing to Castpotro

Thank you for your interest in contributing to Castpotro. This document outlines the standards and guidelines for contributing to this project. By following these guidelines, we can ensure that the codebase remains clean, consistent, and easy to maintain for everyone.

## Code of Conduct

We expect all contributors to maintain a professional and respectful atmosphere. Please focus on constructive feedback and collaboration. Harassment or disrespectful behavior will not be tolerated.

## How to Contribute

### Reporting Bugs

If you find a bug, please check the "Issues" tab on GitHub to ensure it has not already been reported. If you are creating a new issue, please include:

* **Description:** A clear and concise description of the issue.
* **Steps to Reproduce:** A step-by-step guide to reproducing the bug.
* **Expected Behavior:** What you expected to happen.
* **Environment:** Your Node.js version, browser, and operating system.

### Suggesting Enhancements

If you have an idea for a new feature or improvement:

1.  Open an issue labeled "Enhancement" or "Feature Request."
2.  Clearly describe the feature and the problem it solves.
3.  Wait for feedback from the maintainers before writing significant code to ensure it aligns with the project roadmap.

## Development Workflow

### 1. Branching Strategy

Do not push directly to the `main` branch. We use a feature-branch workflow.

* **feature/**: For new capabilities (e.g., `feature/user-profile-update`).
* **fix/**: For bug fixes (e.g., `fix/login-validation-error`).
* **docs/**: For documentation changes (e.g., `docs/update-readme`).
* **refactor/**: For code restructuring without behavior changes.

### 2. Commit Message Guidelines

We encourage the use of **Conventional Commits** to keep the history readable. Structure your commit messages as follows:

`type(scope): description`

* **feat:** A new feature.
* **fix:** A bug fix.
* **docs:** Documentation only changes.
* **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
* **refactor:** A code change that neither fixes a bug nor adds a feature.
* **chore:** Changes to the build process or auxiliary tools and libraries.

**Example:**
feat(auth): implement jwt token refresh logic
fix(ui): correct padding on mobile dashboard

### 3. Pull Requests

1.  Push your branch to your fork.
2.  Open a Pull Request (PR) against the `main` branch of the original repository.
3.  Provide a clear title and description.
4.  If the PR includes UI changes, please attach screenshots or screen recordings.
5.  Link the PR to the specific Issue it solves (e.g., "Closes #123").

## Coding Standards

### TypeScript

* **Strict Typing:** Avoid using the `any` type. Define interfaces or types for all props and data structures.
* **Interfaces:** Use `interface` for object definitions and `type` for unions or intersections.
* **Null Safety:** Utilize optional chaining (`?.`) and nullish coalescing (`??`) operators.

### Next.js (App Router)

* **Server Components:** By default, all components in the `app` directory are Server Components. Only add `'use client'` to the top of a file if you specifically need React hooks (`useState`, `useEffect`) or browser-only APIs.
* **Data Fetching:** Prefer fetching data directly in Server Components using Prisma rather than using `useEffect` on the client side, whenever possible.
* **File Structure:** Keep related components and utilities close to where they are used.

### Tailwind CSS

* **Utility First:** Use utility classes for styling. Avoid writing custom CSS in global files unless absolutely necessary for complex animations or overrides.
* **Class Order:** Try to order classes logically (e.g., layout -> spacing -> typography -> visual).
* **Responsiveness:** Use the mobile-first approach (e.g., `block md:flex`).

### Database (Prisma)

* **Schema Changes:** Do not modify the database manually. Always modify `prisma/schema.prisma`.
* **Migrations:** Generate a migration file for every schema change:
    npx prisma migrate dev --name describe_change
* **Naming:** Use `camelCase` for fields and `PascalCase` for models.

## Formatting

We expect code to be formatted consistently. If a linter configuration is present in the repository (e.g., ESLint, Prettier), please ensure your code passes all checks before committing.

# Run linting check
npm run lint

## Community

If you have questions about the codebase, feel free to start a discussion in the GitHub Discussions tab or comment on the relevant Issue.

Thank you for contributing to Castpotro!
