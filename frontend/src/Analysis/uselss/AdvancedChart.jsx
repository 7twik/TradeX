import React, { useRef, useEffect } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';

const StockChart = ({ past, name, month }) => {
    const chartContainerRef = useRef();
    const [candle, setCandle] = React.useState(-1);
    const [line, setLine] = React.useState(-1);
    const [area, setArea] = React.useState(-1);
    const [histogram, setHistogram] = React.useState(-1);
    const [bar, setBar] = React.useState(-1);
    const [baseline, setBaseline] = React.useState(-1);
    const [alldata, setallData] = React.useState([]);
    const [average, setAverage] = React.useState(0);
    const [semidata, setSemidata] = React.useState([]);
    const [state, setState] = React.useState(0);
    const [col, setcol] = React.useState(0);
    const [arr, setarr] = React.useState([]);
    const [indicator, setIndicator] = React.useState('none');
    const [movavgopt, setmovavgopt] = React.useState('Close');
    const [indicatorData, setIndicatorData] = React.useState([]);

    const calculateRSI = (data, period = 14) => {
        const gains = [];
        const losses = [];
        const rsi = [];

        // Calculate price changes
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? -change : 0);
        }

        // Calculate initial average gain and loss
        let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

        // Calculate RSI for the first period
        rsi.push({
            time: data[period].time,
            value: 100 - (100 / (1 + avgGain / avgLoss))
        });

        // Calculate RSI for remaining periods
        for (let i = period + 1; i < data.length; i++) {
            avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
            avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
            
            rsi.push({
                time: data[i].time,
                value: 100 - (100 / (1 + avgGain / avgLoss))
            });
        }

        return rsi;
    };

    const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
        const ema = (data, period) => {
            const k = 2 / (period + 1);
            const emaData = [];
            let ema = data[0].close;
            
            data.forEach((item, i) => {
                ema = (item.close * k) + (ema * (1 - k));
                emaData.push({
                    time: item.time,
                    value: ema
                });
            });
            
            return emaData;
        };

        const shortEMA = ema(data, shortPeriod);
        const longEMA = ema(data, longPeriod);
        
        const macdLine = shortEMA.map((item, i) => ({
            time: item.time,
            value: item.value - longEMA[i].value
        }));

        // Calculate signal line (9-day EMA of MACD)
        const signalLine = [];
        let signalEma = macdLine[0].value;
        const signalK = 2 / (signalPeriod + 1);

        macdLine.forEach((item) => {
            signalEma = (item.value * signalK) + (signalEma * (1 - signalK));
            signalLine.push({
                time: item.time,
                value: signalEma
            });
        });

        // Calculate histogram
        const histogram = macdLine.map((item, i) => ({
            time: item.time,
            value: item.value - signalLine[i].value
        }));

        return {
            macdLine,
            signalLine,
            histogram
        };
    };

    const calculateBollinger = (data, period = 20, stdDev = 2) => {
        const sma = [];
        const upper = [];
        const lower = [];
        
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
            
            const squaredDiffs = slice.map(item => Math.pow(item.close - avg, 2));
            const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / period;
            const std = Math.sqrt(variance);
            
            sma.push({ time: data[i].time, value: avg });
            upper.push({ time: data[i].time, value: avg + (stdDev * std) });
            lower.push({ time: data[i].time, value: avg - (stdDev * std) });
        }
        
        return { sma, upper, lower };
    };

    const calculateStochastic = (data, period = 14, smoothK = 3, smoothD = 3) => {
        const stochK = [];
        const stochD = [];
        
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const high = Math.max(...slice.map(item => item.high));
            const low = Math.min(...slice.map(item => item.low));
            const close = slice[slice.length - 1].close;
            
            const k = ((close - low) / (high - low)) * 100;
            stochK.push({ time: data[i].time, value: k });
        }
        
        // Calculate smooth K
        const smoothedK = [];
        for (let i = smoothK - 1; i < stochK.length; i++) {
            const slice = stochK.slice(i - smoothK + 1, i + 1);
            const avg = slice.reduce((sum, item) => sum + item.value, 0) / smoothK;
            smoothedK.push({ time: stochK[i].time, value: avg });
        }
        
        // Calculate D
        for (let i = smoothD - 1; i < smoothedK.length; i++) {
            const slice = smoothedK.slice(i - smoothD + 1, i + 1);
            const avg = slice.reduce((sum, item) => sum + item.value, 0) / smoothD;
            stochD.push({ time: smoothedK[i].time, value: avg });
        }
        
        return { k: smoothedK, d: stochD };
    };

    const handleIndicatorChange = (e) => {
        const selectedIndicator = e.target.value;
        setIndicator(selectedIndicator);
        
        if (selectedIndicator === 'none') {
            setIndicatorData([]);
            return;
        }
        
        switch (selectedIndicator) {
            case 'rsi':
                setIndicatorData(calculateRSI(alldata));
                break;
            case 'macd':
                setIndicatorData(calculateMACD(alldata));
                break;
            case 'bollinger':
                setIndicatorData(calculateBollinger(alldata));
                break;
            case 'stochastic':
                setIndicatorData(calculateStochastic(alldata));
                break;
            default:
                setIndicatorData([]);
        }
    };

    // ... (keep all your existing functions like getCloseAvg, getOpenAvg, etc.)

    const renderChart = () => {
        const chart = createChart(chartContainerRef.current, {
            layout: {
                backgroundColor: 'black',
                textColor: 'white',
            },
            width: 1380,
            height: 550,
            grid: {
                vertLines: { color: '#404040' },
                horzLines: { color: '#404040' },
            },
        });

        // Add your existing chart series (candle, line, area, etc.)
        if (candle > 0) {
            const candlestickSeries = chart.addCandlestickSeries();
            candlestickSeries.setData(alldata);
        }

        // Add technical indicators based on selection
        if (indicator !== 'none' && indicatorData.length > 0) {
            switch (indicator) {
                case 'rsi':
                    { const rsiSeries = chart.addLineSeries({
                        color: '#ff9900',
                        lineWidth: 2,
                    });
                    rsiSeries.setData(indicatorData);
                    break; }
                    
                case 'macd':
                    { const { macdLine, signalLine, histogram } = indicatorData;
                    const macdSeries = chart.addLineSeries({
                        color: '#2962FF',
                        lineWidth: 2,
                    });
                    const signalSeries = chart.addLineSeries({
                        color: '#FF005D',
                        lineWidth: 2,
                    });
                    const histSeries = chart.addHistogramSeries({
                        color: '#26a69a',
                    });
                    macdSeries.setData(macdLine);
                    signalSeries.setData(signalLine);
                    histSeries.setData(histogram);
                    break; }
                    
                case 'bollinger':
                    { const { sma, upper, lower } = indicatorData;
                    const middleSeries = chart.addLineSeries({
                        color: '#fff',
                        lineWidth: 2,
                    });
                    const upperSeries = chart.addLineSeries({
                        color: '#26a69a',
                        lineWidth: 1,
                    });
                    const lowerSeries = chart.addLineSeries({
                        color: '#ef5350',
                        lineWidth: 1,
                    });
                    middleSeries.setData(sma);
                    upperSeries.setData(upper);
                    lowerSeries.setData(lower);
                    break; }
                    
                case 'stochastic':
                    { const { k, d } = indicatorData;
                    const kSeries = chart.addLineSeries({
                        color: '#2962FF',
                        lineWidth: 2,
                    });
                    const dSeries = chart.addLineSeries({
                        color: '#FF005D',
                        lineWidth: 2,
                    });
                    kSeries.setData(k);
                    dSeries.setData(d);
                    break; }
            }
        }

        // ... (keep your existing chart configurations)
    };

    return (
        <>
            {state === 0 ? (
                <></>
            ) : (
                <div className="flex flex-col mb-10 mr-4 gap-4 p-4 bg-gray-900">
                    <div className="flex flex-wrap gap-2">
                        {/* Existing chart type buttons */}
                        {[
                            { state: candle, setter: setCandle, label: 'Candle' },
                            { state: line, setter: setLine, label: 'Line' },
                            { state: area, setter: setArea, label: 'Area' },
                            { state: histogram, setter: setHistogram, label: 'Histogram' },
                            { state: bar, setter: setBar, label: 'Bar' },
                            { state: baseline, setter: setBaseline, label: 'Baseline' }
                        ].map(({ state, setter, label }) => (
                            <button
                                key={label}
                                onClick={() => setter(state * -1)}
                                className={`px-4 py-2 rounded transition-all ${
                                    state > 0 
                                    ? 'bg-white text-black hover:bg-gray-200' 
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Technical Indicators Dropdown */}
                        <select
                            value={indicator}
                            onChange={handleIndicatorChange}
                            className="px-3 py-2 rounded bg-black text-white border border-gray-700"
                        >
                            <option value="none">Select Indicator</option>
                            <option value="rsi">RSI</option>
                            <option value="macd">MACD</option>
                            <option value="bollinger">Bollinger Bands</option>
                            <option value="stochastic">Stochastic</option>
                        </select>

                        {/* Existing Moving Average Controls */}
                        <input
                            type="number"
                            placeholder="enter moving average in days"
                            onChange={(e) => setcol(e.target.value)}
                            className="px-3 py-2 rounded bg-black text-white border border-gray-700 w-full sm:w-auto"
                        />
                        <select
                            value={movavgopt}
                            onChange={(e) => setmovavgopt(e.target.value)}
                            className="px-3 py-2 rounded bg-black text-white border border-gray-700"
                        >
                            <option value="Close">Close</option>
                            <option value="Open">Open</option>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                        </select>
                        <button
                            onClick={getAvg}
                            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 border border-gray-700"
                        >
                            Get Data
                        </button>
                    </div>

                    {/* Moving Average Buttons */}
                    {arr.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {arr.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => changestate(index)}
                                    className="px-4 py-2 rounded transition-all"
                                    style={
                                        item.check > 0
                                            ? { background: item.color, color: "black" }
                                            : { background: "black", color: "white" }
                                    }
                                >
                                    {item.day} day [{item.type}] moving average
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div ref={chartContainerRef} />
        </>
    );
};

export default StockChart;