import React from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import '@xyflow/react/dist/style.css';
import '../../styles/liquidGlass.css';

import SmoothNode from './SmoothNode';
import FloatingEdge from './FloatingEdge';

const nodeTypes = { smoothNode: SmoothNode };
const edgeTypes = { floating: FloatingEdge };

export default function GraphCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  data,
  currentStepIdx,
  setCurrentStepIdx,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed
}) {
  const steps = data?.result?.steps || [];
  const totalSteps = steps.length;

  return (
    <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#fafafa' }}>
      
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={20} size={1.2} />
        <Controls position="top-right" />
      </ReactFlow>

      {/* Floating Controls Bar Kính Lỏng ở góc dưới BÊN TRÁI */}
      <AnimatePresence>
        {totalSteps > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="liquid-glass-panel"
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              padding: '8px 20px',
              borderRadius: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              zIndex: 10
            }}
          >
            
            {/* Nút Reset */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: -20 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setCurrentStepIdx(0); setIsPlaying(false); }}
              className="liquid-glass-icon-btn"
              title="Về bước đầu"
            >
              ↺
            </motion.button>

            {/* Nút Back */}
            <motion.button
              whileHover={{ scale: 1.15, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setCurrentStepIdx(p => Math.max(0, p - 1)); setIsPlaying(false); }}
              disabled={currentStepIdx === 0}
              className="liquid-glass-icon-btn"
              title="Bước trước"
            >
              ⏮
            </motion.button>

            {/* Nút Play/Pause (Xanh lam Liquid Glass) */}
            <motion.button
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="liquid-glass-icon-btn liquid-glass-btn-primary"
              style={{ width: '44px', height: '44px', fontSize: '18px' }}
              title={isPlaying ? 'Tạm dừng' : 'Phát tự động'}
            >
              {isPlaying ? '⏸' : '▶'}
            </motion.button>

            {/* Nút Next */}
            <motion.button
              whileHover={{ scale: 1.15, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setCurrentStepIdx(p => Math.min(totalSteps - 1, p + 1)); setIsPlaying(false); }}
              disabled={currentStepIdx === totalSteps - 1}
              className="liquid-glass-icon-btn"
              title="Bước kế tiếp"
            >
              ⏭
            </motion.button>

            {/* Chỉ số Bước */}
            <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a', minWidth: '85px', textAlign: 'center' }}>
              Bước {currentStepIdx + 1} / {totalSteps}
            </span>

            <div style={{ height: '20px', width: '1px', background: 'rgba(203, 213, 225, 0.8)' }} />

            {/* Thanh chỉnh tốc độ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>
              <span>Tốc độ:</span>
              <input
                type="range"
                min="200"
                max="1500"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={{ width: '80px', cursor: 'pointer', accentColor: '#2563eb' }}
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}