"use client";

import type { ReactNode } from "react";

interface LegalModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}

export function LegalModal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: LegalModalProps) {
  if (!open) return null;

  return (
    <div className="pp-overlay" id="legal-overlay" onClick={onClose}>
      <div
        className="pp-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <div className="pp-modal-header">
          <div>
            <div className="pp-modal-header-title">{title}</div>
            <div className="pp-modal-header-sub">{subtitle}</div>
          </div>
          <button
            type="button"
            className="pp-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="pp-modal-body">{children}</div>
      </div>
    </div>
  );
}
