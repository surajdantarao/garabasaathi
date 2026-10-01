require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const { seedDatabase } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent JSON Backup file path for Render free-tier container restarts
const BACKUP_FILE = path.join(__dirname, 'backup_data.json');

function persistBackupData() {
  try {
    const users = db.prepare("SELECT * FROM users WHERE role != 'admin'").all();
    const connections = db.prepare('SELECT * FROM connections').all();
    const messages = db.prepare('SELECT * FROM messages').all();

    const data = {
      timestamp: new Date().toISOString(),
      users,
      connections,
      messages
    };

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Backup write error:', err);
  }
}

function restoreBackupData() {
  try {
    if (!fs.existsSync(BACKUP_FILE)) return;
    const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
    const data = JSON.parse(raw);

    if (Array.isArray(data.users)) {
      const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (id, username, email, password, role, name, age, gender, area, experience, activity, availableDays, lookingFor, socialContact, bio, avatarUrl, createdAt)
        VALUES (@id, @username, @email, @password, @role, @name, @age, @gender, @area, @experience, @activity, @availableDays, @lookingFor, @socialContact, @bio, @avatarUrl, @createdAt)
      `);
      for (const u of data.users) {
        insertUser.run(u);
      }
    }

    if (Array.isArray(data.connections)) {
      const insertConn = db.prepare(`
        INSERT OR IGNORE INTO connections (id, senderId, receiverId, navratriDay, status, createdAt)
        VALUES (@id, @senderId, @receiverId, @navratriDay, @status, @createdAt)
      `);
      for (const c of data.connections) {
        insertConn.run(c);
      }
    }

    if (Array.isArray(data.messages)) {
      const insertMsg = db.prepare(`
        INSERT OR IGNORE INTO messages (id, connectionId, senderId, receiverId, text, createdAt)
        VALUES (@id, @connectionId, @senderId, @receiverId, @text, @createdAt)
      `);
      for (const m of data.messages) {
        insertMsg.run(m);
      }
    }

    console.log('Restored state from backup_data.json successfully.');
  } catch (err) {
    console.error('Backup restore error:', err);
  }
}

// Dynamically ensure Admin account exists based on Render Environment Variables
function ensureAdminAccount() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@garbasaathi.in';
  const adminName = process.env.ADMIN_NAME || 'Platform Administrator';

  if (!adminUsername || !adminPassword) {
    console.log('ℹ️ Admin credentials not set in environment variables (ADMIN_USERNAME & ADMIN_PASSWORD).');
    return;
  }

  // Remove any legacy admin accounts that do not match the environment variable username
  db.prepare("DELETE FROM users WHERE role = 'admin' AND username != ?").run(adminUsername);

  const existing = db.prepare('SELECT id, role FROM users WHERE username = ?').get(adminUsername);
  if (!existing) {
    db.prepare(`
      INSERT INTO users (username, email, password, role, name, age, gender, area, experience, activity, availableDays, lookingFor, socialContact, bio, avatarUrl)
      VALUES (?, ?, ?, 'admin', ?, 26, 'Male', 'Kothrud', 'Experienced', 'Both', '[]', 'None', '', 'Platform Administrator', '')
    `).run(adminUsername, adminEmail.toLowerCase(), adminPassword, adminName);
    console.log(`✅ Admin account dynamically initialized for username "${adminUsername}".`);
  } else {
    // Keep username, password, email synchronized with environment variables
    db.prepare(`
      UPDATE users SET username = ?, password = ?, email = ?, role = 'admin' WHERE id = ?
    `).run(adminUsername, adminPassword, adminEmail.toLowerCase(), existing.id);
  }
}

// Initialize database & seed
seedDatabase(db);
restoreBackupData();
ensureAdminAccount();
persistBackupData();

// Health check endpoint for cloud deployment (Render, Railway, Fly.io)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '💃 GarbaSaathi API Server is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

const PUNE_AREAS = [
  'Baner', 'Balewadi', 'Wakad', 'Hinjewadi', 'Kothrud', 'Aundh',
  'Viman Nagar', 'Kharadi', 'Hadapsar', 'Magarpatta', 'Swargate',
  'Camp', 'Pimpri', 'Chinchwad', 'Bhosari', 'PCMC', 'Other Pune Area'
];

function formatUserRow(user) {
  if (!user) return null;
  let parsedDays = [];
  try {
    parsedDays = typeof user.availableDays === 'string' ? JSON.parse(user.availableDays) : user.availableDays;
  } catch (e) {
    parsedDays = [];
  }
  // Exclude password from returned object
  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    availableDays: parsedDays
  };
}

// ------------------- AUTHENTICATION ENDPOINTS -------------------

// 1. POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, name, age, gender, area, experience, activity, availableDays, lookingFor, socialContact, bio, avatarUrl } = req.body;

    if (!name || name.trim().length === 0) return res.status(400).json({ success: false, error: 'Full name is required' });
    if (!email || !email.includes('@')) return res.status(400).json({ success: false, error: 'Valid email address is required' });
    if (!password || password.length < 4) return res.status(400).json({ success: false, error: 'Password must be at least 4 characters' });
    
    const derivedUsername = (username && username.trim()) || email.split('@')[0] + Math.floor(Math.random() * 1000);

    // Check unique email/username
    const existing = db.prepare(`SELECT id FROM users WHERE email = ? OR username = ?`).get(email.trim(), derivedUsername.trim());
    if (existing) {
      return res.status(400).json({ success: false, error: 'Account with this Email or Username already exists' });
    }

    const numAge = parseInt(age, 10) || 20;
    const defaultAvatar = gender === 'Female' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

    const result = db.prepare(`
      INSERT INTO users (username, email, password, role, name, age, gender, area, experience, activity, availableDays, lookingFor, socialContact, bio, avatarUrl)
      VALUES (?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      derivedUsername.trim(),
      email.trim().toLowerCase(),
      password,
      name.trim(),
      numAge,
      gender || 'Female',
      area || 'Wakad',
      experience || 'Intermediate',
      activity || 'Both',
      JSON.stringify(availableDays || [1, 2, 3, 4, 5, 6, 7, 8, 9]),
      lookingFor || 'Garba Friends',
      socialContact.trim(),
      bio.trim(),
      avatarUrl || defaultAvatar
    );

    const newUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(result.lastInsertRowid);
    persistBackupData();
    res.status(201).json({ success: true, message: 'Registration successful!', user: formatUserRow(newUser) });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// 2. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { loginInput, password } = req.body;
    if (!loginInput || !password) {
      return res.status(400).json({ success: false, error: 'Please enter Username/Email and Password' });
    }

    const input = loginInput.trim();

    // Check Admin Login from environment variables (configured in Render / .env)
    const envAdminUser = process.env.ADMIN_USERNAME;
    const envAdminPass = process.env.ADMIN_PASSWORD;
    const envAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();

    if (envAdminUser && envAdminPass) {
      if ((input === envAdminUser || (envAdminEmail && input.toLowerCase() === envAdminEmail)) && password === envAdminPass) {
        let adminUser = db.prepare(`SELECT * FROM users WHERE role = 'admin' OR username = ?`).get(envAdminUser);
        if (!adminUser) {
          ensureAdminAccount();
          adminUser = db.prepare(`SELECT * FROM users WHERE role = 'admin' OR username = ?`).get(envAdminUser);
        }
        if (adminUser) {
          return res.json({ success: true, message: 'Welcome Admin!', user: formatUserRow(adminUser) });
        }
      }
    }

    // Standard User login
    const user = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(input, input.toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid Username/Email or Password' });
    }

    res.json({ success: true, message: 'Login successful!', user: formatUserRow(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// ------------------- USER DIRECTORY & PROFILES -------------------

// 3. GET /api/users - Browse members
app.get('/api/users', (req, res) => {
  try {
    const { area, gender, experience, activity, day, navratriDay, lookingFor, currentUserId } = req.query;
    const targetDay = day || navratriDay;

    let query = `SELECT * FROM users WHERE role != 'admin'`;
    const params = [];

    if (area && area !== 'All' && area !== 'All Pune Areas') {
      query += ` AND area = ?`;
      params.push(area);
    }
    if (gender && gender !== 'All') {
      query += ` AND gender = ?`;
      params.push(gender);
    }
    if (experience && experience !== 'All') {
      query += ` AND experience = ?`;
      params.push(experience);
    }
    if (activity && activity !== 'All') {
      query += ` AND activity = ?`;
      params.push(activity);
    }
    if (lookingFor && lookingFor !== 'All' && lookingFor !== 'Anyone') {
      query += ` AND (lookingFor = ? OR lookingFor = 'Anyone')`;
      params.push(lookingFor);
    }

    query += ` ORDER BY createdAt DESC`;

    const rows = db.prepare(query).all(...params);
    let users = rows.map(formatUserRow);

    // Filter by Navratri Day
    if (targetDay && targetDay !== 'All') {
      const dayNum = parseInt(targetDay, 10);
      if (!isNaN(dayNum)) {
        users = users.filter(u => Array.isArray(u.availableDays) && u.availableDays.includes(dayNum));
      }
    }

    // Process current user relations
    if (currentUserId) {
      const cUserId = parseInt(currentUserId, 10);
      // Remove logged-in user from returned list
      users = users.filter(u => u.id !== cUserId);

      // Attach connection status, connectionId and connectedDay for each user
      users = users.map(u => {
        let connStatus = null;
        let connId = null;
        let connDay = null;

        if (targetDay && targetDay !== 'All') {
          const dayNum = parseInt(targetDay, 10);
          const conn = db.prepare(`
            SELECT id, status, navratriDay FROM connections 
            WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
              AND navratriDay = ?
          `).get(cUserId, u.id, u.id, cUserId, dayNum);

          if (conn) {
            connStatus = conn.status;
            connId = conn.id;
            connDay = conn.navratriDay;
          }
        } else {
          // If viewing All days, check if accepted connection exists, or pending
          const conn = db.prepare(`
            SELECT id, status, navratriDay FROM connections 
            WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
            ORDER BY CASE WHEN status = 'accepted' THEN 1 ELSE 2 END ASC, navratriDay ASC
            LIMIT 1
          `).get(cUserId, u.id, u.id, cUserId);

          if (conn) {
            connStatus = conn.status;
            connId = conn.id;
            connDay = conn.navratriDay;
          }
        }

        // Privacy: Hide public social contact unless connection status is 'accepted'
        const safeSocial = connStatus === 'accepted' ? u.socialContact : '🔒 Protected (Connect to View)';

        return {
          ...u,
          connectionStatus: connStatus,
          connectionId: connId,
          connectedDay: connDay,
          socialContact: safeSocial
        };
      });
    } else {
      // Privacy for guests
      users = users.map(u => ({ ...u, socialContact: '🔒 Protected (Login to Connect)' }));
    }

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profiles' });
  }
});

// 4. GET /api/users/:id - Get single profile
app.get('/api/users/:id', (req, res) => {
  try {
    const { currentUserId } = req.query;
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Profile not found' });

    const formatted = formatUserRow(user);
    if (currentUserId && parseInt(currentUserId, 10) !== user.id) {
      const cUserId = parseInt(currentUserId, 10);
      const conn = db.prepare(`
        SELECT id, status, navratriDay FROM connections 
        WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
        ORDER BY CASE WHEN status = 'accepted' THEN 1 ELSE 2 END ASC, navratriDay ASC
        LIMIT 1
      `).get(cUserId, user.id, user.id, cUserId);

      if (conn) {
        formatted.connectionStatus = conn.status;
        formatted.connectionId = conn.id;
        formatted.connectedDay = conn.navratriDay;
      }

      if (!conn || conn.status !== 'accepted') {
        formatted.socialContact = '🔒 Protected (Connect to View)';
      }
    }

    res.json({ success: true, user: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

// ------------------- CONNECTION REQUEST WORKFLOW -------------------

// 5. POST /api/connections/request - Send a Connection Request
app.post('/api/connections/request', (req, res) => {
  try {
    const { senderId, receiverId, navratriDay } = req.body;
    const sId = parseInt(senderId, 10);
    const rId = parseInt(receiverId, 10);
    const day = parseInt(navratriDay, 10);

    if (!sId || !rId || !day || day < 1 || day > 9) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }
    if (sId === rId) {
      return res.status(400).json({ success: false, error: 'Cannot connect with yourself' });
    }

    const receiver = db.prepare(`SELECT id, name FROM users WHERE id = ?`).get(rId);
    if (!receiver) return res.status(404).json({ success: false, error: 'Receiver user not found' });

    // Check if request already exists in any state
    const existing = db.prepare(`
      SELECT id, status FROM connections 
      WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
        AND navratriDay = ?
    `).get(sId, rId, rId, sId, day);

    if (existing) {
      return res.status(400).json({
        success: false,
        error: existing.status === 'accepted' 
          ? `You are already connected with ${receiver.name} for Day ${day}` 
          : `A request is already pending with ${receiver.name} for Day ${day}`
      });
    }

    db.prepare(`
      INSERT INTO connections (senderId, receiverId, navratriDay, status)
      VALUES (?, ?, ?, 'pending')
    `).run(sId, rId, day);

    persistBackupData();

    res.status(201).json({
      success: true,
      message: `🎉 Connection request sent to ${receiver.name} for Day ${day}!`,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ success: false, error: 'Failed to send connection request' });
  }
});

// 6. PUT /api/connections/:id/respond - Accept or Reject Connection Request
app.put('/api/connections/:id/respond', (req, res) => {
  try {
    const { status, currentUserId } = req.body;
    const connectionId = req.params.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be accepted or rejected' });
    }

    const conn = db.prepare(`SELECT * FROM connections WHERE id = ?`).get(connectionId);
    if (!conn) return res.status(404).json({ success: false, error: 'Request not found' });

    // Verify target user is receiver
    if (currentUserId && parseInt(currentUserId, 10) !== conn.receiverId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to respond to this request' });
    }

    db.prepare(`UPDATE connections SET status = ? WHERE id = ?`).run(status, connectionId);

    // If accepted, initialize welcome chat message between partners
    if (status === 'accepted') {
      const existingMsg = db.prepare('SELECT id FROM messages WHERE connectionId = ?').get(connectionId);
      if (!existingMsg) {
        db.prepare(`
          INSERT INTO messages (connectionId, senderId, receiverId, text)
          VALUES (?, ?, ?, ?)
        `).run(connectionId, conn.receiverId, conn.senderId, `🎉 Hey! I accepted your request for Day ${conn.navratriDay} Garba! Excited to coordinate plans! 💃`);
      }
    }

    persistBackupData();

    const sender = db.prepare(`SELECT name FROM users WHERE id = ?`).get(conn.senderId);

    res.json({
      success: true,
      message: status === 'accepted' 
        ? `🎉 Connection accepted! You and ${sender?.name || 'Saathi'} are now connected for Day ${conn.navratriDay}.` 
        : `Connection request declined.`
    });
  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).json({ success: false, error: 'Failed to update request' });
  }
});

// 7. GET /api/connections/my - Get user dashboard connections & requests
app.get('/api/connections/my', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, error: 'userId parameter required' });

    const uId = parseInt(userId, 10);

    // Received Pending Requests (Needs user action)
    const receivedPending = db.prepare(`
      SELECT 
        c.id as connectionId,
        c.navratriDay,
        c.createdAt,
        u.id as partnerId,
        u.name,
        u.age,
        u.area,
        u.experience,
        u.activity,
        u.bio,
        u.avatarUrl
      FROM connections c
      JOIN users u ON c.senderId = u.id
      WHERE c.receiverId = ? AND c.status = 'pending'
      ORDER BY c.createdAt DESC
    `).all(uId);

    // Sent Pending Requests (Awaiting partner action)
    const sentPending = db.prepare(`
      SELECT 
        c.id as connectionId,
        c.navratriDay,
        c.createdAt,
        u.id as partnerId,
        u.name,
        u.age,
        u.area,
        u.experience,
        u.activity,
        u.avatarUrl
      FROM connections c
      JOIN users u ON c.receiverId = u.id
      WHERE c.senderId = ? AND c.status = 'pending'
      ORDER BY c.createdAt DESC
    `).all(uId);

    // Accepted Connections (Both parties can see social info)
    const acceptedRows = db.prepare(`
      SELECT 
        c.id as connectionId,
        c.navratriDay,
        c.createdAt,
        CASE WHEN c.senderId = ? THEN uRec.id ELSE uSend.id END as partnerId,
        CASE WHEN c.senderId = ? THEN uRec.name ELSE uSend.name END as name,
        CASE WHEN c.senderId = ? THEN uRec.age ELSE uSend.age END as age,
        CASE WHEN c.senderId = ? THEN uRec.area ELSE uSend.area END as area,
        CASE WHEN c.senderId = ? THEN uRec.experience ELSE uSend.experience END as experience,
        CASE WHEN c.senderId = ? THEN uRec.activity ELSE uSend.activity END as activity,
        CASE WHEN c.senderId = ? THEN uRec.socialContact ELSE uSend.socialContact END as socialContact,
        CASE WHEN c.senderId = ? THEN uRec.avatarUrl ELSE uSend.avatarUrl END as avatarUrl
      FROM connections c
      JOIN users uSend ON c.senderId = uSend.id
      JOIN users uRec ON c.receiverId = uRec.id
      WHERE (c.senderId = ? OR c.receiverId = ?) AND c.status = 'accepted'
      ORDER BY c.navratriDay ASC, c.createdAt DESC
    `).all(uId, uId, uId, uId, uId, uId, uId, uId, uId, uId);

    // Deduplicate accepted rows by partnerId + navratriDay to ensure each partner only shows ONCE per day
    const seenPartnerDay = new Set();
    const uniqueAcceptedRows = [];
    acceptedRows.forEach(item => {
      const key = `${item.partnerId}_${item.navratriDay}`;
      if (!seenPartnerDay.has(key)) {
        seenPartnerDay.add(key);
        uniqueAcceptedRows.push(item);
      }
    });

    // Group accepted connections by Navratri day
    const acceptedGrouped = {};
    for (let d = 1; d <= 9; d++) {
      acceptedGrouped[`Day ${d}`] = [];
    }

    uniqueAcceptedRows.forEach(item => {
      const dayKey = `Day ${item.navratriDay}`;
      if (!acceptedGrouped[dayKey]) acceptedGrouped[dayKey] = [];
      acceptedGrouped[dayKey].push(item);
    });

    res.json({
      success: true,
      stats: {
        receivedPendingCount: receivedPending.length,
        sentPendingCount: sentPending.length,
        acceptedCount: uniqueAcceptedRows.length
      },
      receivedPending,
      sentPending,
      accepted: uniqueAcceptedRows,
      acceptedGrouped
    });
  } catch (error) {
    console.error('Error fetching dashboard connections:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

// 8. DELETE /api/users/:id - Permanent User Account Deletion (Admin)
app.delete('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id;
    // Wipe all messages involving this user
    db.prepare(`DELETE FROM messages WHERE senderId = ? OR receiverId = ?`).run(userId, userId);
    // Wipe all connection records involving this user
    db.prepare(`DELETE FROM connections WHERE senderId = ? OR receiverId = ?`).run(userId, userId);
    // Delete user account permanently
    const info = db.prepare(`DELETE FROM users WHERE id = ?`).run(userId);
    if (info.changes === 0) return res.status(404).json({ success: false, error: 'User account not found' });
    
    persistBackupData();
    res.json({ success: true, message: 'User account permanently deleted. They cannot login again.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Failed to permanently delete user account' });
  }
});

// 8b. GET /api/admin/connections - Monitor all connections and requests
app.get('/api/admin/connections', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        c.id as connectionId,
        c.navratriDay,
        c.status,
        c.createdAt,
        uSend.id as senderId,
        uSend.name as senderName,
        uSend.username as senderUsername,
        uSend.gender as senderGender,
        uSend.area as senderArea,
        uSend.socialContact as senderContact,
        uSend.avatarUrl as senderAvatar,
        uRec.id as receiverId,
        uRec.name as receiverName,
        uRec.username as receiverUsername,
        uRec.gender as receiverGender,
        uRec.area as receiverArea,
        uRec.socialContact as receiverContact,
        uRec.avatarUrl as receiverAvatar,
        (SELECT COUNT(*) FROM messages m WHERE m.connectionId = c.id) as messageCount,
        (SELECT text FROM messages m WHERE m.connectionId = c.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessage,
        (SELECT createdAt FROM messages m WHERE m.connectionId = c.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessageTime
      FROM connections c
      JOIN users uSend ON c.senderId = uSend.id
      JOIN users uRec ON c.receiverId = uRec.id
      ORDER BY c.createdAt DESC
    `).all();

    res.json({ success: true, count: rows.length, connections: rows });
  } catch (error) {
    console.error('Error fetching admin connections:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve connection history' });
  }
});

// 8c. GET /api/admin/chats - Monitor active user chats and conversation threads
app.get('/api/admin/chats', (req, res) => {
  try {
    const chats = db.prepare(`
      SELECT 
        c.id as connectionId,
        c.navratriDay,
        c.status,
        c.createdAt as connectionCreatedAt,
        uSend.id as senderId,
        uSend.name as senderName,
        uSend.username as senderUsername,
        uSend.gender as senderGender,
        uSend.area as senderArea,
        uSend.avatarUrl as senderAvatar,
        uSend.socialContact as senderContact,
        uRec.id as receiverId,
        uRec.name as receiverName,
        uRec.username as receiverUsername,
        uRec.gender as receiverGender,
        uRec.area as receiverArea,
        uRec.avatarUrl as receiverAvatar,
        uRec.socialContact as receiverContact,
        (SELECT COUNT(*) FROM messages m WHERE m.connectionId = c.id) as messageCount,
        (SELECT text FROM messages m WHERE m.connectionId = c.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessage,
        (SELECT createdAt FROM messages m WHERE m.connectionId = c.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessageTime
      FROM connections c
      JOIN users uSend ON c.senderId = uSend.id
      JOIN users uRec ON c.receiverId = uRec.id
      WHERE c.status = 'accepted'
      ORDER BY COALESCE((SELECT createdAt FROM messages m WHERE m.connectionId = c.id ORDER BY m.createdAt DESC LIMIT 1), c.createdAt) DESC
    `).all();

    res.json({ success: true, count: chats.length, chats });
  } catch (error) {
    console.error('Error fetching admin chats:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user chats' });
  }
});

// 8d. GET /api/admin/chat/:connectionId - Admin view conversation details & complete messages
app.get('/api/admin/chat/:connectionId', (req, res) => {
  try {
    const connectionId = parseInt(req.params.connectionId, 10);
    const conn = db.prepare(`
      SELECT 
        c.id as connectionId,
        c.navratriDay,
        c.status,
        c.createdAt as connectionCreatedAt,
        uSend.id as senderId,
        uSend.name as senderName,
        uSend.username as senderUsername,
        uSend.gender as senderGender,
        uSend.area as senderArea,
        uSend.socialContact as senderContact,
        uSend.avatarUrl as senderAvatar,
        uRec.id as receiverId,
        uRec.name as receiverName,
        uRec.username as receiverUsername,
        uRec.gender as receiverGender,
        uRec.area as receiverArea,
        uRec.socialContact as receiverContact,
        uRec.avatarUrl as receiverAvatar
      FROM connections c
      JOIN users uSend ON c.senderId = uSend.id
      JOIN users uRec ON c.receiverId = uRec.id
      WHERE c.id = ?
    `).get(connectionId);

    if (!conn) {
      return res.status(404).json({ success: false, error: 'Connection not found' });
    }

    const messages = db.prepare(`
      SELECT 
        m.id,
        m.connectionId,
        m.senderId,
        m.receiverId,
        m.text,
        m.createdAt,
        u.name as senderName,
        u.username as senderUsername,
        u.gender as senderGender,
        u.avatarUrl as senderAvatar
      FROM messages m
      JOIN users u ON m.senderId = u.id
      WHERE m.connectionId = ?
      ORDER BY m.createdAt ASC
    `).all(connectionId);

    res.json({
      success: true,
      connection: conn,
      messages
    });
  } catch (error) {
    console.error('Error fetching admin chat messages:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve conversation history' });
  }
});

// 9. GET /api/admin/stats - Admin Dashboard Stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const totalUsers = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role != 'admin'`).get().count;
    const totalConnections = db.prepare(`SELECT COUNT(*) as count FROM connections`).get().count;
    const pendingRequests = db.prepare(`SELECT COUNT(*) as count FROM connections WHERE status = 'pending'`).get().count;
    const acceptedConnections = db.prepare(`SELECT COUNT(*) as count FROM connections WHERE status = 'accepted'`).get().count;
    const totalMessages = db.prepare(`SELECT COUNT(*) as count FROM messages`).get().count;
    
    const areaStats = db.prepare(`
      SELECT area, COUNT(*) as count FROM users WHERE role != 'admin' GROUP BY area ORDER BY count DESC
    `).all();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalConnections,
        pendingRequests,
        acceptedConnections,
        totalMessages,
        areaStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch admin stats' });
  }
});

// 10. POST /api/seed - Re-seed Database
app.post('/api/seed', (req, res) => {
  try {
    db.exec(`DELETE FROM connections; DELETE FROM users;`);
    seedDatabase(db);
    res.json({ success: true, message: 'Database reset and re-seeded with authentication schema' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to re-seed database' });
  }
});

// ------------------- CONNECTION FIND HELPER -------------------

// 11. GET /api/connections/find - Find existing connection between two users
app.get('/api/connections/find', (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    if (!userId1 || !userId2) {
      return res.status(400).json({ success: false, error: 'Both userId1 and userId2 required' });
    }
    const u1 = parseInt(userId1, 10);
    const u2 = parseInt(userId2, 10);

    const conn = db.prepare(`
      SELECT * FROM connections 
      WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
      ORDER BY CASE WHEN status = 'accepted' THEN 1 ELSE 2 END ASC, navratriDay ASC
      LIMIT 1
    `).get(u1, u2, u2, u1);

    res.json({ success: true, connection: conn || null });
  } catch (error) {
    console.error('Error finding connection:', error);
    res.status(500).json({ success: false, error: 'Failed to look up connection' });
  }
});

// ------------------- CHAT & MESSAGING SYSTEM -------------------

// 12. GET /api/chat/:connectionId - Fetch chat history for an accepted connection
app.get('/api/chat/:connectionId', (req, res) => {
  try {
    const connectionId = parseInt(req.params.connectionId, 10);
    const { userId } = req.query;
    const uId = userId ? parseInt(userId, 10) : null;

    const conn = db.prepare(`SELECT * FROM connections WHERE id = ?`).get(connectionId);
    if (!conn) {
      return res.status(404).json({ success: false, error: 'Connection not found' });
    }

    // Safety rule: Chat is unlocked ONLY when connection is accepted
    if (conn.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        error: 'Chat is locked! Messages can only be sent once both Saathis accept the connection.'
      });
    }

    // Access control: User must be part of this connection or admin
    if (uId && conn.senderId !== uId && conn.receiverId !== uId) {
      const adminCheck = db.prepare(`SELECT role FROM users WHERE id = ?`).get(uId);
      if (!adminCheck || adminCheck.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized to view this conversation' });
      }
    }

    const messages = db.prepare(`
      SELECT 
        m.id,
        m.connectionId,
        m.senderId,
        m.receiverId,
        m.text,
        m.createdAt,
        u.name as senderName,
        u.gender as senderGender,
        u.avatarUrl as senderAvatar
      FROM messages m
      JOIN users u ON m.senderId = u.id
      WHERE m.connectionId = ?
      ORDER BY m.createdAt ASC
    `).all(connectionId);

    const partnerId = uId === conn.senderId ? conn.receiverId : conn.senderId;
    const partner = db.prepare(`
      SELECT id, name, age, gender, area, experience, activity, socialContact, avatarUrl 
      FROM users WHERE id = ?
    `).get(partnerId);

    res.json({
      success: true,
      connection: {
        id: conn.id,
        navratriDay: conn.navratriDay,
        status: conn.status,
        partner: partner ? formatUserRow(partner) : null
      },
      messages
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chat history' });
  }
});

// 13. POST /api/chat/:connectionId - Send a chat message
app.post('/api/chat/:connectionId', (req, res) => {
  try {
    const connectionId = parseInt(req.params.connectionId, 10);
    const { senderId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }
    const sId = parseInt(senderId, 10);
    if (!sId) {
      return res.status(400).json({ success: false, error: 'Sender ID is required' });
    }

    const conn = db.prepare(`SELECT * FROM connections WHERE id = ?`).get(connectionId);
    if (!conn) {
      return res.status(404).json({ success: false, error: 'Connection not found' });
    }

    // Safety rule: Only accepted connections can exchange messages
    if (conn.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        error: 'Chat is locked! Messages can only be sent once both Saathis accept the connection.'
      });
    }

    // Verify sender belongs to connection
    if (sId !== conn.senderId && sId !== conn.receiverId) {
      return res.status(403).json({ success: false, error: 'You are not part of this connection' });
    }

    const receiverId = sId === conn.senderId ? conn.receiverId : conn.senderId;

    const result = db.prepare(`
      INSERT INTO messages (connectionId, senderId, receiverId, text)
      VALUES (?, ?, ?, ?)
    `).run(connectionId, sId, receiverId, text.trim());

    const inserted = db.prepare(`
      SELECT 
        m.id,
        m.connectionId,
        m.senderId,
        m.receiverId,
        m.text,
        m.createdAt,
        u.name as senderName,
        u.gender as senderGender,
        u.avatarUrl as senderAvatar
      FROM messages m
      JOIN users u ON m.senderId = u.id
      WHERE m.id = ?
    `).get(result.lastInsertRowid);

    persistBackupData();

    res.status(201).json({
      success: true,
      message: inserted
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// ------------------- RENDER CLOUD DURABILITY & CLIENT SYNC -------------------

// 14. POST /api/sync/restore - Seamless client-to-server data recovery for Render restarts
app.post('/api/sync/restore', (req, res) => {
  try {
    const { user, connections } = req.body;
    if (!user || (!user.id && !user.username && !user.email)) {
      return res.status(400).json({ success: false, error: 'User data required' });
    }

    let existing = null;
    if (user.id) {
      existing = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    }
    if (!existing && user.email) {
      existing = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email.toLowerCase());
    }
    if (!existing && user.username) {
      existing = db.prepare('SELECT * FROM users WHERE username = ?').get(user.username);
    }

    let activeUser = existing;

    if (!existing) {
      // Re-hydrate user record into SQLite so account is preserved across Render container wipe
      const defaultPassword = user.password || 'garba123';
      const daysStr = typeof user.availableDays === 'string' 
        ? user.availableDays 
        : JSON.stringify(user.availableDays || [1, 2, 3, 4, 5, 6, 7, 8, 9]);

      const insert = db.prepare(`
        INSERT INTO users (username, email, password, role, name, age, gender, area, experience, activity, availableDays, lookingFor, socialContact, bio, avatarUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.username || ('user_' + Math.floor(Math.random() * 10000)),
        (user.email || 'user@garba.in').toLowerCase(),
        defaultPassword,
        user.role || 'user',
        user.name || 'Garba Lover',
        user.age || 22,
        user.gender || 'Female',
        user.area || 'Wakad',
        user.experience || 'Intermediate',
        user.activity || 'Both',
        daysStr,
        user.lookingFor || 'Garba Friends',
        user.socialContact || 'Instagram: @garba',
        user.bio || 'Love Navratri Garba!',
        user.avatarUrl || null
      );

      activeUser = db.prepare('SELECT * FROM users WHERE id = ?').get(insert.lastInsertRowid);
    }

    // Re-link any cached connections if missing (avoiding duplicate reverse pairs)
    if (Array.isArray(connections) && activeUser) {
      for (const conn of connections) {
        if (conn.partnerId && conn.navratriDay) {
          const partnerExists = db.prepare('SELECT id FROM users WHERE id = ?').get(conn.partnerId);
          if (partnerExists) {
            const alreadyExists = db.prepare(`
              SELECT id FROM connections 
              WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
                AND navratriDay = ?
            `).get(activeUser.id, conn.partnerId, conn.partnerId, activeUser.id, conn.navratriDay);

            if (!alreadyExists) {
              db.prepare(`
                INSERT OR IGNORE INTO connections (senderId, receiverId, navratriDay, status)
                VALUES (?, ?, ?, ?)
              `).run(activeUser.id, conn.partnerId, conn.navratriDay, conn.status || 'accepted');
            }
          }
        }
      }
    }

    persistBackupData();

    res.json({
      success: true,
      restored: !existing,
      user: formatUserRow(activeUser)
    });
  } catch (err) {
    console.error('Sync restore error:', err);
    res.status(500).json({ success: false, error: 'Failed to restore state' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`💃 GarbaSaathi Auth & Request Backend Server running on http://localhost:${PORT}`);
});
