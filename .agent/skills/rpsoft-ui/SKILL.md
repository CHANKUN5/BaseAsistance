# RPSoft UI Design System

## Name: rpsoft-ui
## Description: Design standards for RPSoft applications focusing on minimalism, premium aesthetics, and consistency.

### 1. Design Philosophy
- **Minimalism**: Less is more. Use whitespace effectively to guide the user's eye.
- **Premium Feel**: Use subtle shadows, rounded corners (12px - 16px), and high-quality typography (Inter/Outfit).
- **Vibrant & Clean**: Primary color is a vibrant Lime/Green (#C5FF00) against dark or high-contrast backgrounds.

### 2. Design Tokens
- **Colors**:
  - Primary: `#C5FF00` (Lime)
  - Background: `#FFFFFF` (Light Mode) / `#0F172A` (Dark Mode)
  - Surface: Card backgrounds with thin borders (#E5E7EB) or subtle shadows.
  - Text: `#111827` (Primary), `#6B7280` (Secondary).
- **Border Radius**:
  - Cards: `16px`
  - Buttons: `12px`
  - Badges: `20px` (Pill style)

### 3. Component Guidelines
- **Cards**: Use white background with `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`.
- **Buttons**:
  - Primary: Bold background, high contrast text.
  - Action buttons: Flexbox centered, `10px` gap between icon and text.
- **Status Badges**:
  - Active: Success colors (Emerald).
  - Paused: Warning colors (Amber).
  - Completed: Info/Neutral colors (Blue/Slate).

### 4. Layout Standards
- **Dashboard**: 3-card KPI row at the top, main content split into Chart and Control sections.
- **Historial**: Tabular data with clear date headers and digital time formats.
- **Responsiveness**: Mobile-first approach. Stack columns on screens < 768px.

### 5. Time Formatting (Strict)
- **Lists/Tables**: Always use digital `HH:MM:SS` format.
- **KPIs/Summary**: Use human-readable `Hh Mm` format for quick scanning.

### 6. Definition of Done (DoD) UI
- No console errors.
- Responsive design verified.
- Interactive elements have hover/active states.
- Icons from Lucide-React used consistently.
