import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Zap, MessageSquare, Edit3, Settings } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { useAISuggestionsStore } from '../store/aiSuggestionsStore';

interface AICoPilotPanelProps {
  conversationId: string;
}

const AICoPilotPanel: React.FC<AICoPilotPanelProps> = ({ conversationId }) => {
  const { conversations } = useConversationStore();
  const { 
    suggestions, 
    selectedTone, 
    isLoading, 
    generateSuggestions,
    setSelectedTone,
    regenerateSuggestions
  } = useAISuggestionsStore();
  
  const conversation = conversations.find(c => c.id === conversationId);
  
  // Generate suggestions when conversation changes
  useEffect(() => {
    if (conversation) {
      generateSuggestions(conversationId, conversation.messages);
    }
  }, [conversationId, conversation, generateSuggestions]);
  
  const handleToneChange = (tone: 'Formal' | 'Casual' | 'Friendly') => {
    setSelectedTone(tone);
  };
  
  if (!conversation) return null;
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-blue-50 border-b border-blue-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-500" />
            AI Co-pilot
          </h2>
          <button 
            onClick={() => regenerateSuggestions(conversationId, conversation.messages)}
            className="p-1 rounded-md hover:bg-blue-100 text-blue-500"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-sm text-blue-700">Smart suggestions based on conversation context</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Tone Selector */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Edit3 className="w-4 h-4 mr-1 text-gray-500" />
            Response Tone
          </h3>
          <div className="flex space-x-2">
            {(['Formal', 'Casual', 'Friendly'] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => handleToneChange(tone)}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedTone === tone 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
        
        {/* Suggestions */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-1 text-gray-500" />
            Smart Replies
          </h3>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-sm text-gray-500">Generating suggestions...</p>
              </motion.div>
            ) : suggestions.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <p className="text-sm text-gray-500">No suggestions available</p>
              </motion.div>
            ) : (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => {
                      const messageEvent = new CustomEvent('useSuggestion', {
                        detail: { content: suggestion.content }
                      });
                      document.dispatchEvent(messageEvent);
                    }}
                  >
                    <p className="text-sm">{suggestion.content}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Context Analysis */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Settings className="w-4 h-4 mr-1 text-gray-500" />
            Context Analysis
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500 block">Customer Sentiment</span>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Priority</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  High
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Topic</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                  Billing
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Account
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoPilotPanel;