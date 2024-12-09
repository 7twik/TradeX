const { stockName, stockNameInd , BBands} = require("./controller/controller");
const router = require("express").Router();
///////////////////For customers  ///////////////////////////
//REGISTER
router.get("/stockName", stockName);
router.get("/stockNameInd", stockNameInd);
router.get("/BBands", BBands);

module.exports = router;