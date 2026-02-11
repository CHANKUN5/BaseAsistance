# BaseAsistance Architectural Guidelines

This document defines the standards for all future development on the BaseAsistance codebase. The objective is to maintain a high "Vibe" (visual excellence) while ensuring structural "Solidity".

## 1. Separation of Concerns (SoC)

### 1.1 UI is "Dumb"
Components should focus solely on presentation and user interaction. They should not contain complex data fetching, date parsing, or business logic.
- **Rule**: If a component has more than 20 lines of non-visual logic, extract it to a hook or utility.

### 1.2 Logic is "Blind"
Business logic and data fetching belong in **Hooks** and **Services**.
- **Services**: Pure data fetching (e.g., Supabase calls).
- **Hooks**: Manage state, complex calculations, and coordinate services.
- **Utils**: Pure functions for formatting (dates, currencies, strings).

## 2. Resilient UI (Atomic Design)

Every component must handle four states to avoid crashes (especially the "user null" scenario):
1. **Loading**: Show a `Loading` placeholder or skeleton.
2. **Error**: Provide a clear error message and a retry option if possible.
3. **Empty**: Show a friendly "No data" message.
4. **Data Overflow**: Handle long text/large arrays without breaking the layout.

### 2.1 The "Early Return" Pattern
To fix the "possibly null" issue for the `user` object:
```javascript
export default function MyComponent() {
    const { user, loading } = useAuth();
    
    // 1. Handle loading state first
    if (loading) return <Loading />;
    
    // 2. Guard against missing user
    if (!user) return <NotAuthenticatedView />;
    
    // 3. Render the "Happy Path" knowing user is defined
    return <MainContent userId={user.id} />;
}
```

## 3. Design Tokens (The Vibe)

- **No Magic Numbers**: Use CSS variables for all spacing, colors, and radii.
- **Consistent Icons**: Use `Lucide React` for all icons.
- **Interactive States**: Every button and link must have a hover/active transition.

## 4. Maintenance (Chesterton's Fence)

Do not refactor existing code unless you can state exactly why it exists and what dependencies it serves. When refactoring, maintain the visual state ("The Vibe") exactly as it was unless a change is explicitly requested.
