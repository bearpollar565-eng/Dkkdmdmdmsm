import React, { useState, useEffect } from 'react';

type ToastListener = (message: string) => void;
const listeners = new Set<ToastListener>();

export function showNotification(message: string) {
  listeners.forEach(listener => listener(message));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleToast = (message: string) => {
      const id = idCounter++;
      setToasts(prev => [...prev, { id, message }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 2500);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-[85px] left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
    >
      {toasts.map(t => (
        <div 
          key={t.id}
          className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-2xl select-none animate-[toastIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] border border-zinc-200"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
