const router = require("express").Router();
const Stock = require("../model/stockmodel");
const talib = require('ta-lib');
const stockName=async (req, res) => {
    try {
        const stock = await Stock.find();
        console.log(stock);
        res.status(200).json(stock);
      
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };
  const stockNameInd=async (req, res) => {
    try {
        const stock = await Stock.find({Country: "India"});
        res.status(200).json(stock);
      
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };


  const BBands=async (req, res) => {
    try {
      const data= req.query.data;
      let closePrices;
      console.log(data);
      for(let i=0;i<data.length;i++){
        closePrices.push(data[i].Close);
      }
      
      const period = 20;
      const stdDev = 2;
      const bband=talib.BBANDS(closePrices, period, stdDev);
      console.log(bband);
      res.json({bband});
     
       // res.status(200).json(stock);
      
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };

  

module.exports = {stockName, stockNameInd, BBands};