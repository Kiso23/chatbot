import { create } from 'zustand';
import { Message } from './conversationStore';

type ToneType = 'Formal' | 'Casual' | 'Friendly';

interface Suggestion {
  id: string;
  content: string;
  tone: ToneType;
}

interface AISuggestionsState {
  suggestions: Suggestion[];
  selectedTone: ToneType;
  isLoading: boolean;
  generateSuggestions: (conversationId: string, messages: Message[]) => void;
  setSelectedTone: (tone: ToneType) => void;
  regenerateSuggestions: (conversationId: string, messages: Message[]) => void;
}

export const useAISuggestionsStore = create<AISuggestionsState>((set, get) => ({
  suggestions: [],
  selectedTone: 'Casual',
  isLoading: false,
  
  generateSuggestions: (conversationId, messages) => {
    set({ isLoading: true });
    
    // Simulate API call delay
    setTimeout(() => {
      const tone = get().selectedTone;
      const lastUserMessage = messages.filter(m => m.senderId !== '1').pop();
      
      if (!lastUserMessage) {
        set({ 
          suggestions: [],
          isLoading: false 
        });
        return;
      }
      
      // Generate suggestions based on the tone and last message
      const newSuggestions = generateResponsesByTone(lastUserMessage.content, tone);
      
      set({ 
        suggestions: newSuggestions,
        isLoading: false 
      });
    }, 1000);
  },
  
  setSelectedTone: (tone) => {
    set({ selectedTone: tone, isLoading: true });
    
    // Regenerate suggestions with the new tone (simulated delay)
    setTimeout(() => {
      const suggestions = get().suggestions;
      if (suggestions.length === 0) {
        set({ isLoading: false });
        return;
      }
      
      // Take the first suggestion and regenerate based on the new tone
      const firstSuggestion = suggestions[0];
      const newSuggestions = generateResponsesByTone(firstSuggestion.content, tone);
      
      set({ 
        suggestions: newSuggestions,
        isLoading: false 
      });
    }, 800);
  },
  
  regenerateSuggestions: (conversationId, messages) => {
    set({ isLoading: true });
    
    // Simulate API call delay
    setTimeout(() => {
      const tone = get().selectedTone;
      const lastUserMessage = messages.filter(m => m.senderId !== '1').pop();
      
      if (!lastUserMessage) {
        set({ 
          suggestions: [],
          isLoading: false 
        });
        return;
      }
      
      // Generate new suggestions
      const newSuggestions = generateResponsesByTone(lastUserMessage.content, tone, true);
      
      set({ 
        suggestions: newSuggestions,
        isLoading: false 
      });
    }, 1000);
  },
}));

// Helper function to generate responses based on the selected tone
function generateResponsesByTone(message: string, tone: ToneType, forceNew = false): Suggestion[] {
  const formalResponses = [
    "I understand your concern regarding this matter. Our team is investigating the issue and will resolve it promptly.",
    "Thank you for bringing this to our attention. We'll review your account and ensure all Premium features are properly activated.",
    "We apologize for the inconvenience. Your satisfaction is our priority, and we'll address this issue immediately."
  ];
  
  const casualResponses = [
    "Got it! We're looking into this right now and will get those Premium features working for you soon.",
    "Thanks for letting us know! We'll check your account and fix the access issue right away.",
    "Sorry about that! We'll sort out the Premium access problem and get back to you quickly."
  ];
  
  const friendlyResponses = [
    "Hey there! I'm really sorry you're having trouble with the Premium features. Let me fix that for you right away! 😊",
    "Oh no! That's definitely not supposed to happen. I'll personally make sure your Premium access is working perfectly! ✨",
    "I totally understand how frustrating that must be! Don't worry, I'm on it and will make sure you get all your Premium goodies ASAP! 👍"
  ];
  
  let responses: string[] = [];
  
  switch (tone) {
    case 'Formal':
      responses = formalResponses;
      break;
    case 'Casual':
      responses = casualResponses;
      break;
    case 'Friendly':
      responses = friendlyResponses;
      break;
  }
  
  // Shuffle the responses if forcing new ones
  if (forceNew) {
    responses = [...responses].sort(() => Math.random() - 0.5);
  }
  
  // Create suggestion objects
  return responses.map((content, index) => ({
    id: `suggestion-${Date.now()}-${index}`,
    content,
    tone
  }));
}