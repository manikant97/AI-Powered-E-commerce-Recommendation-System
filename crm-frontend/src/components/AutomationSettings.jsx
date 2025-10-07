import React, { useState } from 'react';

const AutomationSettings = () => {
  const [activeTab, setActiveTab] = useState('ai-voice-bot');
  const [formData, setFormData] = useState({
    // AI Voice Bot
    script: '',
    retryCount: '',
    retryInterval: '',
    
    // WhatsApp Rules
    initialDelay: '',
    subsequentDelay: '',
    fallbackGroup: '',
    fallbackTimeout: '',
    
    // Meta/LinkedIn Campaigns
    totalBudget: '',
    metaBudget: '',
    jobTitles: '',
    geographicLocation: '',
    industries: '',
    
    // Lead Scoring Rules
    hplRule1: '',
    hplRule2: '',
    mplRule1: '',
    mplRule2: '',
    
    // AI Follow-up Frequency
    frequency: '',
    maxFollowUps: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveRules = () => {
    // Handle saving rules based on active tab
    console.log('Saving rules for:', activeTab, formData);
    alert('Rules saved successfully!');
  };

  const tabs = [
    { id: 'ai-voice-bot', label: 'AI Voice Bot' },
    { id: 'whatsapp-rules', label: 'WhatsApp Rules' },
    { id: 'meta-linkedin', label: 'Meta/LinkedIn Campaigns' },
    { id: 'lead-scoring', label: 'Lead Scoring Rules' },
    { id: 'ai-followup', label: 'AI Follow-up Frequency' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-voice-bot':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">AI Voice Bot</h2>
            <p className="text-gray-600 mb-6">
              Configure settings for AI-powered voice bots to automate customer interactions and support.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Script</label>
                <textarea
                  name="script"
                  value={formData.script}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter voice bot script..."
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Retry Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Retries</label>
                    <input
                      type="number"
                      name="retryCount"
                      value={formData.retryCount}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter number of retries"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retry Interval (hours)</label>
                    <input
                      type="number"
                      name="retryInterval"
                      value={formData.retryInterval}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter retry interval"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'whatsapp-rules':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">WhatsApp Rules</h2>
            <p className="text-gray-600 mb-6">
              Configure settings for WhatsApp automation rules to manage customer interactions and support.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Delay Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Delay (minutes)</label>
                    <input
                      type="number"
                      name="initialDelay"
                      value={formData.initialDelay}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter initial delay"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subsequent Delay (minutes)</label>
                    <input
                      type="number"
                      name="subsequentDelay"
                      value={formData.subsequentDelay}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter subsequent delay"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Fallback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fallback Group</label>
                    <input
                      type="text"
                      name="fallbackGroup"
                      value={formData.fallbackGroup}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter fallback group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fallback Timeout (minutes)</label>
                    <input
                      type="number"
                      name="fallbackTimeout"
                      value={formData.fallbackTimeout}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter fallback timeout"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'meta-linkedin':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Meta/LinkedIn Campaigns Settings</h2>
            <p className="text-gray-600 mb-6">
              Configure settings for Meta and LinkedIn campaigns, including budget allocation, target audience, and campaign parameters.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Budget Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Campaign Budget</label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={formData.totalBudget}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter total budget"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta/LinkedIn Budget</label>
                    <input
                      type="number"
                      name="metaBudget"
                      value={formData.metaBudget}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Meta/LinkedIn budget"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Target Audience</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Titles</label>
                    <input
                      type="text"
                      name="jobTitles"
                      value={formData.jobTitles}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter job titles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Location</label>
                    <input
                      type="text"
                      name="geographicLocation"
                      value={formData.geographicLocation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter geographic location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
                    <input
                      type="text"
                      name="industries"
                      value={formData.industries}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter industries"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'lead-scoring':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Lead Scoring Rules Settings</h2>
            <p className="text-gray-600 mb-6">
              Configure settings for lead scoring, including rules for automatic High Potential Lead (HPL) and Medium Potential Lead (MPL) classifications, and other scoring criteria.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">HPL Classification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule 1</label>
                    <input
                      type="text"
                      name="hplRule1"
                      value={formData.hplRule1}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter HPL rule 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule 2</label>
                    <input
                      type="text"
                      name="hplRule2"
                      value={formData.hplRule2}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter HPL rule 2"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">MPL Classification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule 1</label>
                    <input
                      type="text"
                      name="mplRule1"
                      value={formData.mplRule1}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter MPL rule 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule 2</label>
                    <input
                      type="text"
                      name="mplRule2"
                      value={formData.mplRule2}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter MPL rule 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-followup':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">AI Follow-up Frequency Settings (Admin Only)</h2>
            <p className="text-gray-600 mb-6">
              Configure the frequency of AI follow-ups. These settings are restricted to administrators.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter follow-up frequency"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Follow-ups</label>
                <input
                  type="number"
                  name="maxFollowUps"
                  value={formData.maxFollowUps}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter maximum follow-ups"
                />
              </div>
              
              <div className="pt-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                  Learn more about AI follow-up frequency settings
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Automation Settings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
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
          {renderTabContent()}
          
          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveRules}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationSettings;
