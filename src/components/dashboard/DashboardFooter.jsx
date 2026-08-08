import React from "react";
import { IoSparklesOutline, IoLogoWhatsapp, IoServerOutline, IoPulseOutline } from "react-icons/io5";

export default function DashboardFooter({ lastUpdated }) {
  return (
    <div className="mt-8 pt-4 border-t border-whatsapp-border/10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-whatsapp-gray gap-3 select-none">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <IoSparklesOutline className="text-whatsapp-green animate-pulse" /> Gemini Active
        </span>
        <span className="flex items-center gap-1">
          <IoLogoWhatsapp className="text-[#25D366]" /> WhatsApp API Online
        </span>
        <span className="flex items-center gap-1">
          <IoServerOutline className="text-[#001E2B]" /> MongoDB Connected
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span>SalesPilot-AI v1.0</span>
        {lastUpdated && (
          <span className="font-mono">Last Refresh: {lastUpdated}</span>
        )}
      </div>
    </div>
  );
}
