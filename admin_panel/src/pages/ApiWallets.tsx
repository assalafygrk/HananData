import { useState } from 'react';
import { mockProviders } from '../mocks/data';
import { Provider } from '../mocks/types';
import { RefreshCw, AlertTriangle, Server, CheckCircle2 } from 'lucide-react';

export function ApiWallets() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">API Wallets Overview</h2>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5A9E] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Balances'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {providers.map((provider) => {
          const isLowBalance = provider.balance < provider.lowBalanceThreshold;

          return (
            <div key={provider.id} className={`bg-white rounded-xl shadow-sm border p-6 ${
              isLowBalance ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isLowBalance ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#1B3A6B]'}`}>
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{provider.type} API</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {provider.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : null}
                    {provider.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Current Balance</span>
                  <span>Threshold: ₦{provider.lowBalanceThreshold.toLocaleString()}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className={`text-3xl font-bold ${isLowBalance ? 'text-red-600' : 'text-gray-900'}`}>
                    ₦{provider.balance.toLocaleString()}
                  </span>
                </div>
              </div>

              {isLowBalance && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start gap-2 border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-800">
                    Balance is below the configured threshold. Please fund your {provider.name} wallet to avoid service disruption.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {providers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            No API Providers configured. Add them in Aggregator Settings.
          </div>
        )}
      </div>
    </div>
  );
}
