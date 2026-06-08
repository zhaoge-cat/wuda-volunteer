/**
 * Database module - SQLite initialization with better-sqlite3
 */
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'wuda.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Create all tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  school TEXT,
  role TEXT NOT NULL DEFAULT 'volunteer' CHECK(role IN ('volunteer','captain','station_leader','admin')),
  avatar TEXT,
  composite_score REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  location TEXT,
  shifts_needed INTEGER DEFAULT 0,
  shifts_filled INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming','ongoing','completed')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT,
  volunteers_needed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  role TEXT NOT NULL DEFAULT 'volunteer',
  status TEXT DEFAULT 'registered' CHECK(status IN ('registered','checked_in','completed','cancelled')),
  registered_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS service_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  shift_id INTEGER NOT NULL REFERENCES shifts(id),
  attendance_score REAL DEFAULT 0,
  quality_score REAL DEFAULT 0,
  responsibility_score REAL DEFAULT 0,
  discipline_score REAL DEFAULT 0,
  total_score REAL DEFAULT 0,
  level TEXT DEFAULT 'improve' CHECK(level IN ('excellent','good','pass','improve')),
  check_in_time TEXT,
  check_out_time TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('level','role','blindbox')),
  rarity TEXT DEFAULT 'common' CHECK(rarity IN ('common','rare','legendary')),
  series TEXT,
  condition TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  pinned INTEGER DEFAULT 0,
  unlocked_at TEXT DEFAULT (datetime('now')),
  is_duplicate INTEGER DEFAULT 0,
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS blind_box_draws (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  drawn_at TEXT DEFAULT (datetime('now')),
  is_new INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS honors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  period TEXT,
  date TEXT DEFAULT (datetime('now')),
  description TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS benefits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  required_level TEXT,
  required_series TEXT,
  type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_benefits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  benefit_id INTEGER NOT NULL REFERENCES benefits(id),
  unlocked_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, benefit_id)
);
`)

// Seed data - check if already seeded
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
if (userCount.count === 0) {
  const insertUsers = db.prepare(`
    INSERT INTO users (name, phone, password, role, school) VALUES
      ('管理员', '13800000000', 'admin123', 'admin', '平台管理'),
      ('张三', '13800000001', '123456', 'volunteer', '浙江大学'),
      ('李四', '13800000002', '123456', 'captain', '杭州电子科技大学'),
      ('王五', '13800000003', '123456', 'station_leader', '浙江工业大学')
  `)
  insertUsers.run()

  const insertBadges = db.prepare(`
    INSERT INTO badges (name, description, icon, category, rarity, series) VALUES
      ('金质服务徽章', '综合评价优秀等级', '🏆', 'level', 'legendary', NULL),
      ('银质服务徽章', '综合评价良好等级', '🥈', 'level', 'rare', NULL),
      ('铜质服务徽章', '综合评价合格等级', '🥉', 'level', 'common', NULL),
      ('小队长徽章', '担任小队长岗位', '⭐', 'role', 'rare', NULL),
      ('站长徽章', '担任站点站长岗位', '🏅', 'role', 'legendary', NULL),
      ('西湖风景·普通', '西湖系列普通款', '🌊', 'blindbox', 'common', '西湖风景'),
      ('西湖风景·稀有', '西湖系列稀有款', '🌅', 'blindbox', 'rare', '西湖风景'),
      ('西湖风景·隐藏', '西湖系列隐藏限定款', '🏯', 'blindbox', 'legendary', '西湖风景'),
      ('灵隐禅意·普通', '灵隐系列普通款', '🕯️', 'blindbox', 'common', '灵隐禅意'),
      ('灵隐禅意·稀有', '灵隐系列稀有款', '🪷', 'blindbox', 'rare', '灵隐禅意'),
      ('灵隐禅意·隐藏', '灵隐系列隐藏限定款', '🙏', 'blindbox', 'legendary', '灵隐禅意'),
      ('宋城千古情·普通', '宋城系列普通款', '🎭', 'blindbox', 'common', '宋城千古情'),
      ('宋城千古情·稀有', '宋城系列稀有款', '🎪', 'blindbox', 'rare', '宋城千古情'),
      ('宋城千古情·隐藏', '宋城系列隐藏限定款', '👑', 'blindbox', 'legendary', '宋城千古情')
  `)
  insertBadges.run()

  const insertBenefits = db.prepare(`
    INSERT INTO benefits (name, description, required_level, type) VALUES
      ('研学活动优先报名', '可优先报名研学活动', 'good', 'activity'),
      ('特色活动参与资格', '获得特色活动参与资格', 'excellent', 'activity'),
      ('社会实践证明下载', '可下载社会实践证明', 'pass', 'certificate'),
      ('平台专属身份标识', '获得平台专属身份标识', 'good', 'identity')
  `)
  insertBenefits.run()

  const insertActivities = db.prepare(`
    INSERT INTO activities (title, description, date, location, shifts_needed, shifts_filled, status) VALUES
      ('西湖景区五一志愿服务', '五一假期西湖景区游客引导与咨询服务', '2026-05-01', '西湖景区', 30, 28, 'completed'),
      ('灵隐寺周末志愿导览', '灵隐寺周末游客导览与秩序维护', '2026-06-15', '灵隐寺', 15, 5, 'upcoming'),
      ('宋城景区暑期服务', '暑期宋城景区志愿服务活动', '2026-07-01', '宋城景区', 25, 0, 'upcoming')
  `)
  insertActivities.run()

  // Sample shifts for activity 1
  const insertShifts = db.prepare(`
    INSERT INTO shifts (activity_id, date, start_time, end_time, location, volunteers_needed) VALUES
      (1, '2026-05-01', '08:00', '12:00', '西湖断桥', 10),
      (1, '2026-05-01', '13:00', '17:00', '西湖白堤', 10),
      (1, '2026-05-02', '08:00', '12:00', '西湖苏堤', 10),
      (2, '2026-06-15', '08:00', '12:00', '灵隐寺入口', 8),
      (2, '2026-06-15', '13:00', '17:00', '灵隐寺大雄宝殿', 7),
      (3, '2026-07-01', '08:00', '12:00', '宋城入口', 13),
      (3, '2026-07-01', '13:00', '17:00', '宋城剧场', 12)
  `)
  insertShifts.run()

  // Sample registrations for user 2 (张三)
  const insertRegistrations = db.prepare(`
    INSERT INTO registrations (user_id, activity_id, role, status) VALUES
      (2, 1, 'volunteer', 'completed'),
      (2, 2, 'volunteer', 'registered')
  `)
  insertRegistrations.run()

  // Sample service records for user 2 (张三)
  const insertServiceRecords = db.prepare(`
    INSERT INTO service_records (user_id, shift_id, attendance_score, quality_score, responsibility_score, discipline_score, total_score, level, check_in_time, check_out_time) VALUES
      (2, 1, 95, 88, 92, 90, 91.15, 'excellent', '2026-05-01 07:55', '2026-05-01 12:05'),
      (2, 2, 85, 80, 88, 82, 83.5, 'good', '2026-05-01 12:58', '2026-05-01 17:02')
  `)
  insertServiceRecords.run()

  // Sample user badges for user 2 (张三)
  const insertUserBadges = db.prepare(`
    INSERT INTO user_badges (user_id, badge_id, pinned, is_duplicate) VALUES
      (2, 1, 1, 0),
      (2, 4, 0, 0),
      (2, 6, 0, 0),
      (2, 9, 0, 0),
      (2, 12, 0, 0)
  `)
  insertUserBadges.run()

  // Sample blind box draws for user 2 (张三)
  const insertBlindBoxDraws = db.prepare(`
    INSERT INTO blind_box_draws (user_id, badge_id, is_new) VALUES
      (2, 6, 1),
      (2, 9, 1),
      (2, 12, 1)
  `)
  insertBlindBoxDraws.run()

  // Sample honors for user 2 (张三)
  const insertHonors = db.prepare(`
    INSERT INTO honors (user_id, type, title, period, description) VALUES
      (2, 'monthly_star', '月度之星', '2026-05', '5月份志愿服务表现突出，获评月度之星'),
      (2, 'service_milestone', '服务时长50小时', NULL, '累计志愿服务时长达到50小时'),
      (2, 'excellence', '优秀志愿者', '2026-Q1', '第一季度综合评价优秀')
  `)
  insertHonors.run()

  // Sample notifications for user 2 (张三)
  const insertNotifications = db.prepare(`
    INSERT INTO notifications (user_id, type, title, content, read) VALUES
      (2, 'activity', '活动报名成功', '您已成功报名"灵隐寺周末志愿导览"活动', 1),
      (2, 'badge', '获得新徽章', '恭喜您获得"金质服务徽章"！', 1),
      (2, 'system', '系统通知', '五一志愿服务活动已结束，感谢您的参与！', 0),
      (2, 'evaluation', '服务评价已出', '您在"西湖景区五一志愿服务"的评价已出，综合得分91.15分', 0)
  `)
  insertNotifications.run()

  // Update composite score for user 2
  db.prepare('UPDATE users SET composite_score = 87.325 WHERE id = 2').run()

  // Unlock benefit for user 2 (社会实践证明下载 - requires 'pass' level)
  db.prepare('INSERT INTO user_benefits (user_id, benefit_id) VALUES (2, 3)').run()
}

export default db
