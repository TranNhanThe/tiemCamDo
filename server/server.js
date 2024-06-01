const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'https://tiemcamdo-n53fzsxqf-trannhanthes-projects.vercel.app');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Kết nối MongoDB
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/f8_education_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect Fail!');
    }
}
    
// Kết nối atlas
// async function connect() {
//     try {
//         await mongoose.connect('mongodb+srv://nhanthe133:0977343132As@cluster0.uw1j0wh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         console.log('Connected successfully to MongoDB Atlas!');
//     } catch (error) {
//         console.error('Failed to connect to MongoDB Atlas:', error);
//     }
// }

// Middleware
app.use(express.json());

// Import routes
const todoRoute = require('./routes/todoRoutes');
app.use('/todo', todoRoute);
const bikeRoute = require('./routes/bikeRoutes');
app.use('/bike', bikeRoute);

// Khởi chạy server và kết nối MongoDB
app.listen(PORT, async () => {
    await connect();
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});