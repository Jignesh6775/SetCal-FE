const express = require('express');
const cors = require('cors');
const { connection } = require('./Connections/connection');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

// app.use("/users", )


app.listen(port, async() => {
    try {
        await connection;
        console.log("Server is connected to the DB")
    }
     catch (err) {
        console.log(err);
        console.log("Error in running server");
    }
    console.log(`Server is running on port ${port}`);
})
