import React from 'react';
import './Dash.css';
const Dashboard = ({ data }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num?.toLocaleString() || 'N/A';
  };

  const formatPercent = (num) => (num ? `${(num * 100).toFixed(2)}%` : 'N/A');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{data.longName}</h1>
        <h2>{data.symbol} - {data.exchange}</h2>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3>Price Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Current Price</label>
              <span>{formatNumber(data.currentPrice)} {data.currency}</span>
            </div>
            <div className="info-item">
              <label>Day Range</label>
              <span>{formatNumber(data.dayLow)} - {formatNumber(data.dayHigh)}</span>
            </div>
            <div className="info-item">
              <label>52 Week Range</label>
              <span>{formatNumber(data.fiftyTwoWeekLow)} - {formatNumber(data.fiftyTwoWeekHigh)}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Key Metrics</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Market Cap</label>
              <span>{formatNumber(data.marketCap)}</span>
            </div>
            <div className="info-item">
              <label>P/E Ratio</label>
              <span>{data.trailingPE?.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <label>Beta</label>
              <span>{data.beta?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Financial Metrics</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Revenue</label>
              <span>{formatNumber(data.totalRevenue)}</span>
            </div>
            <div className="info-item">
              <label>EBITDA</label>
              <span>{formatNumber(data.ebitda)}</span>
            </div>
            <div className="info-item">
              <label>Profit Margin</label>
              <span>{formatPercent(data.profitMargins)}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Trading Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Volume</label>
              <span>{formatNumber(data.volume)}</span>
            </div>
            <div className="info-item">
              <label>Avg Volume</label>
              <span>{formatNumber(data.averageVolume)}</span>
            </div>
            <div className="info-item">
              <label>Shares Outstanding</label>
              <span>{formatNumber(data.sharesOutstanding)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;