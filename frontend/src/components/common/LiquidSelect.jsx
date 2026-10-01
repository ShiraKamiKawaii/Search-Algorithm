import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/liquidGlass.css';

export default function LiquidSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Tự đóng menu khi click ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      
      {/* Nút chính hiển thị giá trị đã chọn */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass-btn"
        style={{
          padding: '11px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: '700',
          color: '#0f172a'
        }}
      >
        <span>{selectedOption?.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ fontSize: '12px', opacity: 0.7 }}
        >
          ▼
        </motion.span>
      </motion.div>

      {/* Menu xổ xuống (Trượt lỏng xuống - Dropdown Menu) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 100,
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px) saturate(200%)',
              WebkitBackdropFilter: 'blur(20px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '14px',
              padding: '6px',
              boxShadow: '0 20px 40px -10px rgba(31, 38, 135, 0.2), 0 0 15px rgba(255, 255, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden'
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <motion.div
                  key={opt.value}
                  whileHover={{ x: 4, backgroundColor: 'rgba(37, 99, 235, 0.12)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: isSelected ? '800' : '600',
                    color: isSelected ? '#1d4ed8' : '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'color 0.2s',
                    background: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'transparent'
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="check-icon"
                      style={{ color: '#2563eb', fontWeight: 'bold' }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}