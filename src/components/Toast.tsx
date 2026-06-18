"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";

interface ToastCtx {
  show: (message: string) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2800);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {message && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#290036",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "6px",
            fontWeight: 600,
            boxShadow: "0 8px 30px rgba(41,0,54,0.35)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "toastIn .3s ease",
          }}
        >
          <Icon name="check_circle" fill size={22} style={{ color: "#5BC3C3" }} />
          {message}
        </div>
      )}
    </Ctx.Provider>
  );
}
