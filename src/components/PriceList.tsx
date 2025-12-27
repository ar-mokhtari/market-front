import React, { useState, useMemo } from 'react';
import { usePrices } from '../hooks/usePrices';
import { Price } from '../types/price';

export const PriceList: React.FC = () => {
  const { data, isLoading, isError, isConnected } = usePrices();
  const [filter, setFilter] = useState<'all' | 'fitness'>('all');

  const sortedPrices = useMemo(() => {
    let list = data?.data || [];
    if (filter === 'fitness') {
      list = list.filter(p => p.type === 'fitness' || p.type === 'gold');
    }

    const typeWeights: Record<string, number> = {
      'gold': 1,
      'currency': 2,
      'cryptocurrency': 3,
      'fitness': 4,
    };

    return [...list].sort((a, b) => {
      const weightA = typeWeights[a.type] || 99;
      const weightB = typeWeights[b.type] || 99;
      if (weightA !== weightB) return weightA - weightB;
      return a.symbol.localeCompare(b.symbol);
    });
  }, [data, filter]);

  if (isLoading) return <div className="p-8 text-white text-center font-bold">Connecting...</div>;
  if (isError) return <div className="p-8 text-rose-500 text-center font-bold font-mono">Connection Error</div>;

  return (
    <div className="p-4 bg-slate-950 min-h-screen text-slate-200">
      <header className="max-w-full mx-auto mb-5 flex justify-between items-end px-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tighter italic">MARKET.IO</h1>
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-600 shadow-[0_0_10px_#e11d48]'}`} />
          </div>
          <p className="text-[9px] text-slate-600 font-bold tracking-[0.3em] uppercase">Dynamic Live Feed</p>
        </div>

        <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >ALL</button>
          <button
            onClick={() => setFilter('fitness')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === 'fitness' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >FITNESS</button>
        </div>
      </header>

      {/* Auto-fill Grid: Maximizing screen usage */}
      <div className="grid gap-3 px-2" style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
      }}>
        {sortedPrices.map((price: Price) => {
          const rawChange = price.change_percent;
          const displayChange = isNaN(rawChange) || rawChange === null ? "0.00" : Math.abs(rawChange).toFixed(2);
          const isPositive = !isNaN(rawChange) && rawChange >= 0;
          const isGold = price.type === 'gold';

          return (
            <div
              key={price.symbol}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-[140px] ${isGold
                ? 'bg-slate-900 border-yellow-500/30 shadow-md ring-1 ring-yellow-500/10'
                : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-500/40'
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`text-xs w-7 h-7 flex items-center justify-center rounded-lg font-black ${isGold ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-800 text-slate-500'}`}>
                    {getIcon(price.symbol)}
                  </span>
                  <span className={`font-black text-[13px] tracking-tight ${isGold ? 'text-yellow-400' : 'text-slate-300'}`}>
                    {price.symbol}
                  </span>
                </div>
                <div className={`text-[10px] font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '▲' : '▼'} {displayChange}%
                </div>
              </div>

              {/* Price and Unit in the same line */}
              <div className="my-1">
                <div className="text-xl font-black text-white tracking-tight font-mono leading-none">
                  {price.price?.toLocaleString()}
                  <span className="text-[10px] text-slate-500 font-bold ml-2 uppercase tracking-tighter">
                    {price.unit}
                  </span>
                </div>
                {price.calories && (
                  <div className="text-[9px] text-emerald-500 font-black mt-2">🔥 {price.calories} KCAL</div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center text-[9px] text-slate-600 font-black uppercase tracking-tighter">
                <span className="opacity-50">{price.type}</span>
                <span className="tabular-nums italic">{price.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getIcon = (symbol: string) => {
  const icons: Record<string, string> = {
    'IR_GOLD_18K': 'AU', 'BTC': '₿', 'ETH': 'Ξ', 'USD': '$', 'EUR': '€',
    'GBP': '£', 'TRY': '₺', 'JPY': '¥', 'AED': 'د.إ', 'GOLD': '📀'
  };
  return icons[symbol] || '•';
};
