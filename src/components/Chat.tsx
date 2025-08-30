import React, { useState } from 'react'
import './Chat.css'
import './Chat.css'

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, isUser: true }])
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'AI response: ' + input, isUser: false }])
      }, 1000)
      setInput('')
    }
  }

  return (
    <div className="chat">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          Chat with AI
        </button>
      )}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.isUser ? 'user-message' : 'ai-message'}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about wedding ideas..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
