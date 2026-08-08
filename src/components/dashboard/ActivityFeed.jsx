import React from "react";
import { IoFlame, IoChatbubbleOutline, IoCube, IoTrendingUp, IoHappy, IoWarning, IoPersonAdd, IoPulse } from "react-icons/io5";

export default function ActivityFeed({ events, loading }) {
  const getEventIcon = (type) => {
    switch (type) {
      case "hot-lead":
        return <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><IoFlame className="w-4 h-4 animate-pulse" /></div>;
      case "message":
        return <div className="p-2 bg-whatsapp-teal/20 text-whatsapp-green rounded-lg"><IoChatbubbleOutline className="w-4 h-4" /></div>;
      case "recommendation":
        return <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-lg"><IoCube className="w-4 h-4" /></div>;
      case "score-up":
        return <div className="p-2 bg-amber-500/15 text-amber-400 rounded-lg"><IoTrendingUp className="w-4 h-4" /></div>;
      case "sentiment":
        return <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-lg"><IoHappy className="w-4 h-4" /></div>;
      case "priority":
        return <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><IoWarning className="w-4 h-4 animate-bounce" /></div>;
      case "new-user":
        return <div className="p-2 bg-blue-500/15 text-blue-400 rounded-lg"><IoPersonAdd className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 bg-whatsapp-input text-whatsapp-gray rounded-lg"><IoPulse className="w-4 h-4" /></div>;
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const diff = new Date() - date;
    const mins = Math.floor(diff / 60000);
    
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-4 shadow-sm h-full flex flex-col justify-between select-none">
      <div>
        <h3 className="text-sm font-semibold text-whatsapp-text mb-4">CRM Activity Feed</h3>
        
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-whatsapp-gray text-xs">
            No activity logged yet.
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {events.map((event, index) => (
              <div key={event.id || index} className="flex items-start space-x-3 text-xs leading-normal">
                <div className="flex-shrink-0">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-whatsapp-text font-medium break-words">
                    {event.description}
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-whatsapp-gray">
                    <span className="font-semibold text-whatsapp-teal">{event.customerName}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
