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

  if (isLoading) return <div className="p-8 text-white text-center font-black animate-pulse">LOADING_DATA...</div>;
  if (isError) return <div className="p-8 text-rose-400 text-center font-black">CONNECTION_LOST</div>;

  return (
    <div className="p-4 bg-[#020617] min-h-screen text-white font-sans">
      <header className="max-w-full mx-auto mb-10 flex justify-between items-center px-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              MARKET.IO
            </h1>
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]' : 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'}`} />
          </div>
          <span className="text-[9px] text-blue-400 font-black tracking-[0.5em] uppercase mt-1 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">High_Frequency_Stream</span>
        </div>

        <div className="flex gap-2 bg-slate-900/40 p-1 rounded-xl border border-slate-700 backdrop-blur-md">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all duration-300 ${filter === 'all' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'text-slate-400 hover:text-white'}`}
          >GLOBAL</button>
          <button
            onClick={() => setFilter('fitness')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all duration-300 ${filter === 'fitness' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'text-slate-400 hover:text-white'}`}
          >FITNESS</button>
        </div>
      </header>

      <div className="grid gap-4 px-2" style={{
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
              className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between h-[155px] group ${isGold
                ? 'bg-slate-900/60 border-yellow-500/40'
                : 'bg-slate-900/30 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/50'
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {/* آیکون کوچکتر (w-6) و بدون نئون */}
                  <span className={`text-[9px] w-6 h-6 flex items-center justify-center rounded-full font-black ${isGold ? 'bg-yellow-500 text-slate-950' : 'bg-white text-slate-950'}`}>
                    {getIcon(price.symbol)}
                  </span>
                  <span className={`font-black text-sm tracking-tight ${isGold ? 'text-yellow-400' : 'text-white'}`}>
                    {price.symbol}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isPositive ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`}>
                  {isPositive ? '▲' : '▼'} {displayChange}%
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                    {price.price?.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-black text-white uppercase italic drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                    {price.unit}
                  </span>
                </div>
                {price.calories && (
                  <div className="text-[10px] text-emerald-300 font-black mt-2 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(110,231,183,0.5)]">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    {price.calories} KCAL
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-600">
                  {price.type}
                </span>
                {/* زمان: بزرگتر (text-[12px])، بدون ایتالیک و نئونی درخشان */}
                <span className="text-emerald-400 text-[12px] tabular-nums font-black drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                  {price.time}
                </span>
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
