import React, { useState } from 'react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('open-tickets');

  // Sample ticket data for each tab
  const ticketData = {
    'open-tickets': [
      {
        id: 1,
        leadName: 'Sophia Clark',
        complaintSummary: 'Issue with recent order delivery',
        status: 'AI Handling',
        statusColor: 'bg-blue-100 text-blue-800'
      },
      {
        id: 2,
        leadName: 'Ethan Bennett',
        complaintSummary: 'Payment not reflecting in account',
        status: 'Escalated',
        statusColor: 'bg-yellow-100 text-yellow-800'
      },
      {
        id: 3,
        leadName: 'Olivia Carter',
        complaintSummary: 'Refund request for damaged product',
        status: 'AI Handling',
        statusColor: 'bg-blue-100 text-blue-800'
      },
      {
        id: 4,
        leadName: 'Liam Foster',
        complaintSummary: 'Technical issue with software defect',
        status: 'Resolved',
        statusColor: 'bg-green-100 text-green-800'
      },
      {
        id: 5,
        leadName: 'Ava Faster',
        complaintSummary: 'Inquiry about product availability',
        status: 'AI Handling',
        statusColor: 'bg-blue-100 text-blue-800'
      }
    ],
    'ai-solved': [
      {
        id: 1,
        leadName: 'Sophia Clark',
        complaintSummary: 'Issue with recent order delivery',
        status: 'AI Solved',
        statusColor: 'bg-green-100 text-green-800'
      },
      {
        id: 3,
        leadName: 'Olivia Carter',
        complaintSummary: 'Refund request for damaged product',
        status: 'AI Solved',
        statusColor: 'bg-green-100 text-green-800'
      },
      {
        id: 5,
        leadName: 'Ava Faster',
        complaintSummary: 'Inquiry about product availability',
        status: 'AI Solved',
        statusColor: 'bg-green-100 text-green-800'
      }
    ],
    'human-intervention': [
      {
        id: 6,
        leadName: 'Emily Harper',
        complaintSummary: 'Issue with recent order delivery',
        status: 'Escalated',
        statusColor: 'bg-yellow-100 text-yellow-800'
      },
      {
        id: 7,
        leadName: 'Chloe Bennett',
        complaintSummary: 'Refund request for damaged product',
        status: 'Escalated',
        statusColor: 'bg-yellow-100 text-yellow-800'
      },
      {
        id: 8,
        leadName: 'Isabella Hayes',
        complaintSummary: 'Inquiry about product availability',
        status: 'Escalated',
        statusColor: 'bg-yellow-100 text-yellow-800'
      }
    ],
    'closed-tickets': [
      {
        id: 9,
        leadName: 'Sophia Carter',
        complaintSummary: 'Issue with recent order delivery',
        status: 'Resolved',
        statusColor: 'bg-green-100 text-green-800'
      },
      {
        id: 10,
        leadName: 'Olivia Turner',
        complaintSummary: 'Refund request for damaged product',
        status: 'Resolved',
        statusColor: 'bg-green-100 text-green-800'
      },
      {
        id: 11,
        leadName: 'Ava Mitchell',
        complaintSummary: 'Inquiry about product availability',
        status: 'Resolved',
        statusColor: 'bg-green-100 text-green-800'
      }
    ]
  };

  const tabs = [
    { id: 'open-tickets', label: 'Open Tickets' },
    { id: 'ai-solved', label: 'AI Solved Tickets' },
    { id: 'human-intervention', label: 'Human Intervention' },
    { id: 'closed-tickets', label: 'Closed Tickets' }
  ];

  const renderChatLogs = () => {
    if (activeTab === 'open-tickets') {
      return (
        <div className="mt-8 bg-white rounded-lg border">
          {/* Chat Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold">Chat with Sophia Clark</h3>
            <p className="text-sm text-gray-500">Order #123456789 - Issue with recent order delivery</p>
          </div>
          
          {/* Chat Messages */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {/* Support Bot Message 1 */}
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-blue-600 rounded-lg p-3 shadow-sm max-w-md">
                <p className="text-sm text-white">
                  I'm sorry to hear about the issue with your order. Can you please provide your order number so I can investigate further?
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Sophia Clark Message 1 */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 shadow-sm max-w-md">
                <p className="text-sm text-gray-800">
                  Sure, my order number is #123456789.
                </p>
              </div>
            </div>
            
            {/* Support Bot Message 2 */}
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-blue-600 rounded-lg p-3 shadow-sm max-w-md">
                <p className="text-sm text-white">
                  Thank you. I'm checking the status of your order now. Please allow me a moment.
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Support Bot Message 3 */}
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-blue-600 rounded-lg p-3 shadow-sm max-w-md">
                <p className="text-sm text-white">
                  It appears there was a delivery error. I've initiated a re-delivery for your order. You should receive it within 2-3 business days. I'll also send you an email with the updated tracking information.
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Sophia Clark Message 2 */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 shadow-sm max-w-md">
                <p className="text-sm text-gray-800">
                  Thank you so much for your help!
                </p>
              </div>
            </div>
          </div>
          
          {/* Message Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Support & Ticketing</h1>
      </div>
      
      {/* Main Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
          <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
          >
                {tab.label}
          </button>
            ))}
        </nav>
      </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tickets Table */}
          <div className="bg-white rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ticketData[activeTab].map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.leadName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.complaintSummary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.statusColor}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Chat/Call Logs - Only show for Open Tickets */}
          {renderChatLogs()}
          </div>
      </div>
    </div>
  );
};

export default Support;
