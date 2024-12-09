import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react'

export default function Prediction({currentPrice, predictedPrice, priceChange}) {
//   const [currentPrice, setCurrentPrice] = useState(scp)
//   const [predictedPrice, setPredictedPrice] = useState(snp)
//   const [priceChange, setPriceChange] = useState(pc)
//   const [percentageChange, setPercentageChange] = useState(perc)
    const percentageChange = (priceChange / currentPrice) * 100;
  const isPositiveChange = priceChange >= 0

  return (
    <section className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Price Prediction & Movement</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600">
            <CardTitle className="text-white">Current Price</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-center">₹{currentPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600">
            <CardTitle className="text-white text-nowrap">Predicted Price</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-center">₹{predictedPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-600">
          <CardTitle className="text-white">Price Movement</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={isPositiveChange ? "default" : "destructive"} className="text-lg py-1 px-3">
                {isPositiveChange ? <ArrowUpRight className="mr-1" /> : <ArrowDownRight className="mr-1" />}
                ₹{Math.abs(priceChange).toFixed(2)}
              </Badge>
              <span className="text-2xl font-semibold">
                ({isPositiveChange ? '+' : '-'}{Math.abs(percentageChange).toFixed(2)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ₹{isPositiveChange ? 'bg-green-500' : 'bg-red-500'} transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(Math.abs(percentageChange), 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-sm text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isPositiveChange ? (
                  <TrendingUp className="text-green-500" size={24} />
                ) : (
                  <TrendingDown className="text-red-500" size={24} />
                )}
                <span className="text-lg font-semibold">Trend</span>
              </div>
              <Badge variant={isPositiveChange ? "default" : "destructive"} className="text-sm">
                {isPositiveChange ? 'Bullish' : 'Bearish'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
