import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

import PropTypes from 'prop-types';

const StockCard = ({ stock }) => {
  const priceChange = stock.Close - stock.Open;
  const percentageChange = (priceChange / stock.Open) * 100;
  const isPriceUp = priceChange >= 0;

  return (
    <Card className="w-[400px] bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">{stock.CompanyName}({stock.symbol})</CardTitle>
            <p className="text-sm text-gray-300">{stock.Date}</p>
          </div>
          <div className="flex items-center gap-1 text-lg font-semibold text-white">
            <DollarSign className="w-5 h-5" />
            <span>{stock.Currency}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300">Current</p>
              <p className="text-2xl font-bold text-white">{stock.Close.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isPriceUp ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className={`text-sm font-semibold ${isPriceUp ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)} 
                  ({percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-300">Open</p>
              <p className="font-semibold text-white">{stock.Open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-300">High</p>
              <p className="font-semibold text-white">{stock.High.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-300">Low</p>
              <p className="font-semibold text-white">{stock.Low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-300">Volume</p>
              <p className="font-semibold text-white">{(stock.Volume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-300" />
            <p className="text-sm text-gray-300">
              Daily Trading Range: {(stock.High - stock.Low).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

StockCard.propTypes = {
  stock: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    CompanyName: PropTypes.string.isRequired,
    Date: PropTypes.string.isRequired,
    Open: PropTypes.number.isRequired,
    Close: PropTypes.number.isRequired,
    High: PropTypes.number.isRequired,
    Low: PropTypes.number.isRequired,
    Volume: PropTypes.number.isRequired,
    Currency: PropTypes.string.isRequired,
  }).isRequired,
};

export default StockCard;