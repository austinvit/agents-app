import React, { useState, useRef, useEffect } from 'react';
import Layout from "../components/Layout";
import { Send, FileSpreadsheet, Calendar, AlertCircle, CheckCircle2, Loader2, Clock } from 'lucide-react';

export default function SalesReportChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your aged hardware report assistant. I can generate hardware lifecycle reports at any time',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cil={
    "Hubspot":[
      'dealOwner','itemValue','TeamToDeliver', 'companyName','closeDate',
      'forecastaProbability','itemValue','TeamToDeliver', 'companyName','closeDate',
    ]
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    console.log(process.env.NEXT_PUBLIC_HARDWARE_SERVER_HOST)

    try {
      // Call backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_HARDWARE_SERVER_HOST}/api/get-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        status: data.status,
        fileUrl: data.file_url,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('API Error:', error);
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting to the server. Please try again in a moment.',
        status: 'error',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'no_data':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'awaiting_dates':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Report Generated';
      case 'error':
        return 'Error';
      case 'no_data':
        return 'No Data Found';
      case 'awaiting_dates':
        return 'Need More Information';
      default:
        return '';
    }
  };

  const handleQuickAction = (text) => {
    if (isLoading) return;
    setInput(text);
    inputRef.current?.focus();
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
        style={{
          animation: 'fadeIn 0.3s ease-in'
        }}
      >
        <div className={`flex max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 sm:gap-3`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'
          }`}>
            {isUser ? (
              <span className="text-white font-semibold text-xs sm:text-sm">You</span>
            ) : (
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </div>

          {/* Message bubble */}
          <div className="flex flex-col">
            <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
              isUser 
                ? 'bg-blue-500 text-white rounded-tr-none shadow-lg' 
                : 'bg-gray-800 text-gray-100 rounded-tl-none shadow-lg border border-gray-700'
            }`}>
              {/* Status indicator */}
              {message.status && !isUser && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
                  {getStatusIcon(message.status)}
                  <span className="text-xs sm:text-sm font-medium">
                    {getStatusText(message.status)}
                  </span>
                </div>
              )}

              {/* Message content */}
              <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                {message.content}
              </div>

              {/* File link */}
              {message.fileUrl && (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-all hover:shadow-lg active:scale-95"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="text-sm font-medium">Open Report</span>
                </a>
              )}
            </div>

            {/* Timestamp */}
            <span className={`text-xs text-gray-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <FileSpreadsheet className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">Aged Hardware Report Agent</h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">Generate reports for aged customer hardware</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          {messages.map((message, index) => renderMessage(message, index))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-gray-300 text-sm">Processing your request...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

{/* Quick actions */}
      <div className="px-4 sm:px-6 py-2 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => handleQuickAction('Show me hardware report for Summerlea School')}
              className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-xs sm:text-sm transition-all hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
              disabled={isLoading}
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1.5" />
              Summerlea School
            </button>
            <button
              onClick={() => handleQuickAction('Get me hardware report for all devices')}
              className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-xs sm:text-sm transition-all hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
              disabled={isLoading}
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1.5" />
              All Devices
            </button>
            
          </div>
        </div>
      </div>

    

      {/* Input area */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a hardware lifecycle report..."
              className="flex-1 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 text-sm sm:text-base transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline text-sm sm:text-base">Send</span>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex items-center gap-2"
            >

                {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline text-sm sm:text-base">Get Hardware Report</span>
            
                </>
              )}


            </button> */}
            {/* <Send className="w-4 h-4 sm:w-5 sm:h-5" /> */}
          
          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {/* Try: "Sales report for October 1-15" or "Show me last month's sales" */}
          </p>
        </div>
      </div>
    </div>
    </Layout>
  );
}

