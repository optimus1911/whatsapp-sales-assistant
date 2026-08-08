import React from "react";
import Avatar from "../common/Avatar";

export default function RecentInsights({ insights, loading }) {
  const getProgressBar = (percentage) => {
    const pct = percentage || 0;
    const blocks = Math.round(pct / 10);
    const filled = "█".repeat(blocks);
    const empty = "░".repeat(10 - blocks);
    return `${filled}${empty} ${pct}%`;
  };

  const getStatusBadge = (status) => {
    const s = status || "Cold";
    if (s === "Hot") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Hot Lead</span>;
    if (s === "Warm") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">Warm Lead</span>;
    return <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Cold Lead</span>;
  };

  const getSentimentBadge = (sentiment) => {
    const s = sentiment || "Neutral";
    if (s === "Positive") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Positive</span>;
    if (s === "Negative") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Negative</span>;
    return <span className="px-2 py-0.5 text-[10px] font-semibold bg-whatsapp-input text-whatsapp-gray rounded-full border border-whatsapp-border/30">Neutral</span>;
  };

  const getPriorityBadge = (prio) => {
    const p = prio || "Low";
    if (p === "High") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">High</span>;
    if (p === "Medium") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">Medium</span>;
    return <span className="px-2 py-0.5 text-[10px] font-semibold bg-whatsapp-input text-whatsapp-gray rounded-full border border-whatsapp-border/30">Low</span>;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " " + date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-5 shadow-sm select-none">
      <h3 className="text-sm font-semibold text-whatsapp-text mb-4">Recent AI Insights</h3>
      
      {loading ? (
        <div className="flex items-center justify-center p-8 h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-12 text-whatsapp-gray text-xs">
          No AI insights available yet.<br/>
          <span className="text-[10px] opacity-75">Start a WhatsApp conversation to begin collecting customer intelligence.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-whatsapp-border/10 text-whatsapp-gray font-medium">
                <th className="pb-3 font-normal">Customer</th>
                <th className="pb-3 font-normal text-center">Lead Score</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal">Intent</th>
                <th className="pb-3 font-normal">Sentiment</th>
                <th className="pb-3 font-normal text-center">Priority</th>
                <th className="pb-3 font-normal">Probability</th>
                <th className="pb-3 font-normal">Recommended Product</th>
                <th className="pb-3 font-normal text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-whatsapp-border/10 text-whatsapp-text">
              {insights.map((insight, index) => (
                <tr key={insight._id || index} className="hover:bg-whatsapp-input/10 transition-colors">
                  <td className="py-3 flex items-center space-x-2">
                    <Avatar 
                      name={insight.name} 
                      imageUrl={insight.profilePicture} 
                      size="sm"
                    />
                    <span className="font-semibold">{insight.name}</span>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-whatsapp-green">
                    {insight.leadScore ?? 0}
                  </td>
                  <td className="py-3">
                    {getStatusBadge(insight.leadStatus)}
                  </td>
                  <td className="py-3 truncate max-w-[120px] font-medium text-whatsapp-text">
                    {insight.intent || "Unknown"}
                  </td>
                  <td className="py-3">
                    {getSentimentBadge(insight.sentiment)}
                  </td>
                  <td className="py-3 text-center">
                    {getPriorityBadge(insight.priority)}
                  </td>
                  <td className="py-3 font-mono text-[10px] text-whatsapp-green">
                    {getProgressBar(insight.purchaseProbability)}
                  </td>
                  <td className="py-3 truncate max-w-[140px] text-whatsapp-gray">
                    {insight.recommendedProduct || "N/A"}
                  </td>
                  <td className="py-3 text-right text-[10px] text-whatsapp-gray">
                    {formatTime(insight.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
