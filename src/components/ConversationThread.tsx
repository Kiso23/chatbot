import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Archive, Trash, MoreVertical, RefreshCw, Ban, Flag } from 'lucide-react';
import MessageComposer from './MessageComposer';
import SummaryBox from './SummaryBox';
import InternalFlagBadge from './InternalFlagBadge';
import { Conversation, useConversationStore } from '../store/conversationStore';

interface ConversationThreadProps {
  conversation: Conversation;
}

const ConversationThread: React.FC<ConversationThreadProps> = ({ conversation }) => {
  const { 
    generateSummary, 
    starMessage, 
    starConversation,
    moveToTrash,
    archiveConversation,
    blockConversation,
    reportConversation
  } = useConversationStore();
  
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              src={conversation.customer.avatar} 
              alt={conversation.customer.name} 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{conversation.customer.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.customer.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => starConversation(conversation.id)}
              className={`p-2 rounded-full ${conversation.isStarred ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900' : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Star className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => archiveConversation(conversation.id)}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Archive className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => moveToTrash(conversation.id)}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash className="w-5 h-5" />
            </motion.button>
            
            <div className="relative" ref={moreMenuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MoreVertical className="w-5 h-5" />
              </motion.button>
              
              <AnimatePresence>
                {showMoreMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          blockConversation(conversation.id);
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        {conversation.isBlocked ? 'Unblock User' : 'Block User'}
                      </button>
                      <button
                        onClick={() => {
                          reportConversation(conversation.id);
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        {conversation.isReported ? 'Remove Report' : 'Report User'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {conversation.summary && (
        <SummaryBox 
          summary={conversation.summary} 
          onRefresh={() => generateSummary(conversation.id)} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {conversation.messages.map((message, index) => {
              const isCurrentUser = message.senderId === '1';
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs md:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} group`}>
                    <motion.img 
                      whileHover={{ scale: 1.1 }}
                      src={message.senderAvatar} 
                      alt={message.senderName} 
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className={`mx-2 relative ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {message.isInternalFlagged && isCurrentUser && (
                        <InternalFlagBadge />
                      )}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className={`rounded-2xl px-4 py-3 ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white dark:bg-blue-600' 
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </motion.div>
                      <div className={`text-xs mt-1 flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-gray-500 dark:text-gray-400">{formatMessageTime(message.timestamp)}</span>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => starMessage(conversation.id, message.id)}
                          className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                            message.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <MessageComposer conversationId={conversation.id} />
    </div>
  );
};

export default ConversationThread;