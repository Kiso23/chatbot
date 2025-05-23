import { create } from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isInternalFlagged?: boolean;
  isStarred?: boolean;
  isBlocked?: boolean;
  isReported?: boolean;
  attachments?: { name: string; url: string; type: string }[];
}

export interface Conversation {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  messages: Message[];
  lastMessage: string;
  timestamp: Date;
  isUnread: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isTrash: boolean;
  isBlocked?: boolean;
  isReported?: boolean;
  summary?: string;
}

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  filter: 'inbox' | 'starred' | 'archived' | 'trash';
  isDarkMode: boolean;
  setActiveConversation: (id: string) => void;
  setFilter: (filter: 'inbox' | 'starred' | 'archived' | 'trash') => void;
  addMessage: (conversationId: string, message: Partial<Message>) => void;
  flagMessage: (conversationId: string, messageId: string) => void;
  starMessage: (conversationId: string, messageId: string) => void;
  starConversation: (conversationId: string) => void;
  moveToTrash: (conversationId: string) => void;
  restoreFromTrash: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  generateSummary: (conversationId: string) => void;
  toggleDarkMode: () => void;
  blockConversation: (conversationId: string) => void;
  reportConversation: (conversationId: string) => void;
}

const createDummyData = (): Conversation[] => {
  const conversations = [
    {
      id: '1',
      customer: {
        id: '101',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '1001',
          senderId: '101',
          senderName: 'John Doe',
          senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Hi there! I\'m having an issue with my recent order #12345.',
          timestamp: new Date(Date.now() - 3600000 * 2),
          isStarred: false,
        },
        {
          id: '1002',
          senderId: '1',
          senderName: 'Sarah Connor',
          senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Hello John! I\'m sorry to hear that. Could you please provide more details about the issue you\'re experiencing?',
          timestamp: new Date(Date.now() - 3600000),
          isStarred: false,
        }
      ],
      lastMessage: 'Hello John! I\'m sorry to hear that. Could you please provide more details about the issue you\'re experiencing?',
      timestamp: new Date(Date.now() - 3600000),
      isUnread: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      summary: 'Customer is having issues with order #12345.'
    },
    {
      id: '2',
      customer: {
        id: '102',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '2001',
          senderId: '102',
          senderName: 'Emma Wilson',
          senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Hello! I need help with my subscription renewal 🔄',
          timestamp: new Date(Date.now() - 7200000),
          isStarred: true,
        }
      ],
      lastMessage: 'Hello! I need help with my subscription renewal 🔄',
      timestamp: new Date(Date.now() - 7200000),
      isUnread: false,
      isStarred: true,
      isArchived: false,
      isTrash: false,
      summary: 'Discussion about subscription renewal.'
    },
    {
      id: '3',
      customer: {
        id: '103',
        name: 'Michael Chen',
        email: 'michael@example.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '3001',
          senderId: '103',
          senderName: 'Michael Chen',
          senderAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'The new update is amazing! Just wanted to share some feedback 🌟',
          timestamp: new Date(Date.now() - 14400000),
          isStarred: true,
        }
      ],
      lastMessage: 'The new update is amazing! Just wanted to share some feedback 🌟',
      timestamp: new Date(Date.now() - 14400000),
      isUnread: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      summary: 'Positive feedback about the recent update.'
    },
    {
      id: '4',
      customer: {
        id: '104',
        name: 'Sofia Rodriguez',
        email: 'sofia@example.com',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '4001',
          senderId: '104',
          senderName: 'Sofia Rodriguez',
          senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Can you help me with the API integration? 🔧',
          timestamp: new Date(Date.now() - 28800000),
          isStarred: false,
        }
      ],
      lastMessage: 'Can you help me with the API integration? 🔧',
      timestamp: new Date(Date.now() - 28800000),
      isUnread: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      summary: 'Technical support request for API integration.'
    },
    {
      id: '5',
      customer: {
        id: '105',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '5001',
          senderId: '105',
          senderName: 'Alex Thompson',
          senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Looking to upgrade my plan. What options do you recommend? 📈',
          timestamp: new Date(Date.now() - 43200000),
          isStarred: false,
        }
      ],
      lastMessage: 'Looking to upgrade my plan. What options do you recommend? 📈',
      timestamp: new Date(Date.now() - 43200000),
      isUnread: false,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      summary: 'Plan upgrade inquiry and recommendations.'
    },
    {
      id: '6',
      customer: {
        id: '106',
        name: 'Emily Parker',
        email: 'emily@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '6001',
          senderId: '106',
          senderName: 'Emily Parker',
          senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Having trouble with the export feature. Nothing happens when I click export. 😕',
          timestamp: new Date(Date.now() - 57600000),
          isStarred: false,
        }
      ],
      lastMessage: 'Having trouble with the export feature. Nothing happens when I click export. 😕',
      timestamp: new Date(Date.now() - 57600000),
      isUnread: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      summary: 'Technical issue with export functionality.'
    },
    {
      id: '7',
      customer: {
        id: '107',
        name: 'David Kim',
        email: 'david@example.com',
        avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '7001',
          senderId: '107',
          senderName: 'David Kim',
          senderAvatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Just wanted to say your customer service is outstanding! 🌟',
          timestamp: new Date(Date.now() - 72000000),
          isStarred: true,
        }
      ],
      lastMessage: 'Just wanted to say your customer service is outstanding! 🌟',
      timestamp: new Date(Date.now() - 72000000),
      isUnread: false,
      isStarred: true,
      isArchived: false,
      isTrash: false,
      summary: 'Positive feedback about customer service.'
    },
    {
      id: '8',
      customer: {
        id: '108',
        name: 'Sarah Miller',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      messages: [
        {
          id: '8001',
          senderId: '108',
          senderName: 'Sarah Miller',
          senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Need urgent help with password reset! 🔑',
          timestamp: new Date(Date.now() - 86400000),
          isStarred: false,
        }
      ],
      lastMessage: 'Need urgent help with password reset! 🔑',
      timestamp: new Date(Date.now() - 86400000),
      isUnread: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      summary: 'Urgent password reset assistance required.'
    }
  ];

  return conversations;
};

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: createDummyData(),
  activeConversationId: null,
  filter: 'inbox',
  isDarkMode: false,
  
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  setFilter: (filter) => set({ filter }),
  
  addMessage: (conversationId, messageData) => {
    const { conversations } = get();
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: messageData.senderId || '1',
      senderName: messageData.senderName || 'Sarah Connor',
      senderAvatar: messageData.senderAvatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: messageData.content || '',
      timestamp: new Date(),
      isInternalFlagged: messageData.isInternalFlagged || false,
      isStarred: false,
      attachments: messageData.attachments || [],
    };
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastMessage: newMessage.content,
          timestamp: newMessage.timestamp,
          isUnread: newMessage.senderId !== '1',
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  flagMessage: (conversationId, messageId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        const updatedMessages = conversation.messages.map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              isInternalFlagged: !message.isInternalFlagged,
            };
          }
          return message;
        });
        
        return {
          ...conversation,
          messages: updatedMessages,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  starMessage: (conversationId, messageId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        const updatedMessages = conversation.messages.map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              isStarred: !message.isStarred,
            };
          }
          return message;
        });
        
        return {
          ...conversation,
          messages: updatedMessages,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  starConversation: (conversationId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          isStarred: !conversation.isStarred,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  moveToTrash: (conversationId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          isTrash: true,
          isArchived: false,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  restoreFromTrash: (conversationId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          isTrash: false,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  archiveConversation: (conversationId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          isArchived: !conversation.isArchived,
          isTrash: false,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },
  
  generateSummary: (conversationId) => {
    const { conversations } = get();
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const summaries = [
      `${conversation.customer.name} is having issues with their recent order and needs assistance with Premium Plan features.`,
      `Customer reported problems accessing Premium features after upgrading their subscription.`,
      `Discussion about order #12345 and access to Premium Plan features that aren't showing up in the customer's account.`
    ];
    
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
    
    const updatedConversations = conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          summary: randomSummary,
        };
      }
      return c;
    });
    
    set({ conversations: updatedConversations });
  },

  toggleDarkMode: () => {
    const { isDarkMode } = get();
    const newDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', newDarkMode);
    set({ isDarkMode: newDarkMode });
  },

  blockConversation: (conversationId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          isBlocked: !conversation.isBlocked,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  },

  reportConversation: (conversationId) => {
    const { conversations } = get();
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          isReported: !conversation.isReported,
        };
      }
      return conversation;
    });
    
    set({ conversations: updatedConversations });
  }
}));