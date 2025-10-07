import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AutoInvoiceSettings = () => {
  const [prefix, setPrefix] = useState('');
  const [footer, setFooter] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Fetch saved settings from backend
    api.get('/auto-invoice')
      .then(res => {
        if (res.data.prefix) setPrefix(res.data.prefix);
        if (res.data.footer) setFooter(res.data.footer);
        if (typeof res.data.enabled === 'boolean') setEnabled(res.data.enabled);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.post('/auto-invoice', { prefix, footer, enabled });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Auto-Invoice Settings</h2>
      <div className="font-semibold mb-2">Invoice Generation</div>
      <p className="mb-4">Configure your auto-invoice settings here.</p>
      <form onSubmit={handleSave} className="mb-6">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Invoice Prefix</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-50"
            placeholder="e.g INV"
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">API Key</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-50"
            placeholder="Footer text for invoices"
            value={footer}
            onChange={e => setFooter(e.target.value)}
          />
        </div>
        <div className="mb-4 bg-gray-50 rounded p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Enable Auto-Invoice</div>
            <div className="text-gray-500 text-sm">Automatically generate invoices for new orders.</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="sr-only"
            />
            <span className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-300 ease-in-out ${enabled ? 'bg-blue-500' : ''}`}>
              <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-4' : ''}`}></span>
            </span>
          </label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Settings</button>
        {saved && <span className="ml-4 text-green-600">Saved!</span>}
      </form>
    </div>
  );
};

export default AutoInvoiceSettings; 