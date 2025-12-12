import './Toast.css'

function Toast({ toast, onRemove }) {
  return (
    <div className={`toast toast-${toast.type}`} onClick={() => onRemove(toast.id)}>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={(e) => { e.stopPropagation(); onRemove(toast.id) }}>
          ×
        </button>
      </div>
    </div>
  )
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

