import React from "react";
import { useCRM } from "../../context/CRMContext";
import { IoFlame, IoChatbubbleEllipses, IoSparkles, IoHappy, IoWarning, IoCheckmarkCircle, IoClose } from "react-icons/io5";

export default function ToastContainer() {
  const { toasts, removeToast } = useCRM();

  const getToastStyles = (type) => {
    switch (type) {
      case "hot":
        return {
          bg: "bg-red-950/90 border-red-500/30 text-red-100",
          icon: <IoFlame className="w-5 h-5 text-red-500 animate-pulse" />
        };
      case "message":
        return {
          bg: "bg-whatsapp-panel border-whatsapp-border/40 text-whatsapp-text",
          icon: <IoChatbubbleEllipses className="w-5 h-5 text-whatsapp-green" />
        };
      case "score":
        return {
          bg: "bg-emerald-950/90 border-emerald-500/30 text-emerald-100",
          icon: <IoSparkles className="w-5 h-5 text-emerald-400" />
        };
      case "sentiment":
        return {
          bg: "bg-indigo-950/90 border-indigo-500/30 text-indigo-100",
          icon: <IoHappy className="w-5 h-5 text-indigo-400" />
        };
      case "priority":
        return {
          bg: "bg-amber-950/90 border-amber-500/30 text-amber-100",
          icon: <IoWarning className="w-5 h-5 text-amber-500" />
        };
      default:
        return {
          bg: "bg-whatsapp-panel border-whatsapp-border/20 text-whatsapp-text",
          icon: <IoCheckmarkCircle className="w-5 h-5 text-whatsapp-teal" />
        };
    }
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const { bg, icon } = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-sm pointer-events-auto transition-all duration-300 transform translate-y-0 scale-100 select-none animate-slide-in ${bg}`}
          >
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1 text-xs font-medium leading-normal">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-whatsapp-gray hover:text-white transition-colors"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
