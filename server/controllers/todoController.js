const List = require('../models/List');

const getAllLists = async (req, res) => {
    try {
        const lists = await List.find({}, '_id todo_name status');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.json(lists);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const createList = async (req, res) => {
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
};

const deleteLists = async (req, res) => {
    try {
        const todoIds = req.body.ids;
        const todos = await List.find({ _id: { $in: todoIds } });
        if (todos.length !== todoIds.length) {
            return res.status(404).json({ message: 'Some todos not found' });
        }
        await List.deleteMany({ _id: { $in: todoIds } });
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200).json({ message: 'Todos deleted successfully' });
    } catch (error) {
        console.error('Error deleting todos:', error);
        res.status(500).json({ message: 'Failed to delete todos' });
    }
};

const updateTodoName = async (req, res) => {
    try {
        const { id, newName, newStatus } = req.body;
        const updatedList = await List.findOneAndUpdate({ _id: id }, { todo_name: newName, status: newStatus }, { new: true });
        if (!updatedList) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200).json(updatedList);
    } catch (error) {
        console.error('Error updating todo name:', error);
        res.status(500).json({ message: 'Failed to update todo name' });
    }
};

module.exports = {
    getAllLists,
    createList,
    deleteLists,
    updateTodoName
};