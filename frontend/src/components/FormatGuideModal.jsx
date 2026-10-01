import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/liquidGlass.css';

export default function FormatGuideModal({ isOpen, onClose }) {
  const sampleFormat = `START A
GOAL G
A 10
B 8
C 5
D 7
E 3
F 6
G 0
EDGES
A B
A C
A D
B I
B G
C F
C E
D C
D F
I G
E G
E K
F K`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleFormat);
    alert('Đã sao chép nội dung mẫu vào clipboard!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'relative', zIndex: 1000 }}>
          
          {/* Backdrop Phông nền Liquid Glass mờ ảo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(8px) saturate(150%)',
              WebkitBackdropFilter: 'blur(8px) saturate(150%)',
            }}
          />

          {/* Khung Popup Modal có Animation trượt & phóng to đàn hồi */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '20px',
                width: '520px',
                maxWidth: '100%',
                maxHeight: '85vh',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              
              {/* Modal Header */}
              <div style={{
                padding: '16px 22px',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(248, 250, 252, 0.6)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>📖</span>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                    Hướng dẫn cấu trúc file `.txt`
                  </h3>
                </div>
                
                {/* Nút Đóng Popup */}
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="liquid-glass-icon-btn"
                  style={{ width: '32px', height: '32px', fontSize: '13px' }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
                <p style={{ marginTop: 0, color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>
                  Để hệ thống đọc đúng dữ liệu đồ thị, file <code>.txt</code> cần trình bày theo <b>4 phần chính</b>:
                </p>

                <div style={{
                  background: 'rgba(241, 245, 249, 0.7)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#1e293b',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={badgeStyle}>1</span>
                    <div><b>Dòng 1:</b> <code>START &lt;đỉnh_đầu&gt;</code> (VD: <code>START A</code>)</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={badgeStyle}>2</span>
                    <div><b>Dòng 2:</b> <code>GOAL &lt;đỉnh_cuối&gt;</code> (VD: <code>GOAL G</code>)</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={badgeStyle}>3</span>
                    <div>
                      <b>Danh sách Đỉnh & Heuristic $h(n)$:</b> <code>&lt;tên_đỉnh&gt; &lt;heuristic&gt;</code>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        *(Với thuật toán BFS không dùng Heuristic, bạn có thể nhập giá trị 0)*
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={badgeStyle}>4</span>
                    <div><b>Từ khóa phân cách:</b> <code>EDGES</code> (Nằm riêng 1 dòng)</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={badgeStyle}>5</span>
                    <div><b>Danh sách Cạnh:</b> <code>&lt;đỉnh_nguồn&gt; &lt;đỉnh_đích&gt;</code></div>
                  </div>
                </div>

                {/* Khối xem trước & Sao chép */}
                <div style={{ marginTop: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '12px', color: '#334155' }}>
                      Nội dung file mẫu chuẩn:
                    </span>
                    
                    {/* Nút Copy Sao chép Kính Lỏng */}
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleCopy}
                      className="liquid-glass-btn"
                      style={{ padding: '6px 14px', fontSize: '12px', color: '#2563eb' }}
                    >
                      📋 Sao chép mẫu
                    </motion.button>
                  </div>

                  <pre style={{
                    background: '#0f172a',
                    color: '#38bdf8',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontFamily: 'Consolas, Monaco, monospace',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    margin: 0,
                    lineHeight: '1.4',
                    border: '1px solid #1e293b'
                  }}>
                    {sampleFormat}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '14px 22px',
                borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                justifyContent: 'flex-end',
                background: 'rgba(248, 250, 252, 0.6)'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={onClose}
                  className="liquid-glass-btn liquid-glass-btn-primary"
                  style={{ padding: '8px 24px', fontSize: '13px' }}
                >
                  Đã hiểu
                </motion.button>
              </div>

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}

const badgeStyle = {
  background: '#2563eb',
  color: '#fff',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: '700',
  flexShrink: 0,
  marginTop: '2px',
};