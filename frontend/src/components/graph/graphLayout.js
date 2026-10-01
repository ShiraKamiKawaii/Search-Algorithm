// Bố cục tọa độ gốc
export const PRESET_POSITIONS = {
  A: { x: 380, y: 30 },
  C: { x: 120, y: 120 },
  D: { x: 380, y: 200 },
  E: { x: 600, y: 120 },
  F: { x: 90,  y: 330 },
  I: { x: 440, y: 330 },
  K: { x: 780, y: 260 },
  G: { x: 660, y: 430 },
  B: { x: 240, y: 480 },
  H: { x: 440, y: 580 }
};

// Thuật toán tính toán vị trí đồ thị
export const calculateLayout = (graph, startNode) => {
  if (!graph) return {};

  const keys = Object.keys(graph);
  const isPresetGraph = keys.every(k => PRESET_POSITIONS[k]);
  if (isPresetGraph) return { ...PRESET_POSITIONS };

  const positions = {};
  const levels = {};
  const visited = new Set([startNode]);
  const queue = [{ id: startNode, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift();
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(id);

    const neighbors = Object.keys(graph[id]?.neighbors || {});
    for (const nbr of neighbors) {
      if (!visited.has(nbr)) {
        visited.add(nbr);
        queue.push({ id: nbr, depth: depth + 1 });
      }
    }
  }

  const maxDepth = Math.max(...Object.keys(levels).map(Number), 0);
  const unvisited = keys.filter(n => !visited.has(n));
  if (unvisited.length > 0) levels[maxDepth + 1] = unvisited;

  Object.entries(levels).forEach(([depthStr, nodeIds]) => {
    const depth = Number(depthStr);
    const spacing = 160;
    const startX = 400 - ((nodeIds.length - 1) * spacing) / 2;

    nodeIds.forEach((id, idx) => {
      positions[id] = {
        x: startX + idx * spacing,
        y: 60 + depth * 120
      };
    });
  });

  return positions;
};

// THUẬT TOÁN ĐỘNG TÍNH ĐIỂM NEO GẦN NHẤT DỰA TRÊN HƯỚNG VECTOR (8 HƯỚNG)
export const getEdgeHandles = (u, v, posU, posV) => {
  if (!posU || !posV) return { sourceHandle: 's-bottom', targetHandle: 't-top' };

  const dx = posV.x - posU.x;
  const dy = posV.y - posU.y;

  // Tính góc từ đỉnh U tới đỉnh V (-180° đến 180°)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  let sourceDir = 'right';
  let targetDir = 'left';

  if (angle >= -22.5 && angle < 22.5) {
    sourceDir = 'right';
    targetDir = 'left';
  } else if (angle >= 22.5 && angle < 67.5) {
    sourceDir = 'bottom-right';
    targetDir = 'top-left';
  } else if (angle >= 67.5 && angle < 112.5) {
    sourceDir = 'bottom';
    targetDir = 'top';
  } else if (angle >= 112.5 && angle < 157.5) {
    sourceDir = 'bottom-left';
    targetDir = 'top-right';
  } else if (angle >= 157.5 || angle < -157.5) {
    sourceDir = 'left';
    targetDir = 'right';
  } else if (angle >= -157.5 && angle < -112.5) {
    sourceDir = 'top-left';
    targetDir = 'bottom-right';
  } else if (angle >= -112.5 && angle < -67.5) {
    sourceDir = 'top';
    targetDir = 'bottom';
  } else if (angle >= -67.5 && angle < -22.5) {
    sourceDir = 'top-right';
    targetDir = 'bottom-left';
  }

  return {
    sourceHandle: `s-${sourceDir}`,
    targetHandle: `t-${targetDir}`
  };
};