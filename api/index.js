const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv =require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
dotenv.config();
app.use(express.json());

mongoose.connect(
    process.env.MONGO_URL
).then(() => console.log('Mongodb Connect..'))
.catch((err) => { console.log(err)}
);

app.use('/users', userRoute);
app.use('/auth', authRoute);


app.listen(process.env.PORT_NUMBER || 5000, (res, req) => {
    console.log('Server is runing..');
});

