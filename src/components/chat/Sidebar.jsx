import React, { useState, useMemo } from 'react';
import { IoNotificationsOutline, IoSettingsOutline, IoEllipsisVertical, IoSearchOutline, IoSpeedometerOutline, IoChatbubblesOutline, IoFilterOutline } from 'react-icons/io5';
import SearchBox from '../common/SearchBox';
import ChatItem from './ChatItem';
import { useCRM } from '../../context/CRMContext';

export default function Sidebar() {
  const { 
    customers, 
    loading, 
    activeCustomerId, 
    setActiveCustomerId: onSelectCustomer, 
    activeTab, 
    setActiveTab: onSelectTab 
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Multi-Filter States
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterIntent, setFilterIntent] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterOnline, setFilterOnline] = useState(false);

  // Combined Search and Multi-Filtering
  const filteredCustomers = useMemo(() => {
    return customers
      .map(c => ({
        id: c._id,
        name: c.name,
        avatar: c.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name)}`,
        phone: c.phone,
        lastMessage: c.lastMessage || 'No messages yet.',
        time: c.updatedAt 
          ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : '',
        unread: c.leadScore > 80 ? 1 : 0,
        online: c.online || false,
        leadStatus: c.leadStatus || 'Cold',
        sentiment: c.sentiment || '',
        priority: c.priority || 'Low',
        intent: c.intent || '',
        recommendedProduct: c.recommendedProduct || ''
      }))
      .filter(c => {
        // Search query filtering
        const normalizedSearchQuery = searchQuery.trim().toLowerCase();
        if (normalizedSearchQuery) {
          const nameMatch = c.name.toLowerCase().includes(normalizedSearchQuery);
          const phoneMatch = c.phone.includes(normalizedSearchQuery);
          const messageMatch = c.lastMessage?.toLowerCase().includes(normalizedSearchQuery);
          if (!nameMatch && !phoneMatch && !messageMatch) return false;
        }

        // Multi-Filter constraints check
        if (filterStatus && c.leadStatus !== filterStatus) return false;
        if (filterSentiment && c.sentiment.toLowerCase() !== filterSentiment.toLowerCase()) return false;
        if (filterPriority && c.priority.toLowerCase() !== filterPriority.toLowerCase()) return false;
        if (filterOnline && !c.online) return false;

        return true;
      });
  }, [customers, searchQuery, filterStatus, filterSentiment, filterPriority, filterOnline]);

  return (
    <div className="flex flex-col h-full bg-whatsapp-sidebar border-r border-whatsapp-border/40 w-full md:w-[340px] lg:w-[380px] flex-shrink-0 select-none">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between p-3 bg-whatsapp-panel border-b border-whatsapp-border/20">
        <div className="flex items-center space-x-3">
          {/* Business Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-whatsapp-teal/20 text-whatsapp-green font-bold text-lg select-none">
            SP
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-whatsapp-green rounded-full border border-whatsapp-panel animate-pulse" />
          </div>
          
          <div className="leading-tight">
            <h1 className="font-semibold text-sm text-whatsapp-text">SalesPilot-AI</h1>
            <p className="text-[10px] text-whatsapp-green flex items-center font-medium">
              Sales Intelligence CRM
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-1.5 text-whatsapp-gray">
          <button
            className="p-2 hover:bg-whatsapp-input rounded-full hover:text-white transition-colors duration-150 focus:outline-none"
            title="Notifications"
          >
            <IoNotificationsOutline className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSelectTab && onSelectTab('settings')}
            className="p-2 hover:bg-whatsapp-input rounded-full hover:text-white transition-colors duration-150 focus:outline-none"
            title="Settings"
          >
            <IoSettingsOutline className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-whatsapp-input rounded-full hover:text-white transition-colors duration-150 focus:outline-none"
            title="Menu"
          >
            <IoEllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Switch Navigation Menu */}
      <div className="flex border-b border-whatsapp-border/15 p-2 bg-whatsapp-sidebar gap-1 select-none flex-shrink-0">
        <button
          onClick={() => onSelectTab && onSelectTab('dashboard')}
          className={`flex items-center justify-center gap-2 flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'dashboard'
              ? 'bg-whatsapp-teal/20 text-whatsapp-green border border-whatsapp-green/10'
              : 'text-whatsapp-gray hover:bg-whatsapp-panel hover:text-whatsapp-text'
          }`}
        >
          <IoSpeedometerOutline className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('chat');
          }}
          className={`flex items-center justify-center gap-2 flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'chat'
              ? 'bg-whatsapp-teal/20 text-whatsapp-green border border-whatsapp-green/10'
              : 'text-whatsapp-gray hover:bg-whatsapp-panel hover:text-whatsapp-text'
          }`}
        >
          <IoChatbubblesOutline className="w-4 h-4" />
          <span>Chats</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-3 py-2 bg-whatsapp-sidebar flex items-center space-x-2 border-b border-whatsapp-border/10 flex-shrink-0">
        <div className="flex-1">
          <SearchBox
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-all duration-200 focus:outline-none ${
            showFilters || filterStatus || filterSentiment || filterPriority || filterOnline
              ? "bg-whatsapp-teal/20 border-whatsapp-green/45 text-whatsapp-green"
              : "bg-whatsapp-input border-whatsapp-border/20 text-whatsapp-gray hover:text-white"
          }`}
          title="Toggle search filters"
        >
          <IoFilterOutline className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <div className="px-3.5 py-3 bg-whatsapp-panel border-b border-whatsapp-border/30 text-xs text-whatsapp-text grid grid-cols-2 gap-3.5 select-none flex-shrink-0 animate-slide-in">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] text-whatsapp-gray block mb-1">Lead Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-whatsapp-input text-white rounded border border-whatsapp-border/20 p-1.5 focus:outline-none text-[11px] cursor-pointer"
            >
              <option value="">All</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="text-[10px] text-whatsapp-gray block mb-1">Sentiment</label>
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="w-full bg-whatsapp-input text-white rounded border border-whatsapp-border/20 p-1.5 focus:outline-none text-[11px] cursor-pointer"
            >
              <option value="">All</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[10px] text-whatsapp-gray block mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-whatsapp-input text-white rounded border border-whatsapp-border/20 p-1.5 focus:outline-none text-[11px] cursor-pointer"
            >
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Online Checkbox */}
          <div className="flex items-center space-x-2 pt-4">
            <input
              type="checkbox"
              id="online-only-toggle"
              checked={filterOnline}
              onChange={(e) => setFilterOnline(e.target.checked)}
              className="rounded bg-whatsapp-input border-whatsapp-border/30 text-whatsapp-teal focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
            />
            <label htmlFor="online-only-toggle" className="text-[11px] font-medium text-whatsapp-text cursor-pointer select-none">Online Only</label>
          </div>

          {/* Clear Filters Option */}
          <div className="col-span-2 pt-2 border-t border-whatsapp-border/10 flex justify-end">
            <button
              onClick={() => {
                setFilterStatus('');
                setFilterSentiment('');
                setFilterPriority('');
                setFilterOnline(false);
              }}
              className="text-[10px] text-whatsapp-green font-semibold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Customer Conversation List */}
      <div className="flex-1 overflow-y-auto bg-whatsapp-sidebar divide-y divide-whatsapp-border/10">
        {loading && filteredCustomers.length === 0 ? (
          <div className="flex items-center justify-center p-8 h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <ChatItem
              key={customer.id}
              customer={customer}
              isActive={activeCustomerId === customer.id}
              onClick={() => {
                onSelectCustomer(customer.id);
                if (onSelectTab) onSelectTab('chat');
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center h-64 select-none">
            <div className="p-4 bg-whatsapp-panel rounded-full text-whatsapp-gray mb-4 flex items-center justify-center">
              <IoSearchOutline className="w-8 h-8 opacity-70" />
            </div>
            <h2 className="text-whatsapp-text font-semibold text-base mb-1">
              No Customers Found
            </h2>
            <p className="text-whatsapp-gray text-xs max-w-[240px] leading-relaxed">
              We couldn't find any results matching your search or active filters. Try clearing them to reset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
