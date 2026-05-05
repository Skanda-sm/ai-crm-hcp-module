import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, addMessage, updateField } from '../redux/interactionSlice';
import { Send, Bot, User, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const { chatHistory, loading, formData } = useSelector((state) => state.interaction);
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    dispatch(addMessage(input));
    dispatch(sendMessage({ message: input, currentFormData: formData }));
    setInput('');
  };

  const suggestions = [
    "Log a meeting with Dr. Smith",
    "Add outcomes for today's call",
    "Suggest follow-ups",
    "Search for cardiology HCPs"
  ];

  return (
    <div className="sidebar-ai">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '10px' }}>
            <Sparkles size={20} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Assistant</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powered by Gemma-2 9B</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', padding: '0 1rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--bg-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Bot size={32} color="var(--primary-light)" />
            </div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600 }}>Welcome to HCP Assistant</h4>
            <p style={{ fontSize: '0.875rem' }}>Describe your interaction naturally. I'll automatically extract details and populate the form for you.</p>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(s)}
                  style={{ 
                    background: 'white', 
                    border: '1px solid var(--border)', 
                    padding: '0.75rem 1rem', 
                    fontSize: '0.8125rem',
                    textAlign: 'left',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  {s} <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {chatHistory.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-assistant'}`}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex',
                gap: '8px'
              }}
            >
              {msg.role === 'assistant' && <Bot size={16} style={{ marginTop: '3px', flexShrink: 0 }} />}
              <div>{msg.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <div style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: '12px' }}>
              <Loader2 size={16} className="animate-spin" />
            </div>
            AI is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {chatHistory.length > 0 && (
        <div style={{ padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
           {["Log this", "Summarize topics", "Next steps"].map(label => (
             <button key={label} onClick={() => { setInput(label); handleSend(); }} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '20px' }}>
               {label}
             </button>
           ))}
        </div>
      )}

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'white' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              paddingRight: '3.5rem', 
              height: '3.5rem', 
              borderRadius: 'var(--radius-lg)',
              borderWidth: '2px'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: input.trim() ? 'var(--primary)' : 'var(--bg-main)',
              color: input.trim() ? 'white' : 'var(--text-muted)',
              padding: '10px',
              borderRadius: '50%'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
