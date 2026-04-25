# Calcup Agent Instructions

## Calculator UI Contract

Before creating or restyling any calculator, read:

- `src/features/calculator-design-system.css`

That file is the single source of truth for calculator layout, controls, result panels, chips, switches, notes, tables and responsive behavior.

New calculators must use the standard class shape described there:

- `<prefix>-page`
- `<prefix>-heading`
- `<prefix>-eyebrow`
- `<prefix>-workspace`
- `<prefix>-form`
- `<prefix>-field`
- `<prefix>-input-wrap`
- `<prefix>-result`
- `<prefix>-result__row`
- `<prefix>-formula`
- `<prefix>-toggle`

Do not add local visual overrides for borders, radii, control heights, focus rings, result-panel layout, or calculator accent colors unless the shared design-system file is updated first.
