// backend/src/scripts/seedDemo.ts
// Run: npx ts-node -r tsconfig-paths/register src/scripts/seedDemo.ts

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEMO_ACCOUNTS = [
    {
        name:     'Demo Admin',
        email:    'admin@skillsense.demo',
        password: 'Demo@1234',
        role:     'admin',
        isVerified: true,
        isActive: true,
        authProvider: 'local',
    },
    {
        name:     'Demo Student',
        email:    'student@skillsense.demo',
        password: 'Demo@1234',
        role:     'student',
        isVerified: true,
        isActive: true,
        authProvider: 'local',
    },
    {
        name:     'Demo Instructor',
        email:    'instructor@skillsense.demo',
        password: 'Demo@1234',
        role: 'institute',
        isVerified: true,
        isActive: true,
        authProvider: 'local',
    },
];

async function seed() {
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not set in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Lazy import after connection
    const User = (await import('../models/User.model')).default;

    let created = 0;
    let updated = 0;

    for (const acc of DEMO_ACCOUNTS) {
        const hashed = await bcrypt.hash(acc.password, 12);
        const existing = await User.findOne({ email: acc.email });

        if (existing) {
            await User.findByIdAndUpdate(existing._id, {
                password: hashed,
                isActive: true,
                isVerified: true,
                role: acc.role,
            });
            console.log(`🔄 Updated: ${acc.email}`);
            updated++;
        } else {
            await User.create({ ...acc, password: hashed });
            console.log(`✅ Created: ${acc.email} (${acc.role})`);
            created++;
        }
    }

    console.log(`\n🎉 Seed complete! Created: ${created}, Updated: ${updated}`);
    console.log('\nDemo credentials:');
    DEMO_ACCOUNTS.forEach(a => console.log(`  ${a.role.padEnd(12)} ${a.email}  /  ${a.password}`));

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});

