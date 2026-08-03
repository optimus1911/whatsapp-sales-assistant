import React, { useState, useEffect, useRef } from 'react'
import { IoHappyOutline, IoAttachOutline, IoSend, IoMicOutline, IoCheckmarkDone, IoCheckmark } from 'react-icons/io5'
import Avatar from '../common/Avatar'
import { getCustomerById, getMessagesByCustomer, createMessage } from '../../services/chatService'

export default function ChatArea({ activeCustomerId }) {
  const [customer, setCustomer] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll to the bottom of the message feed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load customer metadata and message logs from MongoDB when activeCustomerId changes
  useEffect(() => {
    if (!activeCustomerId) return

    const loadChatData = async () => {
      setLoading(true)
      try {
        const [customerRes, messagesRes] = await Promise.all([
          getCustomerById(activeCustomerId),
          getMessagesByCustomer(activeCustomerId)
        ])

        if (customerRes.success) {
          setCustomer(customerRes.data)
        }
        if (messagesRes.success) {
          setMessages(messagesRes.data)
        }
      } catch (err) {
        console.error('Failed to load chat details:', err)
      } finally {
        setLoading(false)
      }
    }

    loadChatData()
  }, [activeCustomerId])

  // Scroll down whenever new messages are loaded or appended
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle message post submission
  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim() || !activeCustomerId) return

    const textToSend = inputText
    setInputText('')

    try {
      const res = await createMessage(activeCustomerId, 'customer', textToSend)
      if (res.success) {
        // Optimistically append the sent message in real-time
        setMessages((prev) => [...prev, res.data])
      }
    } catch (err) {
      console.error('Failed to send message to server:', err)
    }
  }

  // Render format for message timestamps
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!activeCustomerId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-dark text-whatsapp-gray text-sm">
        Select a customer thread to start chatting
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-whatsapp-dark relative">
      
      {/* Active Conversation Header */}
      {customer && (
        <div className="flex items-center justify-between px-4 py-2 bg-whatsapp-panel border-b border-whatsapp-border/20 z-10">
          <div className="flex items-center space-x-3">
            <Avatar
              src={customer.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(customer.name)}`}
              name={customer.name}
              online={customer.online}
              size="md"
            />
            <div>
              <h2 className="text-sm font-semibold text-whatsapp-text">{customer.name}</h2>
              <p className="text-[10px] text-whatsapp-gray">
                {customer.online ? 'online' : customer.lastSeen || 'offline'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message Feed Display */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-whatsapp-dark/95 to-whatsapp-dark/99 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isOutgoing = msg.sender === 'customer'
            return (
              <div
                key={msg._id || msg.id || Math.random()}
                className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div
                  className={`relative max-w-[65%] rounded-lg px-3 py-1.5 shadow-sm text-sm ${
                    isOutgoing
                      ? 'bg-whatsapp-outgoing text-white rounded-tr-none'
                      : 'bg-whatsapp-incoming text-white rounded-tl-none'
                  }`}
                >
                  {/* Message body */}
                  <p className="pr-14 break-words leading-relaxed">{msg.message}</p>
                  
                  {/* Timestamp and Read Receipts */}
                  <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-[9px] text-whatsapp-gray/80 select-none">
                    <span>{formatTime(msg.timestamp || msg.createdAt)}</span>
                    {isOutgoing && (
                      msg.status === 'read' ? (
                        <IoCheckmarkDone className="text-whatsapp-blue w-3.5 h-3.5" />
                      ) : msg.status === 'delivered' ? (
                        <IoCheckmarkDone className="text-whatsapp-gray w-3.5 h-3.5" />
                      ) : (
                        <IoCheckmark className="text-whatsapp-gray w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex items-center justify-center h-full text-whatsapp-gray text-xs select-none">
            No messages in this chat yet.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Text Input Bar */}
      <form onSubmit={handleSend} className="px-4 py-2 bg-whatsapp-panel flex items-center space-x-3 z-10">
        <div className="flex items-center space-x-2 text-whatsapp-gray">
          <button type="button" className="p-1 hover:text-white transition-colors" title="Emojis">
            <IoHappyOutline className="w-6 h-6" />
          </button>
          <button type="button" className="p-1 hover:text-white transition-colors" title="Attachments">
            <IoAttachOutline className="w-6 h-6 rotate-45" />
          </button>
        </div>

        {/* Input box */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-whatsapp-input text-white rounded-lg px-4 py-2 text-sm focus:outline-none border-none placeholder-whatsapp-gray"
        />

        {/* Submit or Voice action buttons */}
        <div className="text-whatsapp-gray">
          {inputText.trim() ? (
            <button
              type="submit"
              className="p-2 bg-whatsapp-teal text-white rounded-full hover:bg-whatsapp-teal/80 transition-colors"
              title="Send message"
            >
              <IoSend className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" className="p-1.5 hover:text-white transition-colors" title="Voice record">
              <IoMicOutline className="w-6 h-6" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}