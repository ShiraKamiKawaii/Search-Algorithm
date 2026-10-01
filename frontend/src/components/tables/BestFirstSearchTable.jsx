import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function BestFirstSearchTable({ data, currentStepIdx, setCurrentStepIdx }) {
  if (!data) return null;

  const formatNodeWithVal = (nodeName) => {
    if (!nodeName || !data?.graph?.[nodeName]) return nodeName;
    const h = data.graph[nodeName].heuristic;
    return h !== undefined ? `${nodeName}(${h})` : nodeName;
  };

  const formatOpenList = (openItems) => {
    if (!openItems || openItems.length === 0) return '[]';
    const formatted = openItems.map(item => {
      if (Array.isArray(item)) return `${item[0]}(${item[1]})`;
      return formatNodeWithVal(item);
    });
    return `[${formatted.join(', ')}]`;
  };

  const getAdjacentStatesFormatted = (currNode) => {
    if (!currNode || !data?.graph?.[currNode]) return '-';
    const neighbors = Object.keys(data.graph[currNode].neighbors || {});
    if (neighbors.length === 0) return '-';
    return neighbors.map(nbr => formatNodeWithVal(nbr)).join(', ');
  };

  const downloadOutputFile = () => {
    let content = `BẢNG CÁC BƯỚC THỰC HIỆN BEST FIRST SEARCH:\n`;
    content += `Bước | Đỉnh xét (u) | Trạng thái kề | Danh sách L\n`;
    content += `Khởi tạo | - | - | ${formatOpenList([[data.start, data.graph[data.start]?.heuristic ?? 0]])}\n`;

    data.result.steps.forEach((step, idx) => {
      content += `${idx + 1} | ${step.current} | ${getAdjacentStatesFormatted(step.current)} | ${formatOpenList(step.open)}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `output_best_first_search.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '300px', background: '#ffffff', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#1e3a8a" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>
            Bảng diễn tiến thuật toán Best First Search
          </h3>
        </div>

        <button
          onClick={downloadOutputFile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: '#16a34a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          <Download size={20} /> Tải file output.txt
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1e3a8a', color: '#ffffff', position: 'sticky', top: 0, zIndex: 5 }}>
              <th style={{ padding: '10px 16px', width: '90px', textAlign: 'center' }}>Bước</th>
              <th style={{ padding: '10px 16px', width: '120px', textAlign: 'center' }}>Đỉnh xét (u)</th>
              <th style={{ padding: '10px 16px', width: '220px' }}>Trạng thái kề</th>
              <th style={{ padding: '10px 16px' }}>Danh sách L (sắp xếp tăng dần h)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>
              <td style={{ padding: '8px 16px', textAlign: 'center', color: '#0f172a' }}>Khởi tạo</td>
              <td style={{ padding: '8px 16px', textAlign: 'center' }}>-</td>
              <td style={{ padding: '8px 16px' }}>-</td>
              <td style={{ padding: '8px 16px', color: '#1e3a8a', fontWeight: 'bold' }}>
                {formatOpenList([[data.start, data.graph[data.start]?.heuristic ?? 0]])}
              </td>
            </tr>

            {data.result?.steps?.map((step, idx) => {
              const isCurrentRow = idx === currentStepIdx;
              return (
                <tr
                  key={idx}
                  onClick={() => setCurrentStepIdx(idx)}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    background: isCurrentRow ? '#dbeafe' : idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                    fontWeight: isCurrentRow ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '8px 16px', textAlign: 'center', color: isCurrentRow ? '#1d4ed8' : '#334155' }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', color: isCurrentRow ? '#1d4ed8' : '#0f172a', fontWeight: 'bold' }}>
                    {step.current}
                  </td>
                  <td style={{ padding: '8px 16px', color: '#334155' }}>
                    {getAdjacentStatesFormatted(step.current)}
                  </td>
                  <td style={{ padding: '8px 16px', color: '#0f172a' }}>
                    {formatOpenList(step.open)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}