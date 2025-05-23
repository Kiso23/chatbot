import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Inbox, Star, Archive, Trash, Settings, ChevronRight } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';

interface SidebarThreadListProps {
  onSelectConversation: (id: string) => void;
  onOpenSettings: () => void;
}

const SidebarThreadList: React.FC<SidebarThreadListProps> = ({ onSelectConversation, onOpenSettings }) => {
  const { conversations, activeConversationId, filter, setFilter } = useConversationStore();
  
  const filteredConversations = conversations.filter(conversation => {
    switch (filter) {
      case 'starred':
        return conversation.isStarred && !conversation.isTrash;
      case 'archived':
        return conversation.isArchived && !conversation.isTrash;
      case 'trash':
        return conversation.isTrash;
      default:
        return !conversation.isArchived && !conversation.isTrash && !conversation.isStarred;
    }
  });
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations"
            className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      </div>
      
      <nav className="p-3 border-b border-gray-200">
        <ul className="space-y-1">
          <motion.li
            whileHover={{ x: 4 }}
            onClick={() => setFilter('inbox')}
            className={`sidebar-item flex items-center justify-between ${filter === 'inbox' ? 'active' : ''}`}
          >
            <div className="flex items-center">
              <Inbox className="w-5 h-5 mr-3" />
              <span>Inbox</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </motion.li>
          <motion.li
            whileHover={{ x: 4 }}
            onClick={() => setFilter('starred')}
            className={`sidebar-item flex items-center justify-between ${filter === 'starred' ? 'active' : ''}`}
          >
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-3" />
              <span>Starred</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </motion.li>
          <motion.li
            whileHover={{ x: 4 }}
            onClick={() => setFilter('archived')}
            className={`sidebar-item flex items-center justify-between ${filter === 'archived' ? 'active' : ''}`}
          >
            <div className="flex items-center">
              <Archive className="w-5 h-5 mr-3" />
              <span>Archived</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </motion.li>
          <motion.li
            whileHover={{ x: 4 }}
            onClick={() => setFilter('trash')}
            className={`sidebar-item flex items-center justify-between ${filter === 'trash' ? 'active' : ''}`}
          >
            <div className="flex items-center">
              <Trash className="w-5 h-5 mr-3" />
              <span>Trash</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </motion.li>
          <motion.li
            whileHover={{ x: 4 }}
            onClick={onOpenSettings}
            className="sidebar-item flex items-center justify-between"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </motion.li>
        </ul>
      </nav>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </h2>
          
          <AnimatePresence>
            {filteredConversations.map((conversation) => (
              <motion.li
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectConversation(conversation.id)}
                className={`cursor-pointer rounded-md p-3 ${activeConversationId === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
              >
                <div className="flex items-start">
                  <img 
                    src={conversation.customer.avatar} 
                    alt={conversation.customer.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-sm font-medium truncate ${conversation.isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conversation.customer.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-1 ${conversation.isUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      {conversation.isStarred && (
                        <span className="text-yellow-500">
                          <Star className="w-3 h-3" />
                        </span>
                      )}
                      {conversation.isUnread && (
                        <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SidebarThreadList;