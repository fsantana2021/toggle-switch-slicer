# Source code — Toggle Switch Slicer

Power BI custom visual built with [powerbi-visuals-tools](https://learn.microsoft.com/power-bi/developer/visuals/environment-setup).

## Build
```bash
npm install -g powerbi-visuals-tools
npm install
npx pbiviz package          # creates dist/<guid>.<version>.pbiviz
```
Use `npx pbiviz start` for live development in the Power BI service (developer visual).

## Structure
| File | What it does |
|---|---|
| `src/visual.ts` | rendering, click/keyboard handling, filter (applyJsonFilter), tooltip, high contrast |
| `src/settings.ts` | Format pane (cards and options) |
| `capabilities.json` | data role, format objects, landing page, tooltips, sync slicers |
| `stringResources/` | English and Portuguese texts |
| `style/visual.less` | styles |

Code comments are in Portuguese. Bump the version in `pbiviz.json` on every release.
