
const express = require('express');
const dataRouter = require('./routes/getData.route');
const app = express();
require('dotenv').config();
const port = process.env.PORT

app.use(express.json());

// health check
app.get('/', (req, res) => {
    res.send('Server setup is ok!');
})
app.use('/api', dataRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})