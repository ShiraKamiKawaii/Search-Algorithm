import React, { useState, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import { motion } from 'framer-motion';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import GraphCanvas from './components/graph/GraphCanvas';
import FormatGuideModal from './components/FormatGuideModal';

import BfsTable from './components/tables/BfsTable';
import BestFirstSearchTable from './components/tables/BestFirstSearchTable';
import AStarTable from './components/tables/AStarTable';

import { calculateLayout } from './components/graph/graphLayout';
import './styles/liquidGlass.css';

const API_URL = 'http://127.0.0.1:8000/api/solve';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [algo, setAlgo] = useState('Best First Search');
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(null);

  const [startInput, setStartInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const nodePositionsRef = useRef({});
  const timerRef = useRef(null);

  const fetchGraphData = async (overrideStart = null, overrideGoal = null) => {
    try {
      const formData = new FormData();
      formData.append('algo', algo);
      if (selectedFile) formData.append('file', selectedFile);

      const sVal = overrideStart !== null ? overrideStart : startInput;
      const gVal = overrideGoal !== null ? overrideGoal : goalInput;

      if (sVal) formData.append('custom_start', sVal);
      if (gVal) formData.append('custom_goal', gVal);

      const res = await axios.post(API_URL, formData);
      setData(res.data);
      setStartInput(res.data.start);
      setGoalInput(res.data.goal);

      const initPositions = calculateLayout(res.data.graph, res.data.start);
      nodePositionsRef.current = initPositions;

      setCurrentStepIdx(0);
      setIsPlaying(false);
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi kết nối Backend!');
    }
  };

  useEffect(() => {
    fetchGraphData('', '');
  }, [algo, selectedFile]);

  // Synchronize Nodes and Edges
  useEffect(() => {
    if (!data) return;

    const { graph, result } = data;
    const steps = result.steps || [];
    if (steps.length === 0) return;

    const currentStep = steps[currentStepIdx] || steps[steps.length - 1];
    const currNode = currentStep.current;
    const closedList = currentStep.closed || [];
    const openList = Array.isArray(currentStep.open)
      ? currentStep.open.map(item => (typeof item === 'object' ? (Array.isArray(item) ? item[0] : item.node) : item))
      : [];

    const isFinalStep = currentStepIdx === steps.length - 1 && result.success;
    const path = isFinalStep ? result.path || [] : [];

    setNodes((prevNodes) => {
      prevNodes.forEach(node => {
        if (node.position) nodePositionsRef.current[node.id] = node.position;
      });

      return Object.keys(graph).map((nodeKey) => {
        const pos = nodePositionsRef.current[nodeKey] || { x: 300, y: 200 };
        const hVal = algo === 'BFS' ? undefined : graph[nodeKey]?.heuristic;

        let state = 'default';
        if (path.includes(nodeKey)) state = 'path';
        else if (nodeKey === currNode) state = 'current';
        else if (openList.includes(nodeKey)) state = 'open';
        else if (closedList.includes(nodeKey)) state = 'closed';

        return {
          id: nodeKey,
          type: 'smoothNode',
          position: pos,
          data: { label: nodeKey, hVal, state }
        };
      });
    });

    const newEdges = [];
    Object.entries(graph).forEach(([u, uData]) => {
      Object.entries(uData.neighbors || {}).forEach(([v, weight]) => {
        const isPathEdge = isFinalStep && path.indexOf(u) !== -1 && path.indexOf(v) === path.indexOf(u) + 1;
        const isExploring = u === currNode && (openList.includes(v) || v === steps[currentStepIdx + 1]?.current);

        let strokeColor = '#64748b';
        let strokeWidth = 2;

        if (isPathEdge) {
          strokeColor = '#16a34a';
          strokeWidth = 3.5;
        } else if (isExploring) {
          strokeColor = '#2563eb';
          strokeWidth = 2.5;
        }

        newEdges.push({
          id: `e-${u}-${v}`,
          source: u,
          target: v,
          type: 'floating',
          label: algo === 'A*' ? `${weight}` : '',
          animated: isPathEdge || isExploring,
          style: { stroke: strokeColor, strokeWidth: strokeWidth },
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: strokeColor },
        });
      });
    });

    setEdges(newEdges);
  }, [data, currentStepIdx]);

  useEffect(() => {
    if (isPlaying && data && data.result?.steps) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev >= data.result.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, data, speed]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f8fafc', overflow: 'hidden' }}>
      
      <Sidebar
        algo={algo}
        setAlgo={setAlgo}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileContent={data?.file_content}
        startInput={startInput}
        setStartInput={setStartInput}
        goalInput={goalInput}
        setGoalInput={setGoalInput}
        onUpdate={() => fetchGraphData()}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Header Bar */}
        <div style={{
          height: '54px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 5
        }}>
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>
            Mô Phỏng Thuật Toán Tìm Kiếm: <span style={{ color: '#2563eb' }}>{algo}</span>
          </span>

          {/* Nút bật Popup Hướng dẫn dạng Liquid Glass */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsGuideOpen(true)}
            className="liquid-glass-btn"
            style={{
              padding: '7px 16px',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📖</span> Định dạng file .txt
          </motion.button>
        </div>

        {/* Khung Graph Canvas */}
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          data={data}
          currentStepIdx={currentStepIdx}
          setCurrentStepIdx={setCurrentStepIdx}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
        />

        {/* Bảng Các Bước Chạy */}
        {algo === 'BFS' ? (
          <BfsTable data={data} currentStepIdx={currentStepIdx} setCurrentStepIdx={setCurrentStepIdx} />
        ) : algo === 'A*' ? (
          <AStarTable data={data} currentStepIdx={currentStepIdx} setCurrentStepIdx={setCurrentStepIdx} />
        ) : (
          <BestFirstSearchTable data={data} currentStepIdx={currentStepIdx} setCurrentStepIdx={setCurrentStepIdx} />
        )}

      </div>

      <FormatGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}