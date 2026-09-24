const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'garba.db');
const db = new Database(dbPath, { verbose: null });

function initDb() {
  // Check if users table exists and has username/email columns
  const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='users'`).get();
  
  if (tableExists) {
    const columns = db.prepare(`PRAGMA table_info(users)`).all().map(c => c.name);
    if (!columns.includes('email') || !columns.includes('username') || !columns.includes('password')) {
      console.log('Migrating database: dropping outdated schema to apply Auth columns...');
      db.exec(`DROP TABLE IF EXISTS connections; DROP TABLE IF EXISTS users;`);
    }
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      area TEXT NOT NULL,
      experience TEXT NOT NULL,
      activity TEXT NOT NULL,
      availableDays TEXT NOT NULL,
      lookingFor TEXT NOT NULL,
      socialContact TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatarUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senderId INTEGER NOT NULL,
      receiverId INTEGER NOT NULL,
      navratriDay INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(senderId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(receiverId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(senderId, receiverId, navratriDay)
    );
  `);

  console.log('Database tables with Auth & Connection Requests initialized.');
}

initDb();

module.exports = db;
