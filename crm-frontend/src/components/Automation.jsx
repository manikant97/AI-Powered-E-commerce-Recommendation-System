import React, { useState } from 'react';
import { 
  Cog6ToothIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhoneArrowUpRightIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Automation = () => {
  const [activeTab, setActiveTab] = useState('ai-voice-bot');
  const [isAdmin, setIsAdmin] = useState(true); // This would come from your auth context

  // Sample data for settings
  const [settings, setSettings] = useState({
    aiVoiceBot: {
      enabled: true,
      script: 'Hello, this is an automated message. How can I help you today?',
      maxRetries: 3,
      retryDelay: 30, // minutes
    },
    whatsapp: {
      initialDelay: 5, // minutes
      followUpDelay: 1440, // minutes (24 hours)
      fallbackMessage: 'Thank you for your message. Our team will get back to you soon.',
      documentationLink: 'https://example.com/whatsapp-docs',
    },
    campaigns: {
      dailyBudget: 100, // USD
      targetCpa: 25, // USD
      targetLocations: ['United States', 'Canada', 'United Kingdom'],
      targetJobTitles: ['CEO', 'CTO', 'Marketing Director'],
    },
    leadScoring: {
      hotLeadThreshold: 80,
      mediumLeadThreshold: 50,
      pointsForWebsiteVisit: 5,
      pointsForEmailOpen: 3,
      pointsForDocumentDownload: 10,
      pointsForDemoRequest: 20,
    },
    aiFollowUp: {
      initialFollowUp: 24, // hours
      followUpInterval: 72, // hours
      maxFollowUps: 3,
      workingHoursOnly: true,
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderAIVoiceBotSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">AI Voice Bot</h3>
          <p className="text-sm text-gray-500">Configure your AI voice bot settings and scripts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={settings.aiVoiceBot.enabled}
            onChange={(e) => handleInputChange('aiVoiceBot', 'enabled', e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bot Script</label>
        <textarea
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={settings.aiVoiceBot.script}
          onChange={(e) => handleInputChange('aiVoiceBot', 'script', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Retry Attempts</label>
          <input
            type="number"
            min="0"
            max="10"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={settings.aiVoiceBot.maxRetries}
            onChange={(e) => handleInputChange('aiVoiceBot', 'maxRetries', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Retry Delay (minutes)</label>
          <input
            type="number"
            min="1"
            max="1440"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={settings.aiVoiceBot.retryDelay}
            onChange={(e) => handleInputChange('aiVoiceBot', 'retryDelay', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );

  const renderWhatsAppRules = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">WhatsApp Automation Rules</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Response Delay (minutes)</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.whatsapp.initialDelay}
              onChange={(e) => handleInputChange('whatsapp', 'initialDelay', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Delay (minutes)</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.whatsapp.followUpDelay}
              onChange={(e) => handleInputChange('whatsapp', 'followUpDelay', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fallback Message</label>
            <textarea
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.whatsapp.fallbackMessage}
              onChange={(e) => handleInputChange('whatsapp', 'fallbackMessage', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Documentation Link</label>
            <input
              type="url"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.whatsapp.documentationLink}
              onChange={(e) => handleInputChange('whatsapp', 'documentationLink', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaignSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Campaign Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Budget (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.campaigns.dailyBudget}
              onChange={(e) => handleInputChange('campaigns', 'dailyBudget', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target CPA (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.campaigns.targetCpa}
              onChange={(e) => handleInputChange('campaigns', 'targetCpa', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Locations</label>
            <select
              multiple
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-24"
              value={settings.campaigns.targetLocations}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleInputChange('campaigns', 'targetLocations', selected);
              }}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeadScoring = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Lead Scoring Rules</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hot Lead Threshold</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.leadScoring.hotLeadThreshold}
              onChange={(e) => handleInputChange('leadScoring', 'hotLeadThreshold', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medium Lead Threshold</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.leadScoring.mediumLeadThreshold}
              onChange={(e) => handleInputChange('leadScoring', 'mediumLeadThreshold', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points for Website Visit</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.leadScoring.pointsForWebsiteVisit}
              onChange={(e) => handleInputChange('leadScoring', 'pointsForWebsiteVisit', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points for Email Open</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.leadScoring.pointsForEmailOpen}
              onChange={(e) => handleInputChange('leadScoring', 'pointsForEmailOpen', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points for Document Download</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.leadScoring.pointsForDocumentDownload}
              onChange={(e) => handleInputChange('leadScoring', 'pointsForDocumentDownload', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points for Demo Request</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.leadScoring.pointsForDemoRequest}
              onChange={(e) => handleInputChange('leadScoring', 'pointsForDemoRequest', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIFollowUp = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">AI Follow-up Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Follow-up (hours)</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.aiFollowUp.initialFollowUp}
              onChange={(e) => handleInputChange('aiFollowUp', 'initialFollowUp', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Interval (hours)</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.aiFollowUp.followUpInterval}
              onChange={(e) => handleInputChange('aiFollowUp', 'followUpInterval', parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Follow-ups</label>
            <input
              type="number"
              min="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={settings.aiFollowUp.maxFollowUps}
              onChange={(e) => handleInputChange('aiFollowUp', 'maxFollowUps', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="workingHoursOnly"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={settings.aiFollowUp.workingHoursOnly}
              onChange={(e) => handleInputChange('aiFollowUp', 'workingHoursOnly', e.target.checked)}
            />
            <label htmlFor="workingHoursOnly" className="ml-2 block text-sm text-gray-700">
              Send during working hours only
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={settings.aiFollowUp.workingHoursStart}
                onChange={(e) => handleInputChange('aiFollowUp', 'workingHoursStart', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={settings.aiFollowUp.workingHoursEnd}
                onChange={(e) => handleInputChange('aiFollowUp', 'workingHoursEnd', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-voice-bot':
        return renderAIVoiceBotSettings();
      case 'whatsapp-rules':
        return renderWhatsAppRules();
      case 'campaigns':
        return renderCampaignSettings();
      case 'lead-scoring':
        return renderLeadScoring();
      case 'ai-follow-up':
        return renderAIFollowUp();
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-500">You don't have permission to access automation settings. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Automation Settings</h1>
          <p className="text-gray-500">Configure automation rules and settings for your CRM</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('ai-voice-bot')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'ai-voice-bot'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <PhoneArrowUpRightIcon className="h-5 w-5 mr-2" />
                  AI Voice Bot
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('whatsapp-rules')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'whatsapp-rules'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  WhatsApp Rules
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'campaigns'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <MegaphoneIcon className="h-5 w-5 mr-2" />
                  Meta/LinkedIn Campaigns
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('lead-scoring')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'lead-scoring'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Lead Scoring Rules
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('ai-follow-up')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'ai-follow-up'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  AI Follow-up
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500 flex items-center">
          <ShieldCheckIcon className="h-4 w-4 mr-1.5" />
          Only administrators can view and modify these settings.
        </div>
      </div>
    </div>
  );
};

export default Automation;
