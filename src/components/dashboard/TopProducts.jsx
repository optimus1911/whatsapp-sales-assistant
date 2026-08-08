import React from "react";
import { IoCubeOutline } from "react-icons/io5";

export default function TopProducts({ products, loading }) {
  return (
    <div className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-4 shadow-sm h-full flex flex-col justify-between select-none">
      <div>
        <h3 className="text-sm font-semibold text-whatsapp-text mb-3">Top Recommended Products</h3>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-whatsapp-gray text-xs">
            No product recommendations found yet.
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((prod, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2.5 bg-whatsapp-input/20 border border-whatsapp-border/10 rounded-lg hover:border-whatsapp-teal/30 hover:bg-whatsapp-input/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-1.5 bg-whatsapp-teal/15 text-whatsapp-green rounded-md flex-shrink-0">
                    <IoCubeOutline className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-whatsapp-text truncate">{prod.name}</span>
                </div>
                <div className="flex items-center space-x-1.5 ml-2">
                  <span className="text-[10px] font-semibold bg-whatsapp-teal/10 text-whatsapp-green px-2 py-0.5 rounded-full border border-whatsapp-green/20">
                    {prod.count} {prod.count === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
