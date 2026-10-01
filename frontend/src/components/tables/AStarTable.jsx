import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function AStarTable({ data, currentStepIdx, setCurrentStepIdx }) {
  if (!data) return null;

  const { graph, result, start, goal } = data;
  const steps = result?.steps || [];

  // Hàm định dạng Danh sách L (OPEN) dạng D13, E21, C24, F27
  const formatOpenList = (openItems) => {
    if (!openItems || openItems.length === 0) return '-';
    return openItems
      .map(item => {
        if (Array.isArray(item)) return `${item[0]}${item[1]}`; // Ví dụ: [ 'D', 13 ] -> D13
        if (typeof item === 'object') return `${item.node || item.id}${item.f ?? ''}`;
        return item;
      })
      .join(', ');
  };

  // Lấy danh sách các đỉnh con v kề u kèm thông số k(u,v), h(v), g(v), f(v)
  const getNeighborsDetails = (step) => {
    const u = step.current;
    const neighborsObj = graph[u]?.neighbors || {};
    const neighborKeys = Object.keys(neighborsObj);

    if (neighborKeys.length === 0) return [];

    const gU = step.gScore?.[u] ?? 0;

    return neighborKeys.map((v) => {
      const k = neighborsObj[v]; // trọng số k(u,v)
      const h = graph[v]?.heuristic ?? 0; // h(v)
      const g = gU + k; // g(v) = g(u) + k(u,v)
      const f = g + h; // f(v) = g(v) + h(v)

      return { v, k, h, g, f };
    });
  };

  // Xuất file output_a_star.txt
  const downloadOutputFile = () => {
    let content = `BẢNG MÔ TẢ THUẬT TOÁN A*:\n`;
    content += `=======================================================================\n`;
    content += `TT\t|\tTTK\t|\tk(u,v)\t|\th(v)\t|\tg(v)\t|\tf(v)\t|\tDanh sách L\n`;
    content += `=======================================================================\n`;

    steps.forEach((step) => {
      const u = step.current;
      const details = getNeighborsDetails(step);
      const lStr = formatOpenList(step.open);

      if (details.length === 0) {
        content += `${u}\t|\t-\t|\t-\t|\t-\t|\t-\t|\t-\t|\t${lStr}\n`;
      } else {
        details.forEach((item, idx) => {
          if (idx === 0) {
            content += `${u}\t|\t${item.v}\t|\t${item.k}\t|\t${item.h}\t|\t${item.g}\t|\t${item.f}\t|\t${lStr}\n`;
          } else {
            content += `\t|\t${item.v}\t|\t${item.k}\t|\t${item.h}\t|\t${item.g}\t|\t${item.f}\t|\t\n`;
          }
        });
      }
    });

    if (result.success) {
      const pathStr = result.path ? [...result.path].reverse().join(' <- ') : '';
      const totalCost = result.cost ?? result.pathCost ?? 0;
      content += `=======================================================================\n`;
      content += `${goal}\t|\tTTKT/dừng, đường đi ${pathStr}, độ dài ${totalCost}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `output_a_star.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '300px', background: '#ffffff', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER BẢNG & NÚT DOWNLOAD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#1e3a8a" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>
            Bảng mô tả các bước diễn tiến Thuật Toán A* (A Star)
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

      {/* RENDER TABLE */}
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1e3a8a', color: '#ffffff', position: 'sticky', top: 0, zIndex: 5 }}>
              <th style={{ padding: '9px 12px', width: '60px' }}>TT</th>
              <th style={{ padding: '9px 12px', width: '70px' }}>TTK</th>
              <th style={{ padding: '9px 12px', width: '80px' }}>k(u,v)</th>
              <th style={{ padding: '9px 12px', width: '70px' }}>h(v)</th>
              <th style={{ padding: '9px 12px', width: '70px' }}>g(v)</th>
              <th style={{ padding: '9px 12px', width: '70px' }}>f(v)</th>
              <th style={{ padding: '9px 16px', textAlign: 'left' }}>Danh sách L</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, sIdx) => {
              const u = step.current;
              const neighborsDetails = getNeighborsDetails(step);
              const rowSpanCount = neighborsDetails.length || 1;
              const isCurrentStep = sIdx === currentStepIdx;

              const rowBg = isCurrentStep ? '#dbeafe' : sIdx % 2 === 0 ? '#ffffff' : '#f8fafc';

              if (neighborsDetails.length === 0) {
                return (
                  <tr
                    key={sIdx}
                    onClick={() => setCurrentStepIdx(sIdx)}
                    style={{ background: rowBg, borderBottom: '1px solid #cbd5e1', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{u}</td>
                    <td style={{ padding: '8px' }}>-</td>
                    <td style={{ padding: '8px' }}>-</td>
                    <td style={{ padding: '8px' }}>-</td>
                    <td style={{ padding: '8px' }}>-</td>
                    <td style={{ padding: '8px' }}>-</td>
                    <td style={{ padding: '8px 16px', textAlign: 'left' }}>{formatOpenList(step.open)}</td>
                  </tr>
                );
              }

              return neighborsDetails.map((item, nIdx) => (
                <tr
                  key={`${sIdx}-${nIdx}`}
                  onClick={() => setCurrentStepIdx(sIdx)}
                  style={{
                    background: rowBg,
                    borderBottom: nIdx === rowSpanCount - 1 ? '1px solid #cbd5e1' : '1px solid #f1f5f9',
                    cursor: 'pointer'
                  }}
                >
                  {/* Ô TT (Đỉnh u) - Rowspan gộp dòng */}
                  {nIdx === 0 && (
                    <td
                      rowSpan={rowSpanCount}
                      style={{ padding: '8px', fontWeight: 'bold', color: isCurrentStep ? '#1d4ed8' : '#0f172a', borderRight: '1px solid #e2e8f0', verticalAlign: 'middle' }}
                    >
                      {u}
                    </td>
                  )}

                  {/* Thông số đỉnh con TTK */}
                  <td style={{ padding: '7px 8px', fontWeight: '500' }}>{item.v}</td>
                  <td style={{ padding: '7px 8px' }}>{item.k}</td>
                  <td style={{ padding: '7px 8px' }}>{item.h}</td>
                  <td style={{ padding: '7px 8px', color: '#dc2626', fontWeight: '500' }}>{item.g}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 'bold', color: '#1e3a8a' }}>{item.f}</td>

                  {/* Ô Danh sách L - Rowspan gộp dòng */}
                  {nIdx === 0 && (
                    <td
                      rowSpan={rowSpanCount}
                      style={{ padding: '8px 16px', textAlign: 'left', borderLeft: '1px solid #e2e8f0', verticalAlign: 'middle', fontWeight: '500' }}
                    >
                      {formatOpenList(step.open)}
                    </td>
                  )}
                </tr>
              ));
            })}

            {/* DÒNG CUỐI: DỪNG VÀ BÁO KẾT QUẢ ĐƯỜNG ĐI */}
            {result?.success && (
              <tr style={{ background: '#f0fdf4', borderTop: '2px solid #22c55e', fontWeight: 'bold' }}>
                <td style={{ padding: '10px', color: '#166534', fontSize: '14px' }}>{goal}</td>
                <td colSpan={6} style={{ padding: '10px 16px', textAlign: 'left', color: '#15803d', fontSize: '13px' }}>
                  TTKT/dừng, đường đi {[...result.path].reverse().join(' ← ')}, độ dài {result.cost ?? result.pathCost ?? 0}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}