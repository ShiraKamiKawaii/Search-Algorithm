import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function BfsTable({ data, currentStepIdx, setCurrentStepIdx }) {
  if (!data) return null;

  // Trích xuất danh sách tên đỉnh sạch từ open list (loại bỏ ngoặc/h)
  const formatNodeList = (items) => {
    if (!items || items.length === 0) return '-';
    return items.map(item => (Array.isArray(item) ? item[0] : item)).join(', ');
  };

  // Trích xuất các đỉnh con sinh ra từ đỉnh đang xét u
  const getChildrenNodes = (currNode) => {
    if (!currNode || !data.graph?.[currNode]) return '-';
    const neighbors = Object.keys(data.graph[currNode].neighbors || {});
    return neighbors.length > 0 ? neighbors.join(', ') : '-';
  };

  // Xuất file output.txt chuẩn dạng BFS
  const downloadOutputFile = () => {
    let content = `BẢNG LIỆT KÊ CÁC BƯỚC THỰC HIỆN BFS:\n`;
    content += `Phát triển TT (u) | Trạng thái kế (v) | Danh sách L\n`;
    content += `- | - | ${data.start}\n`;

    data.result.steps.forEach((step) => {
      const curr = step.current;
      const children = getChildrenNodes(curr);
      const openStr = formatNodeList(step.open);
      content += `${curr} | ${children} | ${openStr}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `output_bfs.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '300px', background: '#ffffff', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#1e3a8a" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>
            Bảng diễn tiến BFS (Tìm kiếm theo chiều rộng)
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
              <th style={{ padding: '10px 16px', width: '22%' }}>Phát triển TT (u)</th>
              <th style={{ padding: '10px 16px', width: '38%' }}>Trạng thái kế (v)</th>
              <th style={{ padding: '10px 16px', width: '40%' }}>Danh sách L</th>
            </tr>
          </thead>
          <tbody>
            {/* DÒNG KHỞI TẠO (-) (-) (Start) */}
            <tr style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>
              <td style={{ padding: '9px 16px', color: '#0f172a' }}>-</td>
              <td style={{ padding: '9px 16px', color: '#0f172a' }}>-</td>
              <td style={{ padding: '9px 16px', color: '#0f172a' }}>{data.start}</td>
            </tr>

            {/* CÁC BƯỚC DUYỆT BFS */}
            {data.result?.steps?.map((step, idx) => {
              const isCurrentRow = idx === currentStepIdx;
              return (
                <tr
                  key={idx}
                  onClick={() => setCurrentStepIdx(idx)}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    background: isCurrentRow ? '#dbeafe' : idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                    fontWeight: isCurrentRow ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <td style={{ padding: '9px 16px', color: isCurrentRow ? '#1d4ed8' : '#0f172a', fontWeight: 'bold' }}>
                    {step.current}
                  </td>
                  <td style={{ padding: '9px 16px', color: '#334155' }}>
                    {getChildrenNodes(step.current)}
                  </td>
                  <td style={{ padding: '9px 16px', color: '#0f172a' }}>
                    {formatNodeList(step.open)}
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