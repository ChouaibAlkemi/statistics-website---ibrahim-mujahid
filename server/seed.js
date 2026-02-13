const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Assessment = require('./models/Assessment');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany();
        await Assessment.deleteMany();

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        // Create User
        const user = await User.create({
            name: 'Test Parent',
            email: 'parent@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Users Created');

        // Create Assessments
        const assessments = [];
        for (let i = 0; i < 20; i++) {
            const totalScore = Math.floor(Math.random() * 200);
            let level = 'Low';
            if (totalScore >= 121) level = 'Critical';
            else if (totalScore >= 81) level = 'High';
            else if (totalScore >= 41) level = 'Medium';

            assessments.push({
                userId: Math.random() > 0.5 ? user._id : null, // Some anonymous
                answers: Array(50).fill(2), // Dummy answers
                totalScore,
                aggressionLevel: level,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random past date
            });
        }

        await Assessment.insertMany(assessments);
        console.log('Assessments Created');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
