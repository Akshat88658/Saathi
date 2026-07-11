import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000,
      background: 'var(--bg-tertiary)',
      border: `1px solid ${type === 'success' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeInUp 0.3s ease-out forwards',
      maxWidth: '400px',
    }}>
      {type === 'success' ? (
        <CheckCircle size={20} style={{ color: '#4ade80', flexShrink: 0 }} />
      ) : (
        <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
      )}
      
      <span style={{ color: 'var(--text-light)', fontSize: '0.95rem', flexGrow: 1 }}>
        {message}
      </span>

      <button 
        onClick={onClose} 
        style={{
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          borderRadius: '50%',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-white)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
