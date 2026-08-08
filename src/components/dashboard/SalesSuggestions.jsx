import React from "react";
import { IoAlertCircle, IoCallOutline, IoMailOutline, IoCardOutline, IoPeopleOutline, IoChatbubblesOutline } from "react-icons/io5";

export default function SalesSuggestions({ customers, loading }) {
  const generateSuggestions = () => {
    if (!customers || customers.length === 0) return [];
    
    const suggestionsList = [];

    customers.forEach(cust => {
      // Rule 1: High Priority + Hot Lead
      if (cust.leadStatus === "Hot" && cust.priority === "High") {
        suggestionsList.push({
          id: `sug-hot-${cust._id}`,
          title: `Urgent follow-up: ${cust.name}`,
          description: `Customer has a score of ${cust.leadScore}. Call them directly at ${cust.phone} to close.`,
          icon: IoCallOutline,
          iconColor: "text-red-400 bg-red-500/10 border-red-500/20",
          urgency: 3
        });
      }

      // Rule 2: Purchase Probability >= 80%
      if ((cust.purchaseProbability || 0) >= 80) {
        suggestionsList.push({
          id: `sug-prob-${cust._id}`,
          title: `Send payment checkout link`,
          description: `High purchase intent (${cust.purchaseProbability}%) detected for ${cust.name} on ${cust.recommendedProduct || 'product'}.`,
          icon: IoCardOutline,
          iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          urgency: 2
        });
      }

      // Rule 3: Pricing Intent
      if (cust.intent && cust.intent.toLowerCase().includes("price") || cust.intent.toLowerCase().includes("pricing")) {
        suggestionsList.push({
          id: `sug-price-${cust._id}`,
          title: `Provide quote/catalog to ${cust.name}`,
          description: `Inquired about pricing. Share detailed product catalogs and pricing models.`,
          icon: IoMailOutline,
          iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          urgency: 2
        });
      }

      // Rule 4: Positive Sentiment
      if (cust.sentiment === "Positive" && cust.leadStatus === "Warm") {
        suggestionsList.push({
          id: `sug-sent-${cust._id}`,
          title: `Schedule product demo for ${cust.name}`,
          description: `Customer is displaying positive sentiment. Nurture the conversation to upgrade to a Hot lead.`,
          icon: IoPeopleOutline,
          iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          urgency: 1
        });
      }
    });

    // Fallback standard suggestion if list is short
    if (suggestionsList.length < 3) {
      suggestionsList.push({
        id: "sug-fallback-1",
        title: "Standard Follow-Up Check",
        description: "Verify follow-up tasks for all Warm leads who haven't responded in 24 hours.",
        icon: IoChatbubblesOutline,
        iconColor: "text-whatsapp-teal bg-whatsapp-teal/10 border-whatsapp-teal/20",
        urgency: 1
      });
    }

    // Sort by urgency DESC and limit to 4 suggestions
    return suggestionsList.sort((a, b) => b.urgency - a.urgency).slice(0, 4);
  };

  const suggestions = generateSuggestions();

  return (
    <div className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-4 shadow-sm h-full flex flex-col justify-between select-none">
      <div>
        <h3 className="text-sm font-semibold text-whatsapp-text mb-3 flex items-center gap-1.5">
          <IoAlertCircle className="text-whatsapp-green animate-pulse" /> AI Sales Playbook Suggestions
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 text-whatsapp-gray text-xs">
            No sales suggestions available.
          </div>
        ) : (
          <div className="space-y-2.5">
            {suggestions.map((sug) => {
              const Icon = sug.icon;
              return (
                <div 
                  key={sug.id} 
                  className="p-3 bg-whatsapp-input/10 border border-whatsapp-border/10 rounded-lg hover:border-whatsapp-teal/30 hover:bg-whatsapp-input/20 transition-all duration-200"
                >
                  <div className="flex items-start space-x-3 text-xs leading-normal">
                    <div className={`p-2 rounded-lg flex-shrink-0 border ${sug.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-whatsapp-text font-bold truncate">{sug.title}</div>
                      <div className="text-whatsapp-gray text-[10px] leading-tight mt-0.5 break-words">{sug.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
