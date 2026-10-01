import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

export default function SmoothNode({ data }) {
  const { label, hVal, state } = data;
  const displayText = hVal !== undefined ? `${label}-${hVal}` : label;

  const stateStyles = {
    path: { 
      bg: '#22c55e', 
      border: '#15803d', 
      color: '#ffffff', 
      shadow: '0 0 16px rgba(34, 197, 94, 0.55)', 
      scale: 1.05 
    },
    current: { 
      bg: '#2563eb', 
      border: '#1d4ed8', 
      color: '#ffffff', 
      shadow: '0 0 18px rgba(37, 99, 235, 0.65)', 
      scale: 1.08 
    },
    open: { 
      bg: '#e0f2fe', 
      border: '#0284c7', 
      color: '#0369a1', 
      shadow: '0 2px 8px rgba(56, 189, 248, 0.25)', 
      scale: 1.01 
    },
    closed: { 
      bg: '#ffffff', 
      border: '#cbd5e1', 
      color: '#475569', 
      shadow: '0 1px 3px rgba(0,0,0,0.06)', 
      scale: 1.0 
    },
    default: { 
      bg: '#ffffff', 
      border: '#475569', 
      color: '#0f172a', 
      shadow: '0 2px 4px rgba(0,0,0,0.08)', 
      scale: 1.0 
    }
  };

  const style = stateStyles[state] || stateStyles.default;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute'
        }}
      />

      <motion.div
        animate={{ scale: style.scale, boxShadow: style.shadow }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          background: style.bg,
          border: `2px solid ${style.border}`,
          color: style.color,
          borderRadius: '10px',
          padding: '8px 18px',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '13px',
          minWidth: '64px',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        {displayText}
      </motion.div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute'
        }}
      />
    </div>
  );
}