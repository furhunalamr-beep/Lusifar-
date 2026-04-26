import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import multer from 'multer';
import fs from 'fs';
import mammoth from 'mammoth';
import { createRequire } from 'module';
import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const db = new Database('hunter_mark5.db');
const upload = multer({ dest: uploadDir });

// Database Initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    title TEXT,
    profile_pic TEXT,
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    max_exp INTEGER DEFAULT 100,
    hp INTEGER DEFAULT 100,
    max_hp INTEGER DEFAULT 100,
    mana INTEGER DEFAULT 100,
    max_mana INTEGER DEFAULT 100,
    gold INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'E',
    str INTEGER DEFAULT 10,
    int INTEGER DEFAULT 10,
    per INTEGER DEFAULT 10,
    vit INTEGER DEFAULT 10,
    agi INTEGER DEFAULT 10,
    fatigue INTEGER DEFAULT 0,
    max_fatigue INTEGER DEFAULT 100,
    knowledge_points INTEGER DEFAULT 0,
    onboarded INTEGER DEFAULT 0,
    study_hours REAL DEFAULT 0,
    chapters_mastered INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0
  );

  INSERT OR IGNORE INTO stats (id) VALUES (1);

  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    mastery INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'Medium',
    weightage REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS study_notes (
    id TEXT PRIMARY KEY,
    chapter_id TEXT,
    title TEXT,
    content TEXT,
    tags TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    chapter_id TEXT,
    title TEXT,
    difficulty TEXT,
    questions TEXT
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id TEXT PRIMARY KEY,
    name TEXT,
    score INTEGER,
    level INTEGER,
    rank TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    level INTEGER DEFAULT 0,
    max_level INTEGER DEFAULT 5,
    cost INTEGER DEFAULT 1,
    type TEXT DEFAULT 'Passive',
    icon TEXT,
    unlocked INTEGER DEFAULT 0
  );
  
  INSERT OR IGNORE INTO skills (id, name, description, level, max_level, cost, type, icon, unlocked) VALUES 
  ('recall', 'Active Recall', 'Increases XP gained from quizzes by 20%.', 0, 5, 2, 'Passive', 'Brain', 0),
  ('pomodoro', 'Pomodoro Shield', 'Reduces fatigue accumulation speed in Focus Mode.', 0, 5, 3, 'Active', 'Shield', 0),
  ('pattern', 'Pattern Recognition', 'Higher accuracy in Board Trend Analysis.', 0, 5, 4, 'Passive', 'Search', 0),
  ('retrieval', 'Deep Retrieval', 'Unlocks hidden board questions and predicted topics.', 0, 3, 10, 'Active', 'Zap', 0);

  CREATE TABLE IF NOT EXISTS quests (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    difficulty TEXT,
    exp_reward INTEGER,
    gold_reward INTEGER,
    mana_cost INTEGER,
    status TEXT DEFAULT 'available',
    type TEXT,
    category TEXT,
    progress_data TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS shadows (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    content TEXT,
    level INTEGER DEFAULT 1,
    rank TEXT DEFAULT 'E',
    skills TEXT DEFAULT '[]',
    summoned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS vault (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    data_url TEXT
  );

  -- Initial Quests
  INSERT OR IGNORE INTO quests (id, title, description, difficulty, exp_reward, gold_reward, mana_cost, type, category) 
  VALUES 
  ('q1', 'Shadow Extraction 101', 'Summon your first shadow by uploading a document to the system.', 'E', 50, 100, 5, 'manual', 'Tutorial'),
  ('q2', 'Daily Training', '100 Push-ups, 100 Sit-ups, 100 Squats, and 10km Running.', 'D', 1500, 500, 0, 'manual', 'Daily'),
  ('q3', 'Red Gate Raid', 'Clear a high-level dungeon and extract the boss shadow.', 'B', 8000, 15000, 80, 'manual', 'Raid'),
  ('q4', 'Demon Castle', 'Infiltrate the 100th floor and defeat the Monarch of White Flames.', 'S', 500000, 1000000, 250, 'manual', 'Legacy'),
  ('q5', 'Architect Trial', 'Survival quest: survive for 10 minutes in the double dungeon.', 'S', 100000, 50000, 500, 'manual', 'Secret'),
  ('q6', 'Jeju Island', 'Exterminate the evolved ant colonies and the Ant King.', 'S', 2000000, 5000000, 1000, 'manual', 'Legendary'),
  ('q7', 'Monarch of Destruction', 'Face the Antares, the Monarch of Destruction, in the rift world.', 'EX', 10000000, 25000000, 5000, 'manual', 'Godly'),
  ('q8', 'Absolute Being Challenge', 'Reach the limits of the system and face the Architect again.', 'EX', 50000000, 100000000, 10000, 'manual', 'Endgame');

  -- Educational Missions
  INSERT OR IGNORE INTO quests (id, title, description, difficulty, exp_reward, gold_reward, mana_cost, type, category) 
  VALUES 
  ('edu1', 'Quantum Mechanics 101', 'Complete the introductory module on quantum states.', 'E', 100, 200, 10, 'academic', 'Educational'),
  ('edu2', 'String Theory Review', 'Analyze the proposed multi-dimensional frameworks.', 'D', 500, 1000, 20, 'academic', 'Educational'),
  ('edu3', 'Neural Network Foundations', 'Successfully train a basic perceptron model.', 'C', 1000, 2000, 30, 'academic', 'Educational');

`);

// Migrations for existing databases
try {
  db.exec("ALTER TABLE quests ADD COLUMN progress_data TEXT DEFAULT '[]'");
  console.log("[DATABASE] Migrated quests table: added progress_data");
} catch (e) {
  // Column already exists
}

try {
  db.exec("ALTER TABLE stats ADD COLUMN knowledge_points INTEGER DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN title TEXT");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN name TEXT");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN profile_pic TEXT");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN onboarded INTEGER DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN fatigue INTEGER DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN max_fatigue INTEGER DEFAULT 100");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN study_hours REAL DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN chapters_mastered INTEGER DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN quizzes_taken INTEGER DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE stats ADD COLUMN average_score REAL DEFAULT 0");
} catch (e) {}

try {
  db.exec("ALTER TABLE shadows ADD COLUMN level INTEGER DEFAULT 1");
  db.exec("ALTER TABLE shadows ADD COLUMN rank TEXT DEFAULT 'E'");
  db.exec("ALTER TABLE shadows ADD COLUMN skills TEXT DEFAULT '[]'");
} catch (e) {}

try {
  db.exec("ALTER TABLE shadows ADD COLUMN image_url TEXT");
} catch (e) {}

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      item_id TEXT,
      name TEXT,
      description TEXT,
      quantity INTEGER DEFAULT 1,
      type TEXT,
      rarity TEXT
    );
  `);
  
  const count = db.prepare('SELECT COUNT(*) as count FROM inventory').get() as { count: number };
  if (count.count === 0) {
    db.prepare(`
      INSERT INTO inventory (id, item_id, name, description, quantity, type, rarity)
      VALUES 
      ('inv_1', 'mana_potion', 'Mana Potion', 'Restores 100 MP when consumed.', 5, 'consumable', 'D'),
      ('inv_2', 'exp_scroll', 'High-Grade EXP Scroll', 'Grants +1000 EXP immediately upon use.', 2, 'consumable', 'C'),
      ('inv_3', 'health_potion', 'Health Potion', 'Restores 100 HP when consumed.', 5, 'consumable', 'D');
    `).run();
    console.log("[DATABASE] Added initial inventory items");
  }
} catch (e) {}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Inventory API
  app.get('/api/inventory', (req, res) => {
    try {
      const items = db.prepare(`SELECT * FROM inventory`).all();
      res.json(items.map((i: any) => ({
        id: i.id,
        itemId: i.item_id,
        name: i.name,
        description: i.description,
        quantity: i.quantity,
        type: i.type,
        rarity: i.rarity
      })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  app.post('/api/inventory/add', (req, res) => {
    const { id, itemId, name, description, quantity, type, rarity } = req.body;
    try {
      const existing = db.prepare(`SELECT * FROM inventory WHERE item_id = ?`).get(itemId) as any;
      if (existing) {
        db.prepare(`UPDATE inventory SET quantity = quantity + ? WHERE item_id = ?`).run(quantity, itemId);
      } else {
        db.prepare(`
          INSERT INTO inventory (id, item_id, name, description, quantity, type, rarity)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, itemId, name, description, quantity, type, rarity);
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to add to inventory' });
    }
  });

  app.post('/api/inventory/use', (req, res) => {
    const { itemId } = req.body;
    try {
      const existing = db.prepare(`SELECT * FROM inventory WHERE item_id = ?`).get(itemId) as any;
      if (existing && existing.quantity > 0) {
        if (existing.quantity - 1 <= 0) {
          db.prepare(`DELETE FROM inventory WHERE item_id = ?`).run(itemId);
        } else {
          db.prepare(`UPDATE inventory SET quantity = quantity - 1 WHERE item_id = ?`).run(itemId);
        }
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Item not found or depleted' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Failed to use item' });
    }
  });

  // Stripe Payment API
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency } = req.body;
      const paymentIntent = await getStripe().paymentIntents.create({
        amount,
        currency,
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vault API
  app.get('/api/vault', (req, res) => {
    try {
      const items = db.prepare('SELECT * FROM vault').all();
      res.json(items.map((i: any) => ({
        id: i.id,
        name: i.name,
        type: i.type,
        url: i.data_url
      })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/vault', (req, res) => {
    try {
      const { id, name, type, url } = req.body;
      db.prepare('INSERT INTO vault (id, name, type, data_url) VALUES (?, ?, ?, ?)').run(id, name, type, url);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/vault/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM vault WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Chapter API
  app.get('/api/chapters', (req, res) => {
    try {
      const chapters = db.prepare('SELECT * FROM chapters').all();
      res.json(chapters.map((c: any) => ({
        ...c,
        isLocked: !!c.is_locked
      })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/chapters', (req, res) => {
    try {
      const { id, title, description, mastery, isLocked, priority, weightage } = req.body;
      db.prepare(`
        INSERT OR REPLACE INTO chapters (id, title, description, mastery, is_locked, priority, weightage)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, description, mastery || 0, isLocked ? 1 : 0, priority || 'Medium', weightage || 0);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Notes API
  app.get('/api/notes', (req, res) => {
    try {
      const notes = db.prepare('SELECT * FROM study_notes ORDER BY timestamp DESC').all();
      res.json(notes.map((n: any) => ({
        ...n,
        chapterId: n.chapter_id,
        tags: JSON.parse(n.tags || '[]')
      })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/notes', (req, res) => {
    try {
      const { id, chapterId, title, content, tags } = req.body;
      db.prepare(`
        INSERT OR REPLACE INTO study_notes (id, chapter_id, title, content, tags)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, chapterId, title, content, JSON.stringify(tags || []));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Leaderboard API
  app.get('/api/leaderboard', (req, res) => {
    try {
      const leaderboard = db.prepare('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10').all();
      res.json(leaderboard);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/leaderboard', (req, res) => {
    try {
      const { id, name, score, level, rank } = req.body;
      db.prepare(`
        INSERT OR REPLACE INTO leaderboard (id, name, score, level, rank)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, name, score, level, rank);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/skills', (req, res) => {
    try {
      const skills = db.prepare('SELECT * FROM skills').all();
      res.json(skills.map((s: any) => ({
        ...s,
        maxLevel: s.max_level,
        unlocked: !!s.unlocked
      })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/skills/upgrade', (req, res) => {
    try {
      const { id, level, unlocked } = req.body;
      db.prepare('UPDATE skills SET level = ?, unlocked = ? WHERE id = ?').run(level, unlocked ? 1 : 0, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/stats', (req, res) => {
    try {
      const stats = db.prepare(`
        SELECT name, title, profile_pic as profilePic, level, exp, max_exp as maxExp, hp, max_hp as maxHp, 
               mana, max_mana as maxMana, fatigue, max_fatigue as maxFatigue, gold, rank, 
               str, int, per, vit, agi, knowledge_points as knowledgePoints,
               onboarded, study_hours as studyHours, chapters_mastered as chaptersMastered,
               quizzes_taken as quizzesTaken, average_score as averageScore
         FROM stats WHERE id = 1
      `).get() as any;
      if (stats) {
        stats.onboarded = !!stats.onboarded;
      }
      res.json(stats);
    } catch (e: any) {
      console.error("[SERVER] Get Stats Error:", e);
      res.status(500).json({ error: e.message || 'Failed to fetch stats' });
    }
  });

  app.post('/api/stats/update', (req, res) => {
    try {
      const { name, title, profilePic, level, exp, maxExp, hp, maxHp, mana, maxMana, fatigue, maxFatigue, gold, rank, str, int, per, vit, agi, knowledgePoints, onboarded, studyHours, chaptersMastered, quizzesTaken, averageScore } = req.body;
      const stmt = db.prepare(`
        UPDATE stats SET 
          name = ?, title = ?, profile_pic = ?, level = ?, exp = ?, max_exp = ?, hp = ?, max_hp = ?, 
          mana = ?, max_mana = ?, fatigue = ?, max_fatigue = ?, gold = ?, rank = ?, 
          str = ?, int = ?, per = ?, vit = ?, agi = ?, knowledge_points = ?,
          onboarded = ?, study_hours = ?, chapters_mastered = ?, quizzes_taken = ?, average_score = ?
        WHERE id = 1
      `).run(name, title, profilePic, level, exp, maxExp, hp, maxHp, mana, maxMana, fatigue, maxFatigue, gold, rank, str, int, per, vit, agi, knowledgePoints, onboarded ? 1 : 0, studyHours, chaptersMastered, quizzesTaken, averageScore);
      res.json({ success: true });
    } catch (e: any) {
      console.error("[SERVER] Update Stats Error:", e);
      res.status(500).json({ error: e.message || 'Failed to update stats' });
    }
  });

  app.get('/api/quests', (req, res) => {
    try {
      const quests = db.prepare(`
        SELECT id, title, description, difficulty, 
               exp_reward as expReward, gold_reward as goldReward, 
               mana_cost as manaCost, status, type, category,
               progress_data as progressData
        FROM quests
      `).all();
      res.json(quests.map((q: any) => ({
        ...q,
        progressLogs: JSON.parse(q.progressData || '[]')
      })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/quests', (req, res) => {
    try {
      const { id, title, description, difficulty, expReward, goldReward, manaCost, type, category } = req.body;
      const stmt = db.prepare(`
        INSERT INTO quests (id, title, description, difficulty, exp_reward, gold_reward, mana_cost, type, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, title, description, difficulty, expReward, goldReward, manaCost, type, category);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/quests/:id/start', (req, res) => {
    try {
      db.prepare("UPDATE quests SET status = 'active' WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/quests/:id/progress', (req, res) => {
    try {
      const { note } = req.body;
      const quest = db.prepare('SELECT progress_data FROM quests WHERE id = ?').get(req.params.id) as any;
      if (!quest) return res.status(404).json({ error: 'Quest not found' });
      
      const logs = JSON.parse(quest.progress_data || '[]');
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        note
      });
      
      db.prepare('UPDATE quests SET progress_data = ? WHERE id = ?').run(JSON.stringify(logs), req.params.id);
      res.json({ success: true, logs });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/quests/:id/complete', (req, res) => {
    try {
      db.prepare("UPDATE quests SET status = 'completed' WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/quests/:id/delete', (req, res) => {
    try {
      db.prepare('DELETE FROM quests WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/shadows', (req, res) => {
    try {
      const shadows = db.prepare(`
        SELECT id, name, type, content, summoned_at as summonedAt, level, rank, skills, image_url as imageUrl 
        FROM shadows 
        ORDER BY summoned_at DESC
      `).all();
      res.json(shadows.map((s: any) => ({
        ...s,
        skills: JSON.parse(s.skills || '[]')
      })));
    } catch (e) {
      console.error("[SERVER] Fetch Shadows Error:", e);
      // Fallback if summoned_at is missing (old DB)
      const shadows = db.prepare('SELECT id, name, type, content FROM shadows').all();
      res.json(shadows.map(s => ({ ...s, summonedAt: new Date().toISOString() })));
    }
  });

  app.post('/api/shadows/:id/skills', (req, res) => {
    try {
      const skillsStr = JSON.stringify(req.body.skills);
      db.prepare('UPDATE shadows SET skills = ? WHERE id = ?').run(skillsStr, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update skills' });
    }
  });

  app.post('/api/shadows/:id/image', (req, res) => {
    db.prepare('UPDATE shadows SET image_url = ? WHERE id = ?').run(req.body.imageUrl, req.params.id);
    res.json({ success: true });
  });

  app.post('/api/shadows', upload.single('file'), async (req, res) => {
    try {
      const { id, name, type } = req.body;
      let content = req.body.content || '';
      
      const file = (req as any).file;
      if (file) {
        const filePath = file.path;
        const extension = path.extname(file.originalname).toLowerCase();

        if (extension === '.docx') {
          const result = await mammoth.extractRawText({ path: filePath });
          content = result.value;
        } else if (extension === '.pdf') {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdf(dataBuffer);
          content = data.text;
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(extension)) {
          const base64 = fs.readFileSync(filePath, 'base64');
          const mimeType = extension === '.png' ? 'image/png' : extension === '.gif' ? 'image/gif' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
          req.body.imageUrl = `data:${mimeType};base64,${base64}`;
          content = ''; // Images have no text content yet
        } else {
          content = fs.readFileSync(filePath, 'utf-8');
        }

        fs.unlinkSync(filePath);
        console.log(`[SERVER] Processed ${file.originalname}`);
      } else {
        console.log(`[SERVER] No file uploaded for shadow ${name}, using text content if provided.`);
      }
      
      const stmt = db.prepare(`
        INSERT INTO shadows (id, name, type, content, level, rank, skills, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, name, type, content, req.body.level || 1, req.body.rank || 'E', req.body.skills || '[]', req.body.imageUrl || null);
      res.json({ success: true });
    } catch (error) {
      console.error('[SERVER] Shadow Summon Error:', error);
      res.status(500).json({ error: 'Shadow summoning failed' });
    }
  });

  app.get('/api/logs', (req, res) => {
    const logs = db.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 50').all();
    res.json(logs);
  });

  app.post('/api/logs', (req, res) => {
    const { id, message, type } = req.body;
    db.prepare('INSERT INTO logs (id, message, type) VALUES (?, ?, ?)').run(id, message, type);
    res.json({ success: true });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`System initialized at http://localhost:${PORT}`);
  });
}

startServer();
