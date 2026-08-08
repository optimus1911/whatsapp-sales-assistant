import React from "react";
import Avatar from "../common/Avatar";

export default function HotLeads({ customers, loading }) {
  // Sort by Lead Score DESC, filter only Hot status, and limit to 5
  const leads = [...customers]
    .filter(c => c.leadStatus === "Hot")
    .sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0))
    .slice(0, 5);

  const getProgressBar = (percentage) => {
    const pct = percentage || 0;
    const blocks = Math.round(pct / 10);
    const filled = "█".repeat(blocks);
    const empty = "░".repeat(10 - blocks);
    return `${filled}${empty} ${pct}%`;
  };

  const getPriorityBadge = (prio) => {
    const p = prio || "Low";
    if (p === "High") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">High</span>;
    if (p === "Medium") return <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">Medium</span>;
    return <span className="px-2 py-0.5 text-[10px] font-semibold bg-whatsapp-input text-whatsapp-gray rounded-full border border-whatsapp-border/30">Low</span>;
  };

  return (
    <div className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-4 shadow-sm h-full flex flex-col justify-between select-none">
      <div>
        <h3 className="text-sm font-semibold text-whatsapp-text mb-3">Hot Leads</h3>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-whatsapp-gray text-xs">
            No hot leads found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-whatsapp-border/10 text-whatsapp-gray font-medium">
                  <th className="pb-2 font-normal">Customer</th>
                  <th className="pb-2 font-normal text-center">Score</th>
                  <th className="pb-2 font-normal text-center">Priority</th>
                  <th className="pb-2 font-normal">Probability</th>
                  <th className="pb-2 font-normal">Product</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-whatsapp-border/10 text-whatsapp-text">
                {leads.map((lead, index) => (
                  <tr key={lead._id || index} className="hover:bg-whatsapp-input/20 transition-colors">
                    <td className="py-2.5 flex items-center space-x-2">
                      <Avatar 
                        name={lead.name} 
                        imageUrl={lead.profilePicture} 
                        size="sm"
                      />
                      <span className="font-medium">{lead.name}</span>
                    </td>
                    <td className="py-2.5 text-center font-bold text-red-400">
                      {lead.leadScore || 0}
                    </td>
                    <td className="py-2.5 text-center">
                      {getPriorityBadge(lead.priority)}
                    </td>
                    <td className="py-2.5 font-mono text-[10px] text-whatsapp-green">
                      {getProgressBar(lead.purchaseProbability)}
                    </td>
                    <td className="py-2.5 truncate max-w-[120px] text-whatsapp-gray">
                      {lead.recommendedProduct || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
