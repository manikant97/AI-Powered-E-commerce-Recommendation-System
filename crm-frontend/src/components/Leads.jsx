import api from '../utils/api';
import {
    AdjustmentsHorizontalIcon,
    ArrowDownTrayIcon,
    ArrowTrendingUpIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CurrencyDollarIcon,
    EllipsisVerticalIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    PlusIcon,
    UserGroupIcon,
    XMarkIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [leadSource, setLeadSource] = useState('All');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date()
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiForm, setAiForm] = useState({
    location: '',
    businessType: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // State for expanded columns
  const [expandedColumns, setExpandedColumns] = useState({
    untouched: true,
    hpl: true,
    mpl: true,
    lpl: true,
    ul: true,
    customer: true,
    ticket: true
  });

  // Toggle column expansion
  const toggleColumn = (columnId) => {
    setExpandedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  // Toggle all columns
  const toggleAllColumns = (expand) => {
    const newState = {};
    Object.keys(expandedColumns).forEach(key => {
      newState[key] = expand;
    });
    setExpandedColumns(newState);
  };

  // Columns for the Kanban board
  const columns = [
    { id: 'untouched', title: '📥 Untouched', status: 'Untouched', color: 'bg-gray-100' },
    { id: 'hpl', title: '🔥 HPL', status: 'HPL', color: 'bg-red-50' },
    { id: 'mpl', title: '⚖️ MPL', status: 'MPL', color: 'bg-yellow-50' },
    { id: 'lpl', title: '🧊 LPL', status: 'LPL', color: 'bg-blue-50' },
    { id: 'ul', title: '🚫 UL', status: 'UL', color: 'bg-gray-200' },
    { id: 'customer', title: '🧍 Customer', status: 'Customer', color: 'bg-green-50' },
    { id: 'ticket', title: '🧾 Ticket', status: 'Ticket', color: 'bg-purple-50' },
  ];

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/customers');
        console.log('Fetched leads:', response.data);
        setLeads(response.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Debug: Log all leads and their statuses
  useEffect(() => {
    console.log('All leads:', leads);
    console.log('Lead statuses:', [...new Set(leads.map(lead => lead.status))]);
  }, [leads]);

  // Filter leads based on search term, source, and date range
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSource = leadSource === 'All' || lead.leadSource === leadSource;
    
    const leadDate = lead.createdAt ? new Date(lead.createdAt) : new Date();
    const matchesDate = leadDate >= dateRange.startDate && leadDate <= dateRange.endDate;
    
    return matchesSearch && matchesSource && matchesDate;
  });
  
  // Debug: Log filtered leads
  useEffect(() => {
    console.log('Filtered leads:', filteredLeads);
    console.log('Leads by status:', {
      'Untouched': filteredLeads.filter(l => l.status === 'Untouched'),
      'HPL': filteredLeads.filter(l => l.status === 'HPL'),
      'MPL': filteredLeads.filter(l => l.status === 'MPL'),
      'LPL': filteredLeads.filter(l => l.status === 'LPL')
    });
  }, [filteredLeads]);

  // Handle drag start
  const onDragStart = (e, lead) => {
    setDragItem(lead);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  // Handle drag over
  const onDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle call lead
  const handleCallLead = async (leadId, phoneNumber) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to make calls');
        return;
      }

      // Log the raw parameters
      console.log('handleCallLead called with:', { leadId, phoneNumber });

      // Ensure we have a valid lead ID
      if (!leadId) {
        console.error('No lead ID provided to handleCallLead');
        alert('Error: No lead ID provided');
        return;
      }

      // Convert leadId to string if it's an object
      const stringLeadId = leadId && typeof leadId === 'object' 
        ? (leadId._id || leadId.id || leadId.toString())
        : String(leadId);
      
      if (!stringLeadId) {
        console.error('Could not convert lead ID to string:', leadId);
        alert('Error: Invalid lead ID format');
        return;
      }

      // Clean up the phone number (remove non-numeric characters except +)
      const cleanPhoneNumber = phoneNumber ? phoneNumber.replace(/[^0-9+]/g, '') : '';
      
      if (!cleanPhoneNumber) {
        console.error('No valid phone number provided');
        alert('Error: No valid phone number provided');
        return;
      }

      // Optimistically update the UI
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead._id === stringLeadId 
            ? { ...lead, status: 'HPL' } 
            : lead
        )
      );

      const url = `/customers/${encodeURIComponent(stringLeadId)}/call`;
      const requestData = { 
        phoneNumber: cleanPhoneNumber,
        leadId: stringLeadId,
        status: 'HPL' // Explicitly set status to HPL
      };

      console.log('Initiating call with data:', {
        method: 'POST',
        url,
        data: requestData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Sending call request to:', url, 'with data:', requestData);
      
      const response = await api.post(url, requestData, {
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });
      
      console.log('Call response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      if (response.status >= 200 && response.status < 300) {
        // If we get here, the call was initiated successfully
        console.log('Call initiated successfully, showing success message');
        alert('Call initiated successfully! The system is connecting your call...');
        
        // Try to refresh the leads, but don't let it fail the whole operation
        try {
          const updatedLeads = await api.get('/customers');
          setLeads(updatedLeads.data);
        } catch (refreshError) {
          console.warn('Failed to refresh leads (non-critical):', refreshError);
        }
      } else {
        throw new Error(response.data?.error || 'Failed to initiate call');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Failed to initiate call: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle drop
  const onDrop = async (e, status) => {
    e.preventDefault();
    if (dragItem) {
      try {
        // Update the status of the dragged item
        const updatedLead = { ...dragItem, status };
        
        // Update local state immediately for better UX
        setLeads(leads.map(lead => 
          lead._id === dragItem._id ? updatedLead : lead
        ));

        // Call API to update the lead status
        await api.put(`/customers/${dragItem._id}`, { status });
      } catch (error) {
        console.error('Error updating lead status:', error);
        // Revert local state on error
        setLeads(leads);
      }
    }
    setIsDragging(false);
    setDragItem(null);
  };

  // Handle adding new lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/customers', newLead);
      console.log('Lead created:', response.data);
      // Fetch the updated list of leads from the server
      const updatedLeads = await api.get('/customers');
      setLeads(updatedLeads.data);
      setShowAddModal(false);
      setNewLead({ name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewLead({
      ...newLead,
      [e.target.name]: e.target.value
    });
  };

  const stats = [
    { name: 'Total Leads', value: leads.length.toString(), icon: UserGroupIcon, change: '', changeType: 'increase' },
    { name: 'Conversion Rate', value: '8.2%', icon: FunnelIcon, change: '+1.2%', changeType: 'increase' },
    { name: 'Total Value', value: '$124,500', icon: CurrencyDollarIcon, change: '+8.5%', changeType: 'increase' },
    { name: 'Avg. Deal Size', value: '$2,450', icon: ArrowTrendingUpIcon, change: '-2.1%', changeType: 'decrease' },
  ];

  const statuses = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-purple-100 text-purple-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Proposal Sent': 'bg-yellow-100 text-yellow-800',
    'Closed Won': 'bg-green-600 text-white',
    'Closed Lost': 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Lead
            </button>
            <button 
              onClick={() => setShowAIModal(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-purple-700"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              Generate Lead by AI
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <span className={`ml-2 text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="lead-source" className="mr-2 text-sm text-gray-600">
                Source:
              </label>
              <select
                id="lead-source"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
              >
                <option value="All">All Sources</option>
                <option value="Inbound">Inbound</option>
                <option value="Outbound">Outbound</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Social">Social Media</option>
              </select>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="flex space-x-4 pb-4">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className={`flex-1 min-w-[280px] ${expandedColumns[column.id] ? 'w-full' : 'w-12'}`}
              >
                <div 
                  className={`flex items-center justify-between p-2 rounded-t-md ${column.color}`}
                >
                  <div className="flex items-center
                  ">
                    <button 
                      onClick={() => toggleColumn(column.id)}
                      className="mr-2"
                    >
                      {expandedColumns[column.id] ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      )}
                    </button>
                    <h3 className="font-medium">{column.title}</h3>
                    <span className="ml-2 bg-white bg-opacity-50 text-xs font-medium px-2 py-0.5 rounded-full">
                      {filteredLeads.filter(lead => lead.status && lead.status.toLowerCase() === column.status.toLowerCase()).length}
                    </span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {expandedColumns[column.id] && (
                  <div 
                    className="bg-gray-50 p-2 min-h-[200px] border border-t-0 rounded-b-md"
                    onDragOver={(e) => onDragOver(e, column.status)}
                    onDrop={(e) => onDrop(e, column.status)}
                  >
                    {filteredLeads
                      .filter(lead => lead.status && lead.status.toLowerCase() === column.status.toLowerCase())
                      .map(lead => (
                        <div
                          key={lead._id}
                          draggable
                          onDragStart={(e) => onDragStart(e, lead)}
                          className="bg-white p-3 mb-2 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{lead.name}</h4>
                                  <p className="text-sm text-gray-600">{lead.email}</p>
                                  <div className="mt-2 flex items-center text-xs text-gray-500">
                                    <span className="inline-flex items-center">
                                      <PhoneIcon className="h-3 w-3 mr-1" />
                                      {lead.phone}
                                    </span>
                                  </div>
                                  {lead.notes && (
                                    <div className="mt-2 p-2 bg-blue-50 text-xs text-gray-700 rounded">
                                      {lead.notes}
                                    </div>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCallLead(lead._id, lead.phone);
                                  }}
                                  className="ml-2 p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                  title="Call Lead"
                                >
                                  <PhoneIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-end ml-2">
                              <span className="text-xs text-gray-500">{format(new Date(lead.createdAt), 'MMM d')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Lead</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddLead}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newLead.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newLead.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newLead.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={newLead.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notes (optional)"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AI Lead Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generate Leads with AI</h3>
              <button 
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!aiForm.location || !aiForm.businessType) {
                alert('Please provide both location and business type');
                return;
              }
              
              setIsGenerating(true);
              console.log('Starting AI lead generation with:', aiForm);
              
              try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Authentication required. Please log in again.');
                }
                
                console.log('Sending request to generate AI leads...');
                const response = await api.post('/customers/ai-generate', 
                  {
                    location: aiForm.location,
                    businessType: aiForm.businessType
                  }
                );
                
                // Close the modal and reset form
                setShowAIModal(false);
                setAiForm({ location: '', businessType: '' });
                
                // Refresh the leads list
                const updatedLeads = await api.get('/customers');
                
                setLeads(updatedLeads.data);
                alert(`Successfully generated ${response.data.length} leads!`);
                
              } catch (error) {
                console.error('Error in AI lead generation:', {
                  error,
                  response: error.response?.data,
                  status: error.response?.status
                });
                
                let errorMessage = 'Failed to generate leads. Please try again.';
                if (error.response?.data?.error) {
                  errorMessage = error.response.data.error;
                } else if (error.message) {
                  errorMessage = error.message;
                }
                
                alert(`Error: ${errorMessage}`);
              } finally {
                setIsGenerating(false);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location (e.g., Delhi, Mumbai)
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={aiForm.location}
                    onChange={(e) => setAiForm({...aiForm, location: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Enter location"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    Type of Business (e.g., gym, restaurant, school)
                  </label>
                  <input
                    type="text"
                    id="businessType"
                    value={aiForm.businessType}
                    onChange={(e) => setAiForm({...aiForm, businessType: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Enter business type"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAIModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Leads'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
