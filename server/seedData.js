const seedUsers = [
  // ADMIN USER (Username: ___suraj_sd__ | Password: Knowledge)
  {
    username: '___suraj_sd__',
    email: 'admin@garbasaathi.in',
    password: 'Knowledge',
    role: 'admin',
    name: 'Suraj (Admin)',
    age: 26,
    gender: 'Male',
    area: 'Kothrud',
    experience: 'Experienced',
    activity: 'Both',
    availableDays: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    lookingFor: 'Anyone',
    socialContact: 'Instagram: @garbasaathi_admin',
    bio: 'Platform Administrator for GarbaSaathi Pune Community.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  // DEMO REGISTERED USERS
  {
    username: 'priya_s',
    email: 'priya@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Priya Sharma',
    age: 21,
    gender: 'Female',
    area: 'Wakad',
    experience: 'Intermediate',
    activity: 'Both',
    availableDays: JSON.stringify([1, 2, 3, 4, 6, 8, 9]),
    lookingFor: 'Garba Friends',
    socialContact: 'Instagram: @priya_dances_pune',
    bio: 'Super excited for Navratri 2026! Looking for Garba lovers in Wakad & Balewadi to join events together. Love fast Dodhiyu steps!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    username: 'rahul_k',
    email: 'rahul@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Rahul Kulkarni',
    age: 23,
    gender: 'Male',
    area: 'Baner',
    experience: 'Experienced',
    activity: 'Garba',
    availableDays: JSON.stringify([1, 3, 5, 7, 8, 9]),
    lookingFor: 'Garba Group',
    socialContact: 'Instagram: @rahul_garba_king',
    bio: 'Been playing Garba for 5 years! Forming an energetic circle for Balewadi High Street & Baner venues. Let’s dance non-stop!',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    username: 'sneha_d',
    email: 'sneha@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Sneha Deshmukh',
    age: 22,
    gender: 'Female',
    area: 'Kothrud',
    experience: 'Beginner',
    activity: 'Both',
    availableDays: JSON.stringify([1, 2, 3, 5, 7, 9]),
    lookingFor: 'Garba Partner',
    socialContact: 'Instagram: @sneha_d_pune',
    bio: 'New to proper Garba steps! Want a patient partner or friendly group around Kothrud / Karve Nagar to practice and enjoy.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
  },
  {
    username: 'amit_j',
    email: 'amit@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Amit Joshi',
    age: 25,
    gender: 'Male',
    area: 'Hinjewadi',
    experience: 'Intermediate',
    activity: 'Dandiya',
    availableDays: JSON.stringify([2, 4, 6, 8, 9]),
    lookingFor: 'Anyone',
    socialContact: 'Instagram: @amit_j_25',
    bio: 'Software engineer by day, Dandiya beat player by night! Looking for enthusiasts in Hinjewadi Phase 1 & 2 for evening events.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    username: 'ananya_p',
    email: 'ananya@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Ananya Patil',
    age: 20,
    gender: 'Female',
    area: 'Viman Nagar',
    experience: 'Experienced',
    activity: 'Both',
    availableDays: JSON.stringify([1, 2, 4, 5, 6, 7, 8, 9]),
    lookingFor: 'Garba Group',
    socialContact: 'Instagram: @ananya_viman_garba',
    bio: 'Viman Nagar Garba squad leader! We hit Phoenix Marketcity & KP passes every year. Join our traditional outfit squad!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  },
  {
    username: 'vikram_s',
    email: 'vikram@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Vikram Shinde',
    age: 24,
    gender: 'Male',
    area: 'Hadapsar',
    experience: 'Intermediate',
    activity: 'Garba',
    availableDays: JSON.stringify([1, 3, 4, 6, 8]),
    lookingFor: 'Garba Friends',
    socialContact: 'Instagram: @vikram_shinde_pune',
    bio: 'Magarpatta / Hadapsar local. Deeply love traditional Gujarati & Rajasthani Garba tunes. Let’s connect and travel together!',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
  },
  {
    username: 'pooja_m',
    email: 'pooja@gmail.com',
    password: 'garba123',
    role: 'user',
    name: 'Pooja Mehta',
    age: 22,
    gender: 'Female',
    area: 'Aundh',
    experience: 'Experienced',
    activity: 'Garba',
    availableDays: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    lookingFor: 'Anyone',
    socialContact: 'Instagram: @pooja_m_garba',
    bio: 'Navratri is pure emotion! 9 days, 9 colors, 9 outfits ready. Looking for high-energy Garba lovers in Aundh & Baner.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
  }
];

function seedDatabase(db) {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO users (username, email, password, role, name, age, gender, area, experience, activity, availableDays, lookingFor, socialContact, bio, avatarUrl)
      VALUES (@username, @email, @password, @role, @name, @age, @gender, @area, @experience, @activity, @availableDays, @lookingFor, @socialContact, @bio, @avatarUrl)
    `);

    const insertMany = db.transaction((users) => {
      for (const u of users) insert.run(u);
    });

    insertMany(seedUsers);
    console.log(`Seeded ${seedUsers.length} users (including Admin ___suraj_sd__).`);

    // Add sample connection requests for testing flow:
    // E.g., Rahul (id 3) requested connection with Priya (id 2) for Day 3 (pending)
    db.prepare(`INSERT OR IGNORE INTO connections (senderId, receiverId, navratriDay, status) VALUES (3, 2, 3, 'pending')`).run();
    // Sneha (id 4) requested connection with Priya (id 2) for Day 1 (pending)
    db.prepare(`INSERT OR IGNORE INTO connections (senderId, receiverId, navratriDay, status) VALUES (4, 2, 1, 'pending')`).run();
    // Priya (id 2) requested connection with Amit (id 5) for Day 2 (accepted)
    db.prepare(`INSERT OR IGNORE INTO connections (senderId, receiverId, navratriDay, status) VALUES (2, 5, 2, 'accepted')`).run();
  }
}

module.exports = { seedDatabase, seedUsers };
