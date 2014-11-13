This prototype implements A* pathfinding over arbitrary navmeshes where edges can be marked as walls which define the problem, instead of using holes.

Features:

- Traversal of arbitrary manifold 2D navmeshes in which walls are marked on edges, and "wire-walls", which I wanted.
- Considers token-width when checking portal-edges for traversal generating and smoothing the output vert-path.
    - But does _not_ check if faces can contain wide tokens for being non-trivial on non-tri polygons.
- Possibility to easily extend heuristics.
- Simple interactive demo on `index.html`.

Dependencies:

- My own implementation of the AIF-Mesh format [5310/aif-mesh](https://github.com/5310/aif-mesh).
- [PolyK](http://polyk.ivank.net/), and a personal collection of mesh manipulation utility functions for AIFM using PolyK etc.
- My set operations library for ES6 Sets [5310/set-algebra](https://github.com/5310/set-algebra).
- [qiao/heap](https://github.com/qiao/heap.js) as the exploration priority queue.
- [GoodBoyDigital/Pixi.js](https://github.com/GoodBoyDigital/pixi.js) for drawing.
