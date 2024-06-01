// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
// Kết nối MongoDB
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
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
// Định nghĩa Schema và Model
const courseSchema = new mongoose.Schema({
    name: String,
    // Thêm các trường khác nếu cần
});
const Course = mongoose.model('Course', courseSchema); 
//-----------------------------------------------------
const listSchema = new mongoose.Schema({
    todo_name: String,
    status: String
    // Thêm các trường khác nếu cần
});
const List = mongoose.model('List', listSchema);
//=========================================================
const foodSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    fat: Number,
    carbs: Number,
    protein: Number
    // Thêm các trường khác nếu cần
});
const Food = mongoose.model('Food', foodSchema);
// Middleware
app.use(express.json());
//Routes
// const todoRoutes = require('./routes/todoRoutes');

// app.get('/', async (req, res) => {
//     try {
//         // Lấy danh sách các khoá học từ MongoDB
//         const courses = await Course.find({}, '_id name'); // Chỉ lấy _id và name
//         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//         res.json(courses); // Trả về danh sách khoá học
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
// app.use('/todo', todoRoutes);
app.get('/todo', async (req, res) => {
    try {
        // Lấy danh sách các todo từ MongoDB
        const lists = await List.find({}, '_id todo_name status'); // Chỉ lấy _id và name
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.json(lists); // Trả về danh sách khoá học
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/todo', async (req, res) => {
    try {
        const { todo_name, status } = req.body;

        const newList = new List({
            todo_name,
            status
        });

        const savedList = await newList.save();
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(201).json(savedList);
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ message: 'Failed to add todo' });
    }
});

app.delete('/todo/delete', async (req, res) => {
    try {
        const todoIds = req.body.ids;

        // Kiểm tra xem danh sách todo có tồn tại không
        const todos = await List.find({ _id: { $in: todoIds } });
        if (todos.length !== todoIds.length) {
            return res.status(404).json({ message: 'Some todos not found' });
        }

        // Xóa các todo khỏi cơ sở dữ liệu
        await List.deleteMany({ _id: { $in: todoIds } });

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200).json({ message: 'Todos deleted successfully' });
    } catch (error) {
        console.error('Error deleting todos:', error);
        res.status(500).json({ message: 'Failed to delete todos' });
    }
});

// Khởi chạy server và kết nối MongoDB
app.listen(PORT, async () => {
    await connect();
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
