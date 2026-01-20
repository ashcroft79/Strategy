"use client";

import { useEffect } from "react";
import { XCircle, CheckCircle, AlertTriangle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-500",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: "text-green-800",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-500",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: "text-red-800",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-500",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          text: "text-yellow-800",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-500",
          icon: <AlertTriangle className="w-5 h-5 text-blue-600" />,
          text: "text-blue-800",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg border-l-4 shadow-lg ${styles.bg} z-50 animate-slide-up`}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <p className={`flex-1 ${styles.text}`}>{message}</p>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
