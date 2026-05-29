import mongoose from 'mongoose';
import 'dotenv/config';

async function seedCompaniesForAllUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = (await import('./models/User.js')).default;
        const Company = (await import('./models/Company.js')).default;

        const users = await User.find();
        if (users.length === 0) {
            console.log('No users found in the DB.');
            process.exit(0);
        }

        let createdCount = 0;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            
            // Check if user already created a company to prevent spamming
            const existingCompany = await Company.findOne({ createdBy: user._id });
            
            if (!existingCompany) {
                // Ensure unique name by appending a random string or using user ID
                const companyName = `${user.name}'s Company - ${user._id.toString().substring(0, 4)}`;
                
                const companyData = {
                    name: companyName,
                    description: `This is a test company automatically generated for ${user.name}.`,
                    location: { city: 'Test City' },
                    industry: 'Technology',
                    size: '1-10',
                    createdBy: user._id
                };
                
                await Company.create(companyData);
                createdCount++;
            }
        }

        console.log(`Successfully created ${createdCount} companies for users without one!`);
        process.exit(0);
    } catch (error) {
        if (error.code === 11000) {
            console.log('Duplicate key error, some names might clash, but we processed what we could.');
        } else {
            console.error('Error seeding companies:', error);
        }
        process.exit(1);
    }
}

seedCompaniesForAllUsers();
