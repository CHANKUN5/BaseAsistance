---
name: rpsoft-ui
description: UI standards for RPSoft dashboard and internal apps
---

# RPSoft - UI Engineering Standards
**Version**: 1.0.0
**Context**: BaseAsistance (Control Horario MVP)
**Maintainer**: Frontend Architecture Team

> [!IMPORTANT]
> This document defines the MANDATORY standards for all UI development in RPSoft projects. Any deviation requires explicit approval from the Architecture Team.

## 1. Official Tech Stack
-   **Framework**: React (Latest Stable)
-   **Language**: TypeScript (Strict Mode)
-   **Styling**: TailwindCSS (Utility-first)
-   **Icons**: Lucide React (Preferred) or Heroicons
-   **State Management**: Context API (Small/Medium) / Zustand (Large)

## 2. Core Layout & Structure
All internal applications must follow the **Dashboard Layout** pattern.

### 2.1 Anatomy
-   **Sidebar (Fixed Left)**: Navigation, Logo, User Profile (Desktop: 64px collapsed / 240px expanded. Mobile: Hidden/Drawer).
-   **Topbar (Optional/Sticky)**: Breadcrumbs, Global Search, Notifications.
-   **Main Content Area**:
    -   `max-w-7xl` centered container.
    -   `p-4` (mobile) to `p-8` (desktop) padding.
    -   Background: `bg-slate-50` or `bg-gray-50`.

### 2.2 Folder Structure
```
src/
├── components/
│   ├── ui/           # Atomic, reusable components (Button, Input, Card)
│   ├── layout/       # Structural components (Sidebar, Topbar, MainLayout)
│   └── features/     # Business-logic coupled components (UserTable, ShiftForm)
├── hooks/            # Custom hooks (useAuth, useFetch)
├── pages/            # Page components (routes)
├── styles/           # Global styles (index.css)
└── utils/            # Helper functions (formatDate, cn)
```

## 3. Design Tokens & Theming
Use the standard Tailwind spacing and color palette. **Do not introduce custom hex codes unless absolutely necessary.**

### 3.1 Color System (Semantic)
1.  **Primary**: Brand Blue (`blue-600` / `blue-700`). Action buttons, active states.
2.  **Secondary**: Slate/Gray (`slate-200` to `slate-800`). Borders, text, backgrounds.
3.  **Success**: Emerald (`emerald-500`). Completed actions, valid states.
4.  **Danger**: Rose (`rose-500`). Delete actions, errors.
5.  **Warning**: Amber (`amber-500`). Alerts, pending states.

### 3.2 Spacing & Sizing
-   **Padding/Margin**: Use the 4px scale (`p-1` = 4px, `p-4` = 16px).
    -   Component internal padding: `p-2` or `p-3`.
    -   Container padding: `p-4` to `p-8`.
    -   Section gaps: `gap-4` or `space-y-4`.
-   **Border Radius**:
    -   Small elements (buttons, inputs): `rounded-md`.
    -   Cards/Modals: `rounded-lg` or `rounded-xl`.

### 3.3 Typography
-   **Font Family**: Inter (default sans).
-   **Headings**: `text-2xl font-bold` (H1), `text-xl font-semibold` (H2).
-   **Body**: `text-sm` (default UI text), `text-base` (content).
-   **Muted**: `text-slate-500`.

## 4. Component Standards

### 4.1 Naming Conventions
-   **Components**: PascalCase (e.g., `UserProfile.tsx`, `SubmitButton.tsx`).
-   **Functions/Hooks**: camelCase (e.g., `handleSubmit`, `useAuth`).
-   **Props**:
    -   Boolean: `isLoading`, `hasError`, `isOpen`.
    -   Handlers: `on[Event]` (e.g., `onSubmit`, `onClose`).

### 4.2 Base Components (Must Use)

#### Button (`components/ui/Button.tsx`)
```tsx
// USAGE
<Button variant="primary" size="md" isLoading={loading} onClick={save}>
  Save Changes
</Button>
```
-   **Variants**: primary (blue), secondary (outline), ghost (transparent), danger (red).
-   **Sizes**: sm, md, lg.

#### Card (`components/ui/Card.tsx`)
```tsx
// USAGE
<Card className="p-6">
  <CardHeader title="User Statistics" subtitle="Weekly Overview" />
  <CardContent>...</CardContent>
</Card>
```
-   Background: White.
-   Shadow: `shadow-sm`.
-   Border: `border border-slate-200`.

#### Table (`components/ui/Table.tsx`)
Must support:
-   Striped rows (optional).
-   Hover states (`hover:bg-slate-50`).
-   Responsive wrapper (`overflow-x-auto`).

#### Input (`components/ui/Input.tsx`)
-   Consistent focus ring: `focus:ring-2 focus:ring-blue-500`.
-   Error state: Red border + error message below.

## 5. Accessibility (A11y) & UX
-   **Semantic HTML**: Use `<header>`, `<main>`, `<section>`, `<button>` (not `<div>` for buttons).
-   **Labels**: All inputs must have a `<label>` or `aria-label`.
-   **Focus Management**: Ensure focus is visible and logical.
-   **Contrast**: Text must satisfy WCAG AA (4.5:1).
-   **Responsive**: Mobile-first approach. Test on 375px width.

## 6. Definition of Done (UI)
A task is NOT considered complete until:
-   [ ] **Responsive**: Layout breaks gracefully on Mobile (375px), Tablet (768px), and Desktop (1024px+).
-   [ ] **Clean Console**: No React warnings (keys, hooks deps) or errors.
-   [ ] **Type Safe**: No `any` types. Interfaces defined for all props.
-   [ ] **Reusable**: Components are extracted to `components/` if used >1 time.
-   [ ] **Loading States**: Skeletons or spinners shown during data fetch.
-   [ ] **Empty States**: Friendly message when lists/tables are empty.

---

## 7. Reference Examples

### Example: Dashboard Page
```tsx
const Dashboard = () => {
  return (
    <MainLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, Admin.</p>
        </div>
        <Button variant="primary">Download Report</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="1,234" trend="+12%" />
        <StatCard title="Active Shifts" value="45" trend="-2%" />
        <StatCard title="Pending Approvals" value="8" variant="warning" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ActivityTable data={activities} />
      </section>
    </MainLayout>
  );
};
```

### Example: Data Table
```tsx
<div className="rounded-lg border border-slate-200 overflow-hidden">
  <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 text-slate-700 font-medium border-b">
      <tr>
        <th className="px-6 py-3">Employee</th>
        <th className="px-6 py-3">Role</th>
        <th className="px-6 py-3">Status</th>
        <th className="px-6 py-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {users.map((user) => (
        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
          <td className="px-6 py-4 font-medium">{user.name}</td>
          <td className="px-6 py-4 text-slate-500">{user.role}</td>
          <td className="px-6 py-4">
            <Badge variant={user.isActive ? 'success' : 'secondary'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </td>
          <td className="px-6 py-4 text-right">
            <Button variant="ghost" size="sm">Edit</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Example: Form Layout
```tsx
<form onSubmit={handleSubmit} className="space-y-6 max-w-lg bg-white p-6 rounded-lg shadow-sm border border-slate-200">
  <h2 className="text-xl font-semibold text-slate-900">Edit Profile</h2>
  
  <div className="space-y-4">
    <FormGroup label="Full Name" error={errors.name}>
      <Input value={formData.name} onChange={(e) => setField('name', e.target.value)} />
    </FormGroup>

    <FormGroup label="Email Address">
      <Input type="email" value={formData.email} disabled className="bg-slate-50" />
    </FormGroup>

    <div className="grid grid-cols-2 gap-4">
      <FormGroup label="Department">
        <Select options={depts} value={formData.dept} />
      </FormGroup>
      <FormGroup label="Role">
         <Select options={roles} value={formData.role} />
      </FormGroup>
    </div>
  </div>

  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
    <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
    <Button variant="primary" type="submit" isLoading={isSubmitting}>Save Profile</Button>
  </div>
</form>
```
