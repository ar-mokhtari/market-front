import React, { useState } from 'react';
import { usePrices } from '../hooks/usePrices';

export const PriceList: React.FC = () => {
  const { data, isLoading, isError } = usePrices();
  const [filter, setFilter] = useState<'all' | 'fitness'>('all');

  if (isLoading) return <div className="p-8 text-white text-center">Loading live data...</div>;
  if (isError) return <div className="p-8 text-red-500 text-center">Connection Error</div>;

  let prices = data?.data || [];

  // Logic for health goals: Focusing on specific assets or future food data
  // For now, let's assume assets like 'XAU' might relate to your long-term 'Wealth & Health'
  // or you can add food items to your crawler later.
  if (filter === 'fitness') {
    // Example: Only showing specific symbols related to your diet/budget tracking
    prices = prices.filter(p => p.type === 'currency' || p.symbol.includes('GOLD'));
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Market Dashboard</h1>

        {/* Filter for Fitness/Diet goals */}
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >All Assets</button>
          <button
            onClick={() => setFilter('fitness')}
            className={`px-4 py-2 rounded-md text-sm transition ${filter === 'fitness' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >Diet Tracker</button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {prices.map((price) => {
          const isPositive = price.change_percent >= 0;

          return (
            <div key={price.symbol} className="group p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl hover:border-blue-500 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="text-blue-400 font-bold text-sm tracking-wider">{price.symbol}</span>
                <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(price.change_percent)}%
                </div>
              </div>

              <div className="text-2xl font-mono text-white mb-4">
                {price.price.toLocaleString()} <span className="text-sm text-slate-500">{price.unit}</span>
              </div>

              <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">{price.type}</span>
                <span className="text-[10px] text-slate-500">{price.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
