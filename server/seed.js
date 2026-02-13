const { pool, query } = require('./config/db');
const User = require('./models/User');
const Assessment = require('./models/Assessment');

const seedData = async () => {
    try {
        console.log('Seeding Database...');
        
        // Clear tables
        await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
        await query('TRUNCATE TABLE assessments RESTART IDENTITY CASCADE');
        // also feedback if needed
        await query('TRUNCATE TABLE feedback RESTART IDENTITY CASCADE');

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
        for (let i = 0; i < 20; i++) {
            const totalScore = Math.floor(Math.random() * 200);
            let level = 'Low';
            if (totalScore >= 121) level = 'Critical';
            else if (totalScore >= 81) level = 'High';
            else if (totalScore >= 41) level = 'Medium';
            
            // Randomly assign to registered user or anonymous (null)
            const userId = Math.random() > 0.5 ? user.id : null;

            await Assessment.create({
                userId,
                answers: Array(50).fill(2), // Dummy answers
                totalScore,
                aggressionLevel: level,
                // Note: default implementation uses current timestamp, to mock past dates we need to update our model or do raw SQL here.
                // For simplicity, let's keep it current or add capability to model.
                // Keeping current for now.
            });
        }

        console.log('Assessments Created');
        console.log('Database Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
