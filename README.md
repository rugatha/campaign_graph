# campaign_graph

Interactive relation graph for the Rugatha campaigns.

This project is a single-page HTML app that shows an interactive, zoomable,
and pannable relation graph of different Rugatha campaign lines. Nodes can be
expanded / collapsed and the view will automatically center on the clicked node.

## Features

- Left-to-right layered layout:
  - Level 1: `Rugatha`
  - Level 2: `Rugatha Plus`, `Rugatha lite`, `Rugatha WILDS`,
    `Rugatha Legends`, `Rugatha Experience`, `Rugatha Brown`
  - Level 3: Child campaigns (C01, C02, ..., O1, O2, E1, E2, etc.)
- Nodes as ellipses with text labels
- Third-level (###) nodes are collapsed by default
- Clicking nodes:
  - Toggles expansion of their children (if any)
  - Automatically recenters the clicked node on the viewport
- Graph:
  - Draggable (panning)
  - Mouse-wheel zoom (with limits)
- Clean black-on-white styling for testing and embedding.

## How to run locally

Just open `index.html` in your browser:

```bash
git clone https://github.com/<your-username>/campaign_graph.git
cd campaign_graph
# then double-click index.html or open it with your browser
