import React from 'react';
import LiquidSelect from './common/LiquidSelect';
import '../styles/liquidGlass.css';

export default function Sidebar({
  algo,
  setAlgo,
  selectedFile,
  setSelectedFile,
  fileContent,
  startInput,
  setStartInput,
  goalInput,
  setGoalInput,
  onUpdate
}) {
  // Danh sách các lựa chọn cho LiquidSelect
  const algoOptions = [
    { value: 'Best First Search', label: 'Best First Search (BFS Dò Cùng)' },
    { value: 'A*', label: 'A* Search Algorithm' },
    { value: 'BFS', label: 'Breadth-First Search (BFS Rộng)' }
  ];

  return (
    <div style={{
      width: '350px',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 10px rgba(0,0,0,0.03)',
      zIndex: 20
    }}>
      
      {/* 1. HEADER CHÍNH */}
      <div style={{
        padding: '20px 22px',
        borderBottom: '1px solid #f1f5f9',
        background: '#f8fafc'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '800',
          color: '#0f172a',
          margin: 0,
          letterSpacing: '-0.3px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '22px' }}>📊</span> Mô Phỏng Đồ Thị
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: '4px 0 0 0',
          fontWeight: '500'
        }}>
          Tìm kiếm & Trực quan hóa thuật toán
        </p>
      </div>

      {/* BODY SIDEBAR */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>

        {/* 2. CHỌN THUẬT TOÁN (LIQUID SELECT DROPDOWN) */}
        <div>
          <label style={{ ...sectionHeaderStyle, marginBottom: '8px' }}>
            🎯 Thuật Toán Tìm Kiếm
          </label>
          <LiquidSelect
            options={algoOptions}
            value={algo}
            onChange={(val) => setAlgo(val)}
          />
        </div>

        {/* 3. HIỂN THỊ FILE TXT */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <label style={{ ...sectionHeaderStyle, margin: 0 }}>
              📄 File TXT Đang Chạy
            </label>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              Active
            </span>
          </div>

          {/* Tên file */}
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '10px',
            wordBreak: 'break-all',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>📁</span> {selectedFile ? selectedFile.name : 'Data Mặc Định (Default)'}
          </div>

          {/* Nút Tải File Hiệu Ứng Liquid Glass */}
          <input
            type="file"
            accept=".txt"
            id="file-upload"
            onChange={(e) => setSelectedFile(e.target.files[0] || null)}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="file-upload"
            className="liquid-glass-btn"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px',
              fontSize: '13px',
              color: '#2563eb',
              marginBottom: '12px'
            }}
          >
            {selectedFile ? '🔄 Thay đổi file .txt khác' : '➕ Tải lên file .txt mới'}
          </label>

          {/* NỘI DUNG FILE TXT */}
          {fileContent && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                Nội dung xem trước:
              </div>
              <pre style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '13.5px',
                lineHeight: '1.6',
                fontFamily: 'Consolas, Monaco, "Fira Code", monospace',
                fontWeight: '500',
                maxHeight: '355px',
                minHeight: '200px',
                overflowY: 'auto',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                border: '1px solid #1e293b'
              }}>
                {fileContent}
              </pre>
            </div>
          )}
        </div>

        {/* 4. TÙY CHỈNH ĐỈNH ĐẦU & ĐỈNH ĐÍCH */}
        <div>
          <label style={sectionHeaderStyle}>
            📌 Điểm Đầu & Điểm Đích
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
            <div>
              <span style={inputLabelStyle}>Đỉnh Bắt Đầu:</span>
              <input
                type="text"
                placeholder="VD: A"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value.toUpperCase())}
                style={inputStyle}
              />
            </div>
            <div>
              <span style={inputLabelStyle}>Đỉnh Kết Thúc:</span>
              <input
                type="text"
                placeholder="VD: B"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value.toUpperCase())}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER NÚT THỰC THI LIQUID GLASS */}
      <div style={{ padding: '16px 22px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        <button
          onClick={onUpdate}
          className="liquid-glass-btn liquid-glass-btn-primary"
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🚀</span> Cập Nhật & Chạy Thuật Toán
        </button>
      </div>

    </div>
  );
}

const sectionHeaderStyle = {
  display: 'block',
  fontSize: '15px',
  fontWeight: '700',
  color: '#0f172a',
  letterSpacing: '-0.2px'
};

const inputLabelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#64748b',
  display: 'block',
  marginBottom: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  fontSize: '14px',
  fontWeight: '600',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};