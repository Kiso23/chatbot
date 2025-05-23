import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import SidebarThreadList from '../components/SidebarThreadList';
import ConversationThread from '../components/ConversationThread';
import AICoPilotPanel from '../components/AICoPilotPanel';
import { useConversationStore } from '../store/conversationStore';
import { useAuthStore } from '../store/authStore';

const InboxPage: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversation } = useConversationStore();
  const { user, logout } = useAuthStore();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Select the first conversation if none is selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversation(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversation]);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close panels on mobile
      if (mobile) {
        setIsSidebarOpen(false);
        setIsAIPanelOpen(false);
      } else {
        setIsSidebarOpen(true);
        setIsAIPanelOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-3 p-1 rounded-md hover:bg-gray-100"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">Messaging Inbox</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isMobile && activeConversation && (
              <button
                onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                className="p-2 rounded-md bg-blue-50 text-blue-500 hover:bg-blue-100"
              >
                AI Co-pilot
              </button>
            )}
            
            <div className="flex items-center">
              {user && (
                <>
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover mr-2" 
                  />
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{user.name}</div>
                    <button 
                      onClick={logout}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`${isMobile ? 'absolute top-16 bottom-0 z-20 bg-white shadow-lg' : 'relative'} w-80 border-r border-gray-200 overflow-y-auto`}
            >
              <SidebarThreadList 
                onSelectConversation={(id) => {
                  setActiveConversation(id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Conversation */}
        <div className={`flex-1 flex ${isMobile ? 'overflow-hidden' : ''}`}>
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              <ConversationThread conversation={activeConversation} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to get started</p>
            </div>
          )}
        </div>
        
        {/* AI Co-pilot Panel */}
        <AnimatePresence>
          {isAIPanelOpen && activeConversation && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`${isMobile ? 'absolute top-16 bottom-0 right-0 z-20 bg-white shadow-lg' : 'relative'} w-80 border-l border-gray-200 overflow-y-auto`}
            >
              <AICoPilotPanel conversationId={activeConversation.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InboxPage;