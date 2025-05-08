const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://karnbecs13:W0rk%40home@cluster0.av1ajpx.mongodb.net/dev_tinder?retryWrites=true&w=majority&appName=Cluster0");
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
