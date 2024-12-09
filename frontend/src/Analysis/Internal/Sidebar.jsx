import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X, TrendingUp, Building2, DollarSign, BarChart3,
  Calendar, Globe, Phone, Users, ChevronDown, ChevronRight,
  Shield, Banknote, Percent, Target, Scale
} from 'lucide-react'
import { useState } from 'react'

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-100 rounded-lg"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
};

const DataRow = ({ label, value }) => {
  if (value === undefined || value === null) return null;
  
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val > 1000000000) return `${(val / 1000000000).toFixed(2)}B`;
      if (val > 1000000) return `${(val / 1000000).toFixed(2)}M`;
      if (val > 1000) return `${(val / 1000).toFixed(2)}K`;
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{formatValue(value)}</span>
    </div>
  );
};

export default function Sidebar({ isOpen, onClose, stockData }) {
  if (!stockData) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex justify-between items-center">
              <SheetTitle>Company Details</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <div className="flex items-center justify-center h-[80vh]">
            <p className="text-muted-foreground">Select a stock to view details</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle>{stockData.longName || stockData.shortName}</SheetTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{stockData.symbol}</Badge>
                <Badge variant="outline">{stockData.exchange}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)] px-6">
          <CollapsibleSection title="Trading Information" defaultOpen={true}>
            <DataRow label="Current Price" value={`${stockData.currentPrice} ${stockData.currency}`} />
            <DataRow label="Day Range" value={`${stockData.dayLow} - ${stockData.dayHigh}`} />
            <DataRow label="52W Range" value={`${stockData.fiftyTwoWeekLow} - ${stockData.fiftyTwoWeekHigh}`} />
            <DataRow label="Volume" value={stockData.volume} />
            <DataRow label="Average Volume" value={stockData.averageVolume} />
            <DataRow label="Market Cap" value={stockData.marketCap} />
          </CollapsibleSection>

          <CollapsibleSection title="Company Profile">
            <DataRow label="Sector" value={stockData.sector} />
            <DataRow label="Industry" value={stockData.industry} />
            <DataRow label="Employees" value={stockData.fullTimeEmployees} />
            <DataRow label="Country" value={stockData.country} />
            <DataRow label="Website" value={stockData.website} onClick={()=>{
              console.log("hello")
            }} />
            <DataRow label="Phone" value={stockData.phone} />
          </CollapsibleSection>

          <CollapsibleSection title="Financial Metrics">
            <DataRow label="Revenue" value={stockData.totalRevenue} />
            <DataRow label="EBITDA" value={stockData.ebitda} />
            <DataRow label="Profit Margin" value={stockData.profitMargins} />
            <DataRow label="Operating Margin" value={stockData.operatingMargins} />
            <DataRow label="Gross Margin" value={stockData.grossMargins} />
            <DataRow label="Free Cash Flow" value={stockData.freeCashflow} />
          </CollapsibleSection>

          <CollapsibleSection title="Key Ratios">
            <DataRow label="P/E Ratio" value={stockData.trailingPE} />
            <DataRow label="Forward P/E" value={stockData.forwardPE} />
            <DataRow label="Beta" value={stockData.beta} />
            <DataRow label="Debt to Equity" value={stockData.debtToEquity} />
            <DataRow label="Price to Book" value={stockData.priceToBook} />
            <DataRow label="Price to Sales" value={stockData.priceToSalesTrailing12Months} />
          </CollapsibleSection>

          <CollapsibleSection title="Dividends">
            <DataRow label="Dividend Rate" value={stockData.dividendRate} />
            <DataRow label="Dividend Yield" value={stockData.dividendYield} />
            <DataRow label="Payout Ratio" value={stockData.payoutRatio} />
            <DataRow label="Ex-Dividend Date" value={stockData.exDividendDate} />
            <DataRow label="Last Dividend Date" value={stockData.lastDividendDate} />
            <DataRow label="5 Year Avg Dividend Yield" value={stockData.fiveYearAvgDividendYield} />
          </CollapsibleSection>

          <CollapsibleSection title="Growth & Returns">
            <DataRow label="Earnings Growth" value={stockData.earningsGrowth} />
            <DataRow label="Revenue Growth" value={stockData.revenueGrowth} />
            <DataRow label="Return on Equity" value={stockData.returnOnEquity} />
            <DataRow label="Return on Assets" value={stockData.returnOnAssets} />
          </CollapsibleSection>

          {stockData.companyOfficers && stockData.companyOfficers.length > 0 && (
            <CollapsibleSection title="Company Officers">
              {stockData.companyOfficers.map((officer, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-medium">{officer.name}</p>
                  <p className="text-sm text-muted-foreground">{officer.title}</p>
                  {officer.age && <p className="text-sm">Age: {officer.age}</p>}
                  {officer.totalPay && <p className="text-sm">Pay: ${officer.totalPay.toLocaleString()}</p>}
                </div>
              ))}
            </CollapsibleSection>
          )}

          <CollapsibleSection title="Business Summary">
            <p className="text-sm text-muted-foreground">{stockData.longBusinessSummary}</p>
          </CollapsibleSection>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}