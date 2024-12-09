const mongoose = require("mongoose");

const StockmodelSchema = new mongoose.Schema(
  {
    Ticker: {
      type: String,
    },    
    Name:{
        type: String,
    },
    Country:{
        type: String,
    },
  }
);

module.exports = mongoose.model("Names", StockmodelSchema);