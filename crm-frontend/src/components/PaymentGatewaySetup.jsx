import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AVAILABLE_GATEWAYS = [
  { name: 'Stripe', desc: 'Connect your Stripe account to process payments securely.' },
  { name: 'PayPal', desc: 'Integrate PayPal for easy and widely accepted payments.' },
  { name: 'Square', desc: 'Enable payments through Square for seamless transactions.' },
  { name: 'Authorize.net', desc: 'Authorize.net provides robust payment processing solutions.' },
  { name: 'Razorpay', desc: 'Use Razorpay for accepting payments in India.' },
];

const PaymentGatewaySetup = () => {
  const [gatewayName, setGatewayName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [connected, setConnected] = useState({});

  useEffect(() => {
    // Fetch saved gateway settings (simulate real-time fetch)
    api.get('/payment-gateway')
      .then(res => {
        if (res.data.gatewayName) setGatewayName(res.data.gatewayName);
        if (res.data.apiKey) setApiKey(res.data.apiKey);
        if (res.data.connected) setConnected(res.data.connected);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.post('/payment-gateway', { gatewayName, apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConnect = async (name) => {
    await api.post('/payment-gateway/connect', { gateway: name });
    setConnected(prev => ({ ...prev, [name]: true }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Gateway Setup</h2>
      <p className="mb-4">Configure your payment gateway settings here.</p>
      <form onSubmit={handleSave} className="mb-6">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Gateway Name</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-50"
            placeholder="e.g PayPal"
            value={gatewayName}
            onChange={e => setGatewayName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">API Key</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-50"
            placeholder="Your API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Settings</button>
        {saved && <span className="ml-4 text-green-600">Saved!</span>}
      </form>
      <h3 className="text-lg font-bold mb-2">Available Gateways</h3>
      <div className="bg-gray-50 rounded-lg shadow p-4">
        {AVAILABLE_GATEWAYS.map(gw => (
          <div key={gw.name} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 rounded p-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M6 14h.01M10 10h.01M10 14h.01"/></svg>
              </div>
              <div>
                <div className="font-semibold">{gw.name}</div>
                <div className="text-gray-500 text-sm">{gw.desc}</div>
              </div>
            </div>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${connected[gw.name] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => handleConnect(gw.name)}
              disabled={connected[gw.name]}
            >
              {connected[gw.name] ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentGatewaySetup; 