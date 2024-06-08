const Bike = require('../models/Bike');

const getAllBikes = async (req, res) => {
    try {
        const bikes = await Bike.find({}, '_id bsx kho');
         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        // res.setHeader('Access-Control-Allow-Origin', 'https://tiemcamdo-n53fzsxqf-trannhanthes-projects.vercel.app');

        res.json(bikes);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const createBike = async (req, res) => {
    try {
        const { bsx, kho } = req.body;
        const newBike = new Bike({
            bsx,
            kho
        });
        const savedBike = await newBike.save();
        // res.setHeader('Access-Control-Allow-Origin', 'https://tiemcamdo-n53fzsxqf-trannhanthes-projects.vercel.app');
        res.status(201).json(savedBike);
    } catch (error) {
        console.error('Error adding bike:', error);
        res.status(500).json({ message: 'Failed to add bike' });
    }
};

const deleteBikes = async (req, res) => {
    try {
        const bikeIds = req.body.ids;
        const bikes = await Bike.find({ _id: { $in: bikeIds } });
        if (bikes.length !== bikeIds.length) {
            return res.status(404).json({ message: 'Some bikes not found' });
        }
        await Bike.deleteMany({ _id: { $in: bikeIds } });
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200).json({ message: 'Bikes deleted successfully' });
    } catch (error) {
        console.error('Error deleting bikes:', error);
        res.status(500).json({ message: 'Failed to delete bikes' });
    }
};

const updateBike = async (req, res) => {
    try {
        const { id, newBsx, newKho } = req.body;
        const updatedBike = await Bike.findOneAndUpdate({ _id: id }, { bsx: newBsx, kho: newKho }, { new: true });
        if (!updatedBike) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.status(200).json(updatedBike);
    } catch (error) {
        console.error('Error updating bike:', error);
        res.status(500).json({ message: 'Failed to update bike' });
    }
};

module.exports = {
    getAllBikes,
    createBike,
    deleteBikes,
    updateBike
};