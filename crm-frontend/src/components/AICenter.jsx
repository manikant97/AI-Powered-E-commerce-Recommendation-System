import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  UserCircleIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  LinkIcon,
  ArrowPathIcon as RefreshIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusClasses = {
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'Missed': 'bg-red-100 text-red-800 border-red-200',
    'Call Initiated': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'default': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status] || statusClasses['default']}`}>
      {status}
    </span>
  );
};

// Sample data for WhatsApp Conversations
const whatsappChats = [
  {
    id: 1,
    leadName: 'Emma Wilson',
    lastMessage: 'Thanks for the information!',
    time: '2023-07-09T11:20:00',
    unread: true,
    messages: [
      { sender: 'ai', text: 'Hello Emma! How can I help you today?', time: '2023-07-09T10:15:00' },
      { sender: 'lead', text: 'Hi! I was looking for more details about your enterprise plan.', time: '2023-07-09T10:16:00' },
      { sender: 'ai', text: 'Sure! I can provide you with all the details about our enterprise plan. Here are the key features...', time: '2023-07-09T10:16:30' },
      { sender: 'lead', text: 'Thanks for the information!', time: '2023-07-09T11:20:00' }
    ]
  },
  {
    id: 2,
    leadName: 'David Kim',
    lastMessage: 'When will the new features be available?',
    time: '2023-07-09T09:45:00',
    unread: false,
    messages: []
  }
];

// Sample data for Scheduled Follow-ups
const scheduledFollowUps = [
  {
    id: 1,
    leadName: 'Robert Taylor',
    scheduledTime: '2023-07-10T14:00:00',
    type: 'Call',
    purpose: 'Follow up on demo request',
    status: 'Scheduled'
  },
  {
    id: 2,
    leadName: 'Lisa Wong',
    scheduledTime: '2023-07-11T11:30:00',
    type: 'Email',
    purpose: 'Send proposal',
    status: 'Pending'
  },
  {
    id: 3,
    leadName: 'James Wilson',
    scheduledTime: '2023-07-09T16:00:00',
    type: 'WhatsApp',
    purpose: 'Check interest in new feature',
    status: 'Overdue'
  }
];

const AICenter = () => {
  const [activeTab, setActiveTab] = useState('ai-calls');
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch call logs from the backend
  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view call logs');
      }

      const response = await api.get('/customers/calls/logs');

      setCallLogs(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching call logs:', err);
      setError('Failed to load call logs. Please try again.');
      setCallLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai-calls') {
      fetchCallLogs();
    }
  }, [activeTab]);

  const [selectedCall, setSelectedCall] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [showFollowUpDetails, setShowFollowUpDetails] = useState(false);
  const [message, setMessage] = useState(''); // Initialize with empty string

  const handleCallSelect = (call) => {
    setSelectedCall(call);
    setShowCallDetails(true);
    setShowChatWindow(false);
    setShowFollowUpDetails(false);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatWindow(true);
    setShowCallDetails(false);
    setShowFollowUpDetails(false);
  };

  const handleFollowUpSelect = (followUp) => {
    setSelectedFollowUp(followUp);
    setShowFollowUpDetails(true);
    setShowCallDetails(false);
    setShowChatWindow(false);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // In a real app, this would send the message to the server
    console.log('Sending message:', message);
    setMessage('');
  };

  const handleReschedule = (followUpId, newTime) => {
    // In a real app, this would update the scheduled time on the server
    console.log(`Rescheduling follow-up ${followUpId} to ${newTime}`);
    setShowFollowUpDetails(false);
  };

  const handleForceHuman = (interactionId) => {
    // In a real app, this would trigger a human to take over
    console.log(`Requesting human override for interaction ${interactionId}`);
  };

  const markFollowUpDone = (followUpId) => {
    // In a real app, this would update the status on the server
    console.log(`Marking follow-up ${followUpId} as done`);
    setShowFollowUpDetails(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Calling & Messaging Center</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ai-calls')}
            className={`${activeTab === 'ai-calls' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <PhoneIcon className="h-5 w-5 mr-2" />
            AI Calls Log
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`${activeTab === 'whatsapp' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            WhatsApp Conversations
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`${activeTab === 'followups' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Scheduled Follow-ups
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - List */}
        <div className={`${(showCallDetails || showChatWindow || showFollowUpDetails) ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          {activeTab === 'ai-calls' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Call Logs</h2>
                <button
                  onClick={fetchCallLogs}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <RefreshIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : callLogs.length === 0 ? (
                <div className="text-center py-12">
                  <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No call logs found</h3>
                  <p className="mt-1 text-sm text-gray-500">Initiating calls will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {callLogs.map((log) => (
                    <div key={log._id || log.callId} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{log.customerName || 'Unknown Caller'}</h3>
                          {log.customerPhone && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <PhoneIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              {log.customerPhone}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {log.timestamp && !isNaN(new Date(log.timestamp)) 
                              ? format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')
                              : 'Invalid Date'}
                          </p>
                        </div>
                        <div>
                          <StatusBadge status={log.status || 'Unknown'} />
                        </div>
                      </div>

                      {(log.event || log.notes) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {log.event && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Event:</span> {log.event}
                            </p>
                          )}
                          {log.notes && (
                            <p className="mt-1 text-sm text-gray-600">{log.notes}</p>
                          )}
                        </div>
                      )}

                      {log.duration > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Duration:</span> {Math.floor(log.duration / 60)}m {log.duration % 60}s
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">WhatsApp Conversations</h3>
                <p className="mt-1 text-sm text-gray-500">Active and past conversations</p>
              </div>
              <ul className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {whatsappChats.map((chat) => (
                  <li
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedChat?.id === chat.id ? 'bg-indigo-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{chat.leadName}</p>
                      {chat.unread && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <p className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                        {new Date(chat.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'followups' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Scheduled Follow-ups</h3>
                <p className="mt-1 text-sm text-gray-500">Upcoming and overdue follow-ups</p>
              </div>
              <ul className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {scheduledFollowUps.map((followUp) => (
                  <li 
                    key={followUp.id}
                    onClick={() => handleFollowUpSelect(followUp)}
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedFollowUp?.id === followUp.id ? 'bg-indigo-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{followUp.leadName}</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        followUp.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        followUp.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {followUp.status}
                      </span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600">{followUp.purpose}</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                        {new Date(followUp.scheduledTime).toLocaleString()}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {followUp.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Right side - Details */}
        {(showCallDetails || showChatWindow || showFollowUpDetails) && (
          <div className="lg:col-span-2">
            {showCallDetails && selectedCall && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Call Details - {selectedCall.leadName}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleForceHuman(selectedCall.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <UserCircleIcon className="h-4 w-4 mr-1" />
                        Human Override
                      </button>
                      <button
                        onClick={() => setShowCallDetails(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Call {selectedCall.status.toLowerCase()} • {new Date(selectedCall.time).toLocaleString()}
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">CALL OUTCOME</h4>
                    <p className={`text-sm px-3 py-1 inline-flex rounded-full ${
                      selectedCall.outcome === 'Interested' ? 'bg-green-100 text-green-800' :
                      selectedCall.outcome === 'Not Interested' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCall.outcome}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">AI CALL SUMMARY</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedCall.summary}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">SENT DOCUMENTS</h4>
                    <div className="space-y-2">
                      {selectedCall.documents.length > 0 ? (
                        selectedCall.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{doc}</span>
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                              View
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No documents were sent during this call.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">PRODUCT LINKS SHARED</h4>
                    <div className="space-y-2">
                      {selectedCall.productLinks.length > 0 ? (
                        selectedCall.productLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-indigo-600 truncate max-w-xs">
                                {link}
                              </span>
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                              Open
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No product links were shared during this call.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {showChatWindow && selectedChat && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-[calc(100vh-180px)]">
                <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Chat with {selectedChat.leadName}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleForceHuman(selectedChat.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-1" />
                      Human Override
                    </button>
                    <button
                      onClick={() => setShowChatWindow(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Chat messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {selectedChat.messages && selectedChat.messages.length > 0 ? (
                    <div className="space-y-4">
                      {selectedChat.messages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div 
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === 'ai' 
                                ? 'bg-white border border-gray-200' 
                                : 'bg-indigo-600 text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === 'ai' ? 'text-gray-400' : 'text-indigo-100'
                            }`}>
                              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {showFollowUpDetails && selectedFollowUp && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Follow-up Details
                    </h3>
                    <button
                      onClick={() => setShowFollowUpDetails(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">LEAD</h4>
                    <p className="text-sm text-gray-900">{selectedFollowUp.leadName}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">TYPE</h4>
                    <p className="text-sm text-gray-900">{selectedFollowUp.type}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">PURPOSE</h4>
                    <p className="text-sm text-gray-900">{selectedFollowUp.purpose}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">SCHEDULED TIME</h4>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">
                        {new Date(selectedFollowUp.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">ACTIONS</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          const newTime = prompt('Enter new date and time:', new Date(selectedFollowUp.scheduledTime).toISOString().slice(0, 16));
                          if (newTime) {
                            handleReschedule(selectedFollowUp.id, newTime);
                          }
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Reschedule
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to mark this follow-up as done?')) {
                            markFollowUpDone(selectedFollowUp.id);
                          }
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Mark as Done
                      </button>
                      
                      <button
                        onClick={() => handleForceHuman(selectedFollowUp.id)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <UserCircleIcon className="h-4 w-4 mr-2" />
                        Request Human Override
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AICenter;
