# Product Editor Prototype

A single-file, browser-based drafting space for laying out **products → unit plans → layouts** with grids, walls, dimensions, and elements.

Open `index.html` in any modern browser — no build step or dependencies.

## Features

- **Nested boundaries**: Product → Unit Plan → Layout. Open a container (right-click → Open) to work inside it; opening a nested one opens its ancestors, and you close from the inside out. The active container is highlighted red; everything outside it dims. Each boundary instance gets its own color shade.
- **Grids**: drop grid lines inside an open container. Grids are stored as fractions of their box, so they move and scale with it. Grids (and dimensions) take the color of the container they're in.
- **Walls**: 6" and 12" walls, white-filled with merged outlines at corners / T / cross junctions. Endpoints snap to and follow grid/edge intersections and box corners.
- **Dimensions**:
  - **Dimension** – multi-reference strings (click references, Enter to commit).
  - **Lock** – forces a grid to keep a fixed distance from an anchor.
  - **EQ** – forces grids to equal spacing.
  - **Flex** – distributes size change across segments by per-segment percentages (slider panel).
  - Toggle visibility of dimensions by the container kind they were drawn in.
- **Elements**: 1×1 placeholder placed on an intersection/corner; right-click to rotate 90° around its insertion point.
- **Selection**: hover highlights overlapping containers; **Tab** cycles through them (and grids); click brings a container to the front.

## Controls

- Tools: `V` select · `B` product · `U` unit plan · `Y` layout · `N` element · `G` grid · `W`/`6` 6" wall · `7` 12" wall · `D` dim · `L` lock dim · `E` EQ dim · `F` flex dim
- Pan: middle-mouse, right-drag, or hold `Space`. Zoom: scroll wheel. `Home` / Fit view to frame everything.
- `Tab` cycles overlapping containers under the cursor. `Esc` cancels. `Del` deletes the selection.
