const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('PCCC Identity Portal Server is boiling!');
})

app.listen(PORT);