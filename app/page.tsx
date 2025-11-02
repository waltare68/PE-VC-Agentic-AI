'use client';
import { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
//Main Home Component
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // const sendMessage = async (): Promise<void> => {
  //   if (!input.trim()) return;
    
  //   const userMessage: Message = { 
  //     text: input, 
  //     sender: 'user', 
  //     timestamp: new Date() 
  //   };
  //   setMessages(prev => [...prev, userMessage]);
  //   setInput('');
  //   setLoading(true);

  //   // TODO: Replace with actual API call to Bedrock Agent
  //   setTimeout(() => {
  //     const botMessage: Message = { 
  //       text: "This is a mock response from your PE/VC agent. Backend integration coming soon!", 
  //       sender: 'bot',
  //       timestamp: new Date()
  //     };
  //     setMessages(prev => [...prev, botMessage]);
  //     setLoading(false);
  //   }, 1500);
  // };
 const sendMessage = async (): Promise<void> => {
  if (!input.trim()) return;
  
  const userMessage: Message = { 
    text: input, 
    sender: 'user', 
    timestamp: new Date() 
  };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input
      }),
    });

    const data = await response.json();
    
    // Handle both success and error responses
    let botText: string;
    if (data.response) {
      botText = data.response;
    } else if (data.error) {
      botText = `Error: ${data.error}`;
    } else {
      botText = "I couldn't process that request.";
    }
    
    const botMessage: Message = { 
      text: botText, 
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    
  } catch (error) {
    const errorMessage: Message = { 
      text: "Sorry, I'm having trouble connecting. Please try again.", 
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestion = (question: string): void => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">PE/VC Analyst Agent</h1>
          <p className="text-gray-600 mt-2">
            Ask about venture capital terminology,Get Company Info and get Financial Data Analysis
          </p>
        </div>
      </div>   

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-thin">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">💼</div>
                <p className="text-lg font-medium">Welcome to your PE/VC Assistant</p>
                <p className="mt-2">Ask about company data, term analysis, valuations, or venture capital terms</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>Analyzing your PE/VC question...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - FIXED FOR LIGHT MODE */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about company data, term analysis, valuations, or venture capital terms..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>

        {/* Quick Question Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => quickQuestion("Tell me about Tesla")}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-900">🏢 Get Company Data</div>
          </button>
          <button
            onClick={() => quickQuestion("What is a SAFE agreement?")}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-900">What is a SAFE agreement?</div>
          </button>
          <button
            onClick={() => quickQuestion("Explain liquidation preference")}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-900">Explain liquidation preference</div>
          </button>
          <button
            onClick={() => quickQuestion("Calculate valuation for a SaaS company with $1M revenue growing at 40%")}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
          >
            <div className="text-sm font-medium text-gray-900">Simple Saas Valuation</div>
          </button>
        </div>
      </div>
    </div>
  );
}