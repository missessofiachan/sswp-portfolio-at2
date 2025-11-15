import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as s from './helpChat.css';

/**
 * Chat mode enum for switching between quick navigation and AI help interfaces.
 *
 * @typedef {'navigation' | 'ai'} ChatMode
 */
type ChatMode = 'navigation' | 'ai';

/**
 * Message object structure for the AI chat interface.
 *
 * @interface Message
 * @property {string} id - Unique identifier for the message
 * @property {string} text - Message content/text
 * @property {boolean} isUser - Whether the message is from the user (true) or AI (false)
 * @property {Date} timestamp - When the message was created
 */
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * HelpChat Component
 *
 * A floating help widget that provides two modes of assistance:
 * 1. **Quick Navigation**: Direct links to key pages and contact actions
 * 2. **AI Help**: Interactive chat interface with smart contextual responses
 *
 * **Features:**
 * - Floating action button positioned in bottom-right corner
 * - Expandable help panel with mode switching
 * - AI responses based on keyword pattern matching
 * - Quick suggestions for common questions
 * - Accessibility support with ARIA labels and keyboard navigation
 * - Visual feedback for upload status and interactions
 * - Auto-scroll to latest messages in AI chat
 *
 * **Usage:**
 * This component is automatically included in the Footer and appears on all pages.
 * Users can click the chat button to open the help panel and switch between modes.
 *
 * **AI Help System:**
 * - Provides contextual responses for common support topics
 * - Simulates typing delay for natural conversation feel
 * - Includes quick suggestion buttons for common questions
 * - Falls back to directing users to human support for complex queries
 *
 * **Customization:**
 * - Update `helpOptions` array to modify quick navigation links
 * - Update `quickActions` array to modify instant action buttons
 * - Update `aiSuggestions` array to modify suggested questions
 * - Modify `getAIResponse` function to add new response patterns
 *
 * @component
 * @example
 * ```tsx
 * // Component is automatically included in Footer
 * import Footer from '@client/components/layout/Footer';
 *
 * function Layout() {
 *   return (
 *     <div>
 *       <main>...</main>
 *       <Footer /> // Includes HelpChat
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {JSX.Element} The help chat floating widget
 */
export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('navigation');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Help suggestions
  const aiSuggestions = [
    'How do I find handcrafted items?',
    "What's your return policy?",
    'How to contact customer support?',
    'Tell me about product categories',
    'How do I track my order?',
  ];

  // Simple AI response simulation
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes('product') ||
      lowerMessage.includes('handcraft') ||
      lowerMessage.includes('item')
    ) {
      return "I'd love to help you find the perfect handcrafted item! Browse our Products section to see our curated collection of artisan-made pieces. Each item has a detailed description and story.";
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return "Our return policy is customer-friendly! You can return items within 30 days if they're in original condition. Visit our Contact page for more details or to start a return.";
    }

    if (
      lowerMessage.includes('contact') ||
      lowerMessage.includes('support') ||
      lowerMessage.includes('help')
    ) {
      return 'You can reach our support team at hello@sofias.shop or call us at +61-3-9876-5432. We typically respond within 1 business day. You can also visit our Contact page for more options.';
    }

    if (
      lowerMessage.includes('track') ||
      lowerMessage.includes('order') ||
      lowerMessage.includes('shipping')
    ) {
      return 'To track your order, check your email for a tracking number sent when your item shipped. For order inquiries, please contact us with your order number.';
    }

    if (lowerMessage.includes('category') || lowerMessage.includes('type')) {
      return 'Our products include ceramics, textiles, woodwork, jewelry, and home décor - all handcrafted by local Australian artisans. Each category showcases unique techniques and stories.';
    }

    return "Thanks for your question! For the most accurate information, I'd recommend browsing our Products, About, or Contact pages. Our human support team is also available at hello@sofias.shop.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(inputValue),
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000
    ); // 1-2 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderAIChat = () => (
    <div className={s.aiChatContainer}>
      {messages.length === 0 && (
        <div className={s.aiSuggestions}>
          {aiSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              className={s.suggestionBtn}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className={s.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={message.isUser ? s.userMessage : s.aiMessage}>
            {message.text}
          </div>
        ))}
        {isTyping && <div className={s.aiMessage}>AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className={s.chatInput}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about Sofia's Shop..."
          className={s.inputField}
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className={s.sendBtn}
        >
          Send
        </button>
      </div>
    </div>
  );

  const helpOptions = [
    {
      title: 'Browse Products',
      description: 'Explore our handcrafted collection',
      link: '/products',
      icon: '🏺',
    },
    {
      title: 'Get Support',
      description: 'Contact our team for help',
      link: '/contact',
      icon: '💬',
    },
    {
      title: 'About Us',
      description: "Learn more about Sofia's Shop",
      link: '/about',
      icon: 'ℹ️',
    },
    {
      title: 'Admin Panel',
      description: 'Manage products and users',
      link: '/admin',
      icon: '⚙️',
    },
  ];

  const quickActions = [
    {
      title: 'Call us',
      action: () => window.open('tel:+61-3-9876-5432'),
      icon: '📞',
    },
    {
      title: 'Email support',
      action: () => window.open('mailto:hello@sofias.shop?subject=Support Request'),
      icon: '✉️',
    },
  ];

  return (
    <div className={s.container}>
      {isOpen && (
        <div className={s.helpPanel}>
          <div className={s.header}>
            <h3>How can we help?</h3>
            <button className={s.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close help">
              ×
            </button>
          </div>

          <div className={s.chatModes}>
            <button
              className={chatMode === 'navigation' ? s.activeModeBtn : s.modeBtn}
              onClick={() => setChatMode('navigation')}
            >
              Quick Links
            </button>
            <button
              className={chatMode === 'ai' ? s.activeModeBtn : s.modeBtn}
              onClick={() => setChatMode('ai')}
            >
              AI Help
            </button>
          </div>

          {chatMode === 'navigation' ? (
            <>
              <div className={s.section}>
                <h4 className={s.sectionTitle}>Quick Navigation</h4>
                <div className={s.options}>
                  {helpOptions.map((option) => (
                    <Link
                      key={option.title}
                      to={option.link}
                      className={s.option}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={s.icon}>{option.icon}</span>
                      <div>
                        <h4 className={s.optionTitle}>{option.title}</h4>
                        <p className={s.optionDescription}>{option.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className={s.section}>
                <h4 className={s.sectionTitle}>Quick Actions</h4>
                <div className={s.quickActions}>
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      className={s.actionBtn}
                      onClick={() => {
                        action.action();
                        setIsOpen(false);
                      }}
                    >
                      <span className={s.icon}>{action.icon}</span>
                      {action.title}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            renderAIChat()
          )}

          <div className={s.footer}>
            <p className={s.footerText}>
              Need more help?{' '}
              <Link to="/contact" className={s.footerLink}>
                Contact us directly
              </Link>
            </p>
          </div>
        </div>
      )}

      <button
        className={s.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close help' : 'Open help'}
        title="Need help? Click for quick assistance"
      >
        {isOpen ? '×' : chatMode === 'ai' ? '🤖' : '💬'}
      </button>
    </div>
  );
}
