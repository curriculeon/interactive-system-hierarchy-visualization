# What this application depicts

This interactive, client-side visualization renders hierarchical system diagrams as a set of nested boxes and layers, allowing exploration of containment, relationships and relative sizes of system components. It is intended as a lightweight, easy-to-run browser demo that helps a viewer understand a system-of-systems layout at a glance and interactively inspect parts of the hierarchy.

## High-level overview

- The canvas shows a hierarchical layout: outer containers (systems or subsystems) contain inner boxes (components, services, or nodes).
- Boxes are drawn with consistent sizing rules and scale factors so the relative sizes and layout communicate structure and capacity at a glance.
- A legend and configuration control which visual categories are shown and how they are labeled.

## Visual elements

- Boxes: rectangular 3D-ish boxes or flat rectangles that represent containers or components. Box dimensions are controlled by configuration values (for example, half-extents, scale factors, and box-height multipliers).
- Labels: textual labels are attached to boxes (component names or role labels) so you can identify items in the hierarchy.
- Layers / grouping: the visualization supports multiple layers or groupings (for example, different kinds of systems or logical groupings). Alternate configuration files provide different themed views.
- Legend: a small legend explains color/shape encodings and what each box type represents.

## Interaction and controls

- Pan and zoom: the camera implementation supports panning and zooming so you can navigate the diagram.
- Hit-testing and selection: the app performs hit-testing so hovering and clicking boxes highlights or selects them; selecting may show metadata or change the UI state.
- Mouse and touch input: the input layer supports standard mouse and touch gestures (drag to pan, wheel or pinch to zoom, click/tap to select).
- UI overlay: simple UI elements (buttons, toggles) may be available for switching configurations or toggling layers.

## Configurability

- The visualization is driven by configuration files that contain label lists, half-extents, scale factors and legend items. These configs let you change which systems are shown, alter sizes, and switch themes (for example, a Cloud Foundry-themed configuration is provided).
- Because the renderer reads sizes from the configuration, it's straightforward to test different layout scenarios by editing the config and reloading.

## Typical use-cases

- Exploring an architectural layout to understand containment and relative size of components.
- Demonstrating different configuration-driven views (for example, showing only certain layers or emphasizing certain systems).
- A teaching or presentation aid for explaining system hierarchies.

## How to interpret what you see

1. Outer boxes denote higher-level systems or environments; inner boxes denote subsystems or services contained within.
2. Label text identifies items; if colors or legend dots are present they indicate categories or roles.
3. Use pan/zoom to focus on areas of interest and click a box to select it and reveal additional information (if implemented in the configuration/UI).

## Notes

- The repository is a static, client-side demo; no server-side components are required to view the visualization.
- Interactions and exact visual encodings may vary slightly depending on which configuration file is loaded.

If you want, I can extend this file with screenshots, a brief walkthrough (step-by-step) tied to the current `js/config.js` values, or a short glossary of the specific labels used in the project's configuration.
