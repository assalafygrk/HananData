import { useState } from 'react';
import { Save, Link2, Eye, EyeOff, Server, Activity } from 'lucide-react';

export function AggregatorSettings() {
  const [apiKey, setApiKey] = useState('sk_live_1234567890abcdef');
  const [showKey, setShowKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://api.aggregator.com/v1');
  const [webhookUrl, setWebhookUrl] = useState('https://hanandata.com/api/webhook');
  const [isConnected, setIsConnected] = useState(true);
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const maskedKey = apiKey.substring(0, apiKey.length - 4).replace(/./g, '*') + apiKey.substring(apiKey.length - 4);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Aggregator Settings</h2>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
          isConnected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <Activity className="w-4 h-4" />
          <span className="text-sm font-bold">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
          <div className="p-2 bg-[#1B3A6B] rounded-lg text-white">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Primary VTU API</h3>
            <p className="text-sm text-gray-500">Configure connection to the VTU aggregator</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? 'text' : 'password'} 
                  value={showKey ? apiKey : maskedKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none font-mono text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Base URL</label>
              <input 
                type="url" 
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Webhook URL</label>
              <input 
                type="url" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Simulate Status:</span>
              <button 
                type="button"
                onClick={() => setIsConnected(!isConnected)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded font-medium transition-colors"
              >
                Toggle {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A6B] text-white font-medium rounded-lg hover:bg-[#2A5A9E] transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaved ? 'Saved!' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
