import React from "react";
import { IoFlameOutline, IoSparklesOutline, IoRibbonOutline, IoFolderOpenOutline, IoHelpCircleOutline, IoPulseOutline, IoChevronForward, IoChevronBack, IoTimeOutline } from "react-icons/io5";

export default function IntelligencePanel({ customer, isOpen, onToggle }) {
  if (!customer) return null;

  const getStatusBadge = (status) => {
    const s = status || "Cold";
    if (s === "Hot") return <span className="px-3 py-1 text-xs font-bold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Hot Lead</span>;
    if (s === "Warm") return <span className="px-3 py-1 text-xs font-bold bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">Warm Lead</span>;
    return <span className="px-3 py-1 text-xs font-bold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Cold Lead</span>;
  };

  const getSentimentBadge = (sentiment) => {
    const s = sentiment || "Neutral";
    if (s === "Positive") return <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Positive</span>;
    if (s === "Negative") return <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Negative</span>;
    return <span className="px-2.5 py-0.5 text-xs font-semibold bg-whatsapp-input text-whatsapp-gray rounded-full border border-whatsapp-border/30">Neutral</span>;
  };

  const getPriorityBadge = (prio) => {
    const p = prio || "Low";
    if (p === "High") return <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">High</span>;
    if (p === "Medium") return <span className="px-2.5 py-0.5 text-xs font-semibold bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">Medium</span>;
    return <span className="px-2.5 py-0.5 text-xs font-semibold bg-whatsapp-input text-whatsapp-gray rounded-full border border-whatsapp-border/30">Low</span>;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`relative flex h-full transition-all duration-300 ${
      isOpen ? "w-[300px] md:w-[320px] lg:w-[350px]" : "w-0"
    } flex-shrink-0 bg-whatsapp-sidebar border-l border-whatsapp-border/40 overflow-hidden`}>
      
      {/* Collapse Handle Tab */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[24px] z-20 flex items-center justify-center w-6 h-12 rounded-l-lg bg-whatsapp-sidebar border border-r-0 border-whatsapp-border/40 text-whatsapp-gray hover:text-white hover:bg-whatsapp-panel transition-all"
        title={isOpen ? "Hide Intelligence Panel" : "Show Intelligence Panel"}
      >
        {isOpen ? <IoChevronForward className="w-4 h-4" /> : <IoChevronBack className="w-4 h-4" />}
      </button>

      {/* Main Panel Content Container */}
      <div className="flex flex-col w-full h-full p-5 overflow-y-auto select-none">
        <div className="flex items-center space-x-2 pb-4 border-b border-whatsapp-border/10 mb-4 flex-shrink-0">
          <IoSparklesOutline className="w-5 h-5 text-whatsapp-green animate-pulse" />
          <h2 className="text-sm font-bold text-whatsapp-text">AI Conversation Insights</h2>
        </div>

        <div className="space-y-5 flex-1">
          {/* Profile Name & Status */}
          <div>
            <div className="text-[10px] text-whatsapp-gray uppercase tracking-wider mb-1">Customer Profile</div>
            <div className="text-base font-bold text-whatsapp-text mb-2">{customer.name}</div>
            <div className="flex items-center gap-2">
              {getStatusBadge(customer.leadStatus)}
              <span className="text-xs text-whatsapp-gray font-mono">({customer.phone})</span>
            </div>
          </div>

          {/* Lead Score Radial/Linear Display */}
          <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-whatsapp-text mb-2.5">
              <span className="flex items-center gap-1.5"><IoFlameOutline className="text-red-400 w-4 h-4" /> Lead Score</span>
              <span className="text-sm font-bold text-whatsapp-green">{customer.leadScore ?? 0}/100</span>
            </div>
            {/* Lead Score Progress Bar */}
            <div className="w-full bg-whatsapp-input rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  customer.leadScore >= 80 ? "bg-red-500" : customer.leadScore >= 50 ? "bg-orange-500" : "bg-blue-500"
                }`}
                style={{ width: `${customer.leadScore ?? 0}%` }}
              ></div>
            </div>
          </div>

          {/* Purchase Probability Progress Bar */}
          <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-whatsapp-text mb-2.5">
              <span className="flex items-center gap-1.5"><IoRibbonOutline className="text-emerald-400 w-4 h-4" /> Purchase Probability</span>
              <span className="text-sm font-bold text-whatsapp-green">{customer.purchaseProbability ?? 0}%</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-whatsapp-input rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${customer.purchaseProbability ?? 0}%` }}
              ></div>
            </div>
          </div>

          {/* Intent, Sentiment, Priority Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3">
              <div className="text-[10px] text-whatsapp-gray uppercase tracking-wider mb-1 flex items-center gap-1">
                <IoHelpCircleOutline /> Intent
              </div>
              <div className="text-xs font-bold text-whatsapp-text truncate">
                {customer.intent || "Unknown"}
              </div>
            </div>

            <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3">
              <div className="text-[10px] text-whatsapp-gray uppercase tracking-wider mb-1 flex items-center gap-1">
                <IoPulseOutline /> Sentiment
              </div>
              <div>{getSentimentBadge(customer.sentiment)}</div>
            </div>

            <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3 col-span-2 flex items-center justify-between">
              <span className="text-[10px] text-whatsapp-gray uppercase tracking-wider">Follow-up Priority</span>
              <span>{getPriorityBadge(customer.priority)}</span>
            </div>
          </div>

          {/* Recommended Product */}
          {customer.recommendedProduct && (
            <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3">
              <div className="text-[10px] text-whatsapp-gray uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <IoFolderOpenOutline className="text-whatsapp-teal" /> Recommended Product
              </div>
              <div className="text-xs font-bold text-whatsapp-green bg-whatsapp-teal/10 border border-whatsapp-green/20 px-2.5 py-1.5 rounded-lg">
                {customer.recommendedProduct}
              </div>
            </div>
          )}

          {/* Conversation Summary */}
          {customer.summary && (
            <div className="bg-whatsapp-panel border border-whatsapp-border/10 rounded-xl p-3.5">
              <div className="text-[10px] text-whatsapp-gray uppercase tracking-wider mb-1.5">AI Conversation Summary</div>
              <p className="text-xs leading-relaxed text-whatsapp-gray italic bg-whatsapp-input/30 p-2.5 rounded-lg border border-whatsapp-border/10">
                "{customer.summary}"
              </p>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-center gap-1 text-[10px] text-whatsapp-gray pt-2">
            <IoTimeOutline className="w-3.5 h-3.5" />
            <span>Last Analyzed: {formatTime(customer.updatedAt)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
