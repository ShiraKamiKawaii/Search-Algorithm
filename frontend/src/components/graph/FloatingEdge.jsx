import React from 'react';
import { useInternalNode, getStraightPath, EdgeLabelRenderer } from '@xyflow/react';

// Hàm tính tọa độ điểm cắt trên viền khung nút dựa vào góc vector nối 2 tâm nút
function getNodeIntersection(nodeA, nodeB) {
  if (!nodeA || !nodeB) return { x: 0, y: 0 };

  const wA = nodeA.measured?.width || nodeA.width || 80;
  const hA = nodeA.measured?.height || nodeA.height || 40;
  const posA = nodeA.positionAbsolute || nodeA.position || { x: 0, y: 0 };
  const cxA = posA.x + wA / 2;
  const cyA = posA.y + hA / 2;

  const wB = nodeB.measured?.width || nodeB.width || 80;
  const hB = nodeB.measured?.height || nodeB.height || 40;
  const posB = nodeB.positionAbsolute || nodeB.position || { x: 0, y: 0 };
  const cxB = posB.x + wB / 2;
  const cyB = posB.y + hB / 2;

  const dx = cxB - cxA;
  const dy = cyB - cyA;

  if (dx === 0 && dy === 0) return { x: cxA, y: cyA };

  const hw = wA / 2;
  const hh = hA / 2;

  const tx = Math.abs(hw / dx);
  const ty = Math.abs(hh / dy);
  const t = Math.min(tx, ty);

  return {
    x: cxA + t * dx,
    y: cyA + t * dy
  };
}

export default function FloatingEdge({ id, source, target, markerEnd, style, label }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) return null;

  const sourceIntersection = getNodeIntersection(sourceNode, targetNode);
  const targetIntersection = getNodeIntersection(targetNode, sourceNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sourceIntersection.x,
    sourceY: sourceIntersection.y,
    targetX: targetIntersection.x,
    targetY: targetIntersection.y,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
          stroke: '#64748b',
          fill: 'none',
          ...style,
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: '#ffffff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#334155',
              border: '1px solid #cbd5e1',
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}