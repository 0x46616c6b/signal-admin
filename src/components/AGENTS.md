# Components

## Layout

- `app-shell.tsx` — Main layout wrapper. Every page under `(app)/` should render `<AppShell title="Page Title">` as its root.
- `sidebar.tsx` — Navigation sidebar. To add a new page, add an entry to the `navItems` array.
- `header.tsx` — Top bar with account selector dropdown (shown only when >1 account).

## Page Component Pattern

Each feature area (contacts, groups, devices, etc.) follows the same pattern:
- **Page** (`src/app/(app)/<feature>/page.tsx`) — orchestrates data fetching, actions, and state
- **List component** (`src/components/<feature>/<feature>-list.tsx`) — renders the data table/list, receives data and callbacks as props
- **Form component** (`src/components/<feature>/<feature>-form.tsx`) — create/edit form, receives `onSave`/`onCancel` callbacks

## Styling

- Use `cn()` from `@/lib/utils` for conditional classnames
- Neutral gray palette, blue-600 as primary accent
- Consistent sizing: `text-sm` for body, `text-xs` for labels/metadata, `text-lg` for headings
- Buttons: `bg-blue-600 text-white hover:bg-blue-700` (primary), `border border-gray-300 hover:bg-gray-50` (secondary)
- Cards: `rounded-lg border border-gray-200 bg-white p-4 shadow-sm`
