import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, X, Moon, Sun } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { useAuthStore } from '../store/authStore';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageComposerProps {
  conversationId: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuthStore();
  const { addMessage, isDarkMode, toggleDarkMode } = useConversationStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const handleSuggestion = (event: CustomEvent<{ content: string }>) => {
      setMessage(event.detail.content);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };
    
    document.addEventListener('useSuggestion', handleSuggestion as EventListener);
    return () => {
      document.removeEventListener('useSuggestion', handleSuggestion as EventListener);
    };
  }, []);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (message) {
      setIsTyping(true);
      timeout = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(timeout);
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !selectedFile) || !user) return;
    
    const attachments = selectedFile ? [{
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
      type: selectedFile.type
    }] : undefined;

    addMessage(conversationId, {
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: message.trim(),
      attachments
    });
    
    setMessage('');
    setSelectedFile(null);
    
    setTimeout(() => {
      const responses = [
        "Thanks for the information! That helps a lot.",
        "I understand now. When will this be fixed?",
        "Could you explain that in more detail please?",
        "I appreciate your quick response!",
        "Great, that's exactly what I needed to know."
      ];
      
      const { conversations } = useConversationStore.getState();
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (!conversation) return;
      
      addMessage(conversationId, {
        senderId: conversation.customer.id,
        senderName: conversation.customer.name,
        senderAvatar: conversation.customer.avatar,
        content: responses[Math.floor(Math.random() * responses.length)],
      });
    }, 3000);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex items-end bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 resize-none focus:outline-none max-h-32 bg-transparent dark:text-white"
            rows={1}
          />
          
          {isTyping && (
            <div className="absolute bottom-full left-4 mb-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs text-gray-500 dark:text-gray-300"
              >
                typing...
              </motion.div>
            </div>
          )}

          {selectedFile && (
            <div className="flex items-center px-2 py-1 mx-2 bg-blue-50 dark:bg-blue-900 rounded">
              <span className="text-sm text-blue-600 dark:text-blue-300">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="p-2 flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button 
              type="button"
              onClick={handleFileSelect}
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="relative" ref={emojiPickerRef}>
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Smile className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full right-0 mb-2"
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={onEmojiSelect}
                      theme={isDarkMode ? 'dark' : 'light'}
                      previewPosition="none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <motion.button
              type="submit"
              disabled={!message.trim() && !selectedFile}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1 rounded-md ${
                message.trim() || selectedFile
                  ? 'text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900'
                  : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;