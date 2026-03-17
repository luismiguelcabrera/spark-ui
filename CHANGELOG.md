# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-16

### Added

- **New components**: Drawer, Popover, Combobox, DatePicker, ThemeProvider
- **Testing**: Vitest + React Testing Library with 80+ tests across 18 test files
- **Storybook**: Interactive documentation with stories for Button, Input, Select, Checkbox, Toggle, Badge, Card, Avatar, ProgressBar, Spinner, Toast, AlertBanner, Tabs, Accordion, and Pagination
- **ESLint + Prettier**: Code linting and formatting with TypeScript and React hooks support
- **CI/CD**: GitHub Actions workflows for CI (lint, typecheck, test, build) and npm publish on release
- **Accessibility**: ARIA attributes, keyboard navigation, and screen reader improvements across all interactive components

### Fixed

- Avatar component refactored to avoid setState-in-effect and ref-during-render lint violations
- Added `role="dialog"`, `aria-modal`, and `aria-label` to Modal and Drawer
- Added `role="tablist"`, `role="tab"`, `aria-selected` to Tabs
- Added `aria-expanded` to Accordion triggers
- Added `aria-label` to icon-only buttons, close buttons, and pagination controls
- Added `type="button"` to interactive buttons to prevent accidental form submission

## [0.1.0] - 2026-03-16

### Added

- Initial release with 60+ components organized into Forms, Data Display, Feedback, Navigation, and Layout categories
- Built with React, TypeScript, Tailwind CSS, and CVA (class-variance-authority)
- Shared style presets via `s` utility
- `cn()` utility combining clsx + tailwind-merge
- `useControllable` hook for controlled/uncontrolled component patterns
- Support for React 18 and 19, optional Next.js and react-hook-form peer dependencies
