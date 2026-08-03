import React from 'react'
import { motion } from 'framer-motion'
import Avatar from '../common/Avatar'
import { LEAD_STATUS } from '../../constants/leadStatus'

export default function ChatItem({ customer, isActive, onClick }) {
  const { name, avatar, lastMessage, time, unread, online, leadStatus } = customer

  return (
    <motion.div
      onClick={onClick}
      className={`relative flex items-center justify-between p-3 cursor-pointer select-none transition-colors border-b border-whatsapp-border/30 ${
        isActive ? 'bg-whatsapp-panel' : 'hover:bg-whatsapp-panel/50'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      {/* Selection Left Accent Bar */}
      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute left-0 top-0 bottom-0 w-[4px] bg-whatsapp-green"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}

      <div className="flex items-center space-x-3 min-w-0 flex-1">
        {/* Avatar with online status */}
        <Avatar src={avatar} name={name} online={online} size="md" />

        {/* Message preview and name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-whatsapp-text text-sm truncate mr-2">
              {name}
            </h3>
            <span className={`text-xs ${unread > 0 ? 'text-whatsapp-green font-semibold' : 'text-whatsapp-gray'}`}>
              {time}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className={`text-xs truncate ${unread > 0 ? 'text-white font-medium' : 'text-whatsapp-gray'}`}>
              {lastMessage}
            </p>

            <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
              {/* Lead status badge */}
              {leadStatus && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${LEAD_STATUS[leadStatus] || LEAD_STATUS.Cold}`}>
                  {leadStatus}
                </span>
              )}

              {/* Unread count badge */}
              {unread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-whatsapp-green text-whatsapp-dark text-[10px] font-bold"
                >
                  {unread}
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
