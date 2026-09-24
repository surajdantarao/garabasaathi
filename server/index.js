const express = require('express');
const cors = require('cors');
const db = require('./db');
const { seedDatabase } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database & seed
seedDatabase(db);

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

    // Check Special Admin Credentials: username ___suraj_sd__ & password Knowledge
    if (input === '___suraj_sd__' && password === 'Knowledge') {
      let adminUser = db.prepare(`SELECT * FROM users WHERE username = '___suraj_sd__'`).get();
      if (!adminUser) {
        adminUser = db.prepare(`SELECT * FROM users WHERE role = 'admin'`).get();
      }
      if (adminUser) {
        return res.json({ success: true, message: 'Welcome Admin!', user: formatUserRow(adminUser) });
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

      // Attach connection status for each user
      users = users.map(u => {
        let connStatus = null;
        if (targetDay && targetDay !== 'All') {
          const dayNum = parseInt(targetDay, 10);
          const conn = db.prepare(`
            SELECT status FROM connections 
            WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
              AND navratriDay = ?
          `).get(cUserId, u.id, u.id, cUserId, dayNum);

          if (conn) connStatus = conn.status;
        }

        // Privacy: Hide public social contact unless connection status is 'accepted'
        const safeSocial = connStatus === 'accepted' ? u.socialContact : '🔒 Protected (Connect to View)';

        return {
          ...u,
          connectionStatus: connStatus,
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
      const isAccepted = db.prepare(`
        SELECT id FROM connections 
        WHERE ((senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?))
          AND status = 'accepted'
      `).get(currentUserId, user.id, user.id, currentUserId);

      if (!isAccepted) {
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

    // Group accepted connections by Navratri day
    const acceptedGrouped = {};
    for (let d = 1; d <= 9; d++) {
      acceptedGrouped[`Day ${d}`] = [];
    }

    acceptedRows.forEach(item => {
      const dayKey = `Day ${item.navratriDay}`;
      if (!acceptedGrouped[dayKey]) acceptedGrouped[dayKey] = [];
      acceptedGrouped[dayKey].push(item);
    });

    res.json({
      success: true,
      stats: {
        receivedPendingCount: receivedPending.length,
        sentPendingCount: sentPending.length,
        acceptedCount: acceptedRows.length
      },
      receivedPending,
      sentPending,
      accepted: acceptedRows,
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
    // Wipe all connection records involving this user
    db.prepare(`DELETE FROM connections WHERE senderId = ? OR receiverId = ?`).run(userId, userId);
    // Delete user account permanently
    const info = db.prepare(`DELETE FROM users WHERE id = ?`).run(userId);
    if (info.changes === 0) return res.status(404).json({ success: false, error: 'User account not found' });
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
        uSend.area as senderArea,
        uSend.socialContact as senderContact,
        uRec.id as receiverId,
        uRec.name as receiverName,
        uRec.username as receiverUsername,
        uRec.area as receiverArea,
        uRec.socialContact as receiverContact
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

// 9. GET /api/admin/stats - Admin Dashboard Stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const totalUsers = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role != 'admin'`).get().count;
    const totalConnections = db.prepare(`SELECT COUNT(*) as count FROM connections`).get().count;
    const pendingRequests = db.prepare(`SELECT COUNT(*) as count FROM connections WHERE status = 'pending'`).get().count;
    const acceptedConnections = db.prepare(`SELECT COUNT(*) as count FROM connections WHERE status = 'accepted'`).get().count;
    
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

// Start Server
app.listen(PORT, () => {
  console.log(`💃 GarbaSaathi Auth & Request Backend Server running on http://localhost:${PORT}`);
});
