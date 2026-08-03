import React, { useState, useEffect } from 'react'
import { IoNotificationsOutline, IoSettingsOutline, IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5'
import SearchBox from '../common/SearchBox'
import ChatItem from './ChatItem'
import { getCustomers } from '../../services/chatService'

export default function Sidebar({ activeCustomerId, onSelectCustomer }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch customers from MongoDB Atlas on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomers()
        if (res.success && res.data.length > 0) {
          // Map MongoDB schema fields to ChatItem props
          const mapped = res.data.map(c => ({
            id: c._id,
            name: c.name,
            avatar: c.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name)}`,
            phone: c.phone,
            lastMessage: c.lastMessage || 'No messages yet.',
            time: c.updatedAt 
              ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : '',
            unread: c.leadScore > 80 ? 1 : 0, // simple mock calculation for unread indicators
            online: c.online || false,
            leadStatus: c.leadStatus || 'Cold'
          }))
          setCustomers(mapped)

          // Auto-select the first customer if no active ID exists
          if (!activeCustomerId) {
            onSelectCustomer(mapped[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load customers from backend:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [activeCustomerId, onSelectCustomer])

  // Filter customers based on search query
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredCustomers = normalizedSearchQuery 
    ? customers.filter(customer => {
        const nameMatch = customer.name.toLowerCase().includes(normalizedSearchQuery)
        const phoneMatch = customer.phone.includes(normalizedSearchQuery)
        const messageMatch = customer.lastMessage?.toLowerCase().includes(normalizedSearchQuery)
        return nameMatch || phoneMatch || messageMatch
      })
    : customers

  return (
    <div className="flex flex-col h-full bg-whatsapp-sidebar border-r border-whatsapp-border/40 w-full md:w-[340px] lg:w-[380px] flex-shrink-0">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between p-3 bg-whatsapp-panel border-b border-whatsapp-border/20">
        <div className="flex items-center space-x-3">
          {/* Business Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-whatsapp-teal/20 text-whatsapp-green font-bold text-lg select-none">
            TW
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-whatsapp-green rounded-full border border-whatsapp-panel animate-pulse" />
          </div>
          
          <div className="leading-tight">
            <h1 className="font-semibold text-sm text-whatsapp-text">TechWorld</h1>
            <p className="text-[10px] text-whatsapp-green flex items-center font-medium">
              AI Sales Assistant
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-1.5 text-whatsapp-gray">
          <button
            className="p-2 hover:bg-whatsapp-input rounded-full hover:text-white transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-whatsapp-teal/30"
            title="Notifications"
            aria-label="Toggle notifications"
          >
            <IoNotificationsOutline className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-whatsapp-input rounded-full hover:text-white transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-whatsapp-teal/30"
            title="Settings"
            aria-label="Open settings"
          >
            <IoSettingsOutline className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-whatsapp-input rounded-full hover:text-white transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-whatsapp-teal/30"
            title="Menu"
            aria-label="More options"
          >
            <IoEllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBox
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search customer..."
      />

      {/* Customer Conversation List */}
      <div className="flex-1 overflow-y-auto bg-whatsapp-sidebar divide-y divide-whatsapp-border/10">
        {loading ? (
          <div className="flex items-center justify-center p-8 h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <ChatItem
              key={customer.id}
              customer={customer}
              isActive={activeCustomerId === customer.id}
              onClick={() => onSelectCustomer(customer.id)}
            />
          ))
        ) : (
          /* High-Fidelity Empty State */
          <div className="flex flex-col items-center justify-center p-8 text-center h-64 select-none">
            <div className="p-4 bg-whatsapp-panel rounded-full text-whatsapp-gray mb-4 flex items-center justify-center">
              <IoSearchOutline className="w-8 h-8 opacity-70" />
            </div>
            <h2 className="text-whatsapp-text font-semibold text-base mb-1">
              No Customers Found
            </h2>
            <p className="text-whatsapp-gray text-xs max-w-[240px] leading-relaxed">
              We couldn't find any results matching "{searchQuery}". Please verify the name or phone number.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
