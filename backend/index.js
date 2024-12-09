const express = require('express');
const app = express();
const port = 3000;

require("./db/conn");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.get('/', async(req, res) => {
     res.send("Hello World");                 
});
app.use("/api", require("./route"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
