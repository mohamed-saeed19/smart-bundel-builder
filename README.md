# Smart Bundle Builder

## How to Run

Install dependencies:

```bash
npm install
```

Start the mock REST API in one terminal:

```bash
npm run api
```

Start the Vite app in another terminal:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

The app expects the mock API at `http://localhost:3001`. If the API is not running, the parts catalog falls back to local `db.json`, but draft save/load requires the API.

## Data Model

Parts are modeled as a discriminated union keyed by `category`. Shared fields live in `PartBase`, while category-specific fields stay on the exact part types: CPU and Motherboard have `socket`, RAM and CPU Cooler have `type`, PSU has `wattage`, and Case has `formFactor`.

## Build Rules

All 8 categories are required before a build can be finalized: CPU, Motherboard, RAM, GPU, Storage, PSU, Case, and CPU Cooler. Users can still save/load drafts at any stage.

Disabled state is derived, not stored. The app recalculates whether a part is selectable from the current selections, the $1,000 budget, and incompatibility rules. Incompatibilities are checked bidirectionally, so either selected part can declare the relationship.

## Undo/Redo Architecture

The selected build is stored as a category-to-part-id map:

```ts
Partial<Record<PartCategory, string>>
```

Undo/redo uses a custom history object:

```ts
{
  past: BuildSelections[]
  present: BuildSelections
  future: BuildSelections[]
}
```

Every valid select, remove, or clear action pushes the current `present` state onto `past`, replaces `present`, and clears `future`. Undo moves the latest `past` entry into `present` and stores the previous `present` at the front of `future`. Redo performs the inverse. Invalid selections, such as over-budget or incompatible parts, do not enter the history stack.

## Notes

- Ant Design's `ConfigProvider` centralizes theme tokens and supports the light/dark mode switch.
- Budget-disabled and incompatible-disabled products use distinct labels and visual states.
- The `Export PDF` button prints a dedicated invoice view with selected part images. The browser's "Save as PDF" output only includes the invoice, so page count scales with the selected parts instead of the app layout.
- Part selection controls use native buttons with disabled states, `aria-pressed`, `aria-disabled`, reason text, toast notifications, and a polite screen-reader live region.
