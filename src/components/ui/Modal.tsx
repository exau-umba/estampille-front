import type { PropsWithChildren } from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
}

export function Modal({ isOpen, title, onClose, children }: PropsWithChildren<ModalProps>) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
