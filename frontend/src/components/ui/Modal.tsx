import type { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
}

export function Modal({ children, onClose, panelClassName }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={panelClassName ?? 'surface w-full max-w-sm mx-8 rounded-2xl border border-white/[0.08] shadow-2xl'}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
