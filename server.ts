console.log("Starting server.ts...");

import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = process.cwd();

async function startServer() {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  let db: any;
  try {
    const rootDir = process.cwd();
    db = new Database(path.join(rootDir, "pac.db"));
    console.log("Database initialized successfully");

    // Initialize Database Schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'coach', 'trainer', 'psychologist', 'athlete')) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS athletes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        name TEXT NOT NULL,
        birth_date TEXT,
        weight_class TEXT,
        belt TEXT,
        team TEXT,
        injury_history TEXT,
        goals TEXT,
        score INTEGER DEFAULT 0,
        classification TEXT DEFAULT 'Iniciante competitivo',
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS physical_evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        athlete_id INTEGER,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        pull_ups INTEGER,
        push_ups INTEGER,
        kimono_grip_seconds INTEGER,
        burpees INTEGER,
        sprint_seconds REAL,
        sit_ups INTEGER,
        rounds_resistance INTEGER,
        weight REAL,
        FOREIGN KEY (athlete_id) REFERENCES athletes(id)
      );

      CREATE TABLE IF NOT EXISTS psychological_evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        athlete_id INTEGER,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        focus_score INTEGER,
        resilience_score INTEGER,
        motivation_score INTEGER,
        stress_control_score INTEGER,
        self_confidence_score INTEGER,
        anxiety_control_score INTEGER,
        mental_imagery_score INTEGER,
        goal_setting_score INTEGER,
        emotional_regulation_score INTEGER,
        overall_score INTEGER,
        FOREIGN KEY (athlete_id) REFERENCES athletes(id)
      );

      CREATE TABLE IF NOT EXISTS training_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        athlete_id INTEGER,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        type TEXT CHECK(type IN ('técnico', 'sparring', 'condicionamento', 'estratégia', 'recuperação')),
        intensity INTEGER, -- 1 to 10
        duration_minutes INTEGER,
        notes TEXT,
        FOREIGN KEY (athlete_id) REFERENCES athletes(id)
      );

      CREATE TABLE IF NOT EXISTS competitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        athlete_id INTEGER,
        name TEXT,
        date TEXT,
        category TEXT,
        result TEXT, -- 'Gold', 'Silver', 'Bronze', 'Participant'
        points_earned INTEGER,
        FOREIGN KEY (athlete_id) REFERENCES athletes(id)
      );

      CREATE TABLE IF NOT EXISTS nutrition_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        athlete_id INTEGER,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        weight REAL,
        height REAL,
        age INTEGER,
        gender TEXT CHECK(gender IN ('M', 'F')),
        activity_level REAL, -- 1.2 to 1.9
        body_fat_pct REAL,
        bmr INTEGER,
        tdee INTEGER,
        protein_g INTEGER,
        carbs_g INTEGER,
        fats_g INTEGER,
        goal TEXT,
        breakfast TEXT,
        lunch TEXT,
        dinner TEXT,
        snacks TEXT,
        supplements TEXT,
        notes TEXT,
        FOREIGN KEY (athlete_id) REFERENCES athletes(id)
      );

      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        type TEXT
      );

      CREATE TABLE IF NOT EXISTS signed_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        athlete_id INTEGER NOT NULL,
        document_id INTEGER NOT NULL,
        signed_at TEXT DEFAULT CURRENT_TIMESTAMP,
        signature_name TEXT NOT NULL,
        form_data TEXT, -- JSON string
        FOREIGN KEY (athlete_id) REFERENCES athletes(id),
        FOREIGN KEY (document_id) REFERENCES documents(id)
      );
    `);

    // Seed initial data if empty
    const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
    if (userCount.count === 0) {
      const insertUser = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
      insertUser.run("Admin PAC", "admin@pac.com", "admin123", "admin");
      insertUser.run("Coach Silva", "coach@pac.com", "coach123", "coach");
      insertUser.run("Atleta Exemplo", "atleta@pac.com", "atleta123", "athlete");
      
      const athleteId = db.prepare("INSERT INTO athletes (user_id, name, weight_class, belt, score, classification) VALUES (?, ?, ?, ?, ?, ?)").run(3, "Atleta Exemplo", "Leve", "Marrom", 350, "Alto desempenho").lastInsertRowid;
      
      // Seed some evaluations
      const insertPhysical = db.prepare("INSERT INTO physical_evaluations (athlete_id, date, pull_ups, push_ups, kimono_grip_seconds, burpees, sprint_seconds, sit_ups, rounds_resistance, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      insertPhysical.run(athleteId, '2024-01-10', 12, 40, 45, 30, 12.5, 50, 5, 76.5);
      insertPhysical.run(athleteId, '2024-02-15', 15, 45, 55, 35, 11.8, 60, 6, 75.8);
      
      const insertPsych = db.prepare(`
        INSERT INTO psychological_evaluations (
          athlete_id, date, focus_score, resilience_score, motivation_score, stress_control_score,
          self_confidence_score, anxiety_control_score, mental_imagery_score, goal_setting_score, emotional_regulation_score,
          overall_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertPsych.run(athleteId, '2024-01-10', 70, 65, 80, 60, 75, 60, 55, 70, 65, 68);
      insertPsych.run(athleteId, '2024-02-15', 75, 70, 85, 65, 80, 65, 60, 75, 70, 74);

      // Seed documents
      const docs = [
        { id: 1, title: "Manual do Atleta Campeão", type: "PDF" },
        { id: 2, title: "Código de Conduta", type: "PDF" },
        { id: 3, title: "Código Mental do Campeão", type: "PDF" },
        { id: 4, title: "Sistema Operacional do PAC", type: "PDF" },
        { id: 5, title: "Mapa de Valências do Atleta de Jiu-Jitsu", type: "PDF" },
        { id: 6, title: "Sistema de Carreira do Atleta", type: "PDF" },
        { id: 7, title: "Pirâmide de Formação", type: "PDF" },
        { id: 8, title: "TAF – Teste de Aptidão Física", type: "PDF" },
        { id: 9, title: "Termo de Responsabilidade e Compromisso", type: "PDF" },
        { id: 10, title: "Teste Psicológico – PAC", type: "PDF" },
        { id: 11, title: "Modelo de Centro de Alto Rendimento", type: "PDF" }
      ];
      const insertDoc = db.prepare("INSERT OR IGNORE INTO documents (id, title, type) VALUES (?, ?, ?)");
      docs.forEach(doc => insertDoc.run(doc.id, doc.title, doc.type));
    }
  } catch (dbError) {
    console.error("Database initialization failed:", dbError);
    // Continue without DB if necessary, or handle accordingly
  }

  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  wss.on('error', (error) => {
    console.error('WebSocket Server Error:', error);
  });

  wss.on('connection', (ws) => {
    ws.on('error', (error) => {
      console.error('WebSocket Client Connection Error:', error);
    });
  });

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/ping", (req, res) => {
    res.send("PONG - SERVER IS RUNNING");
  });

  app.get("/api/debug", (req, res) => {
    res.json({
      env: process.env.NODE_ENV || "development",
      cwd: process.cwd(),
      distExists: fs.existsSync(path.join(process.cwd(), "dist")),
      indexExists: fs.existsSync(path.join(process.cwd(), "index.html")),
      distIndexExists: fs.existsSync(path.join(process.cwd(), "dist", "index.html"))
    });
  });

  app.get("/api/admin/audit", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const audit: any = {
        timestamp: new Date().toISOString(),
        orphans: {},
        integrity: {},
        stats: {}
      };

      // 1. Orphaned Records
      audit.orphans.physical = db.prepare("SELECT COUNT(*) as count FROM physical_evaluations WHERE athlete_id NOT IN (SELECT id FROM athletes)").get().count;
      audit.orphans.psychological = db.prepare("SELECT COUNT(*) as count FROM psychological_evaluations WHERE athlete_id NOT IN (SELECT id FROM athletes)").get().count;
      audit.orphans.training = db.prepare("SELECT COUNT(*) as count FROM training_logs WHERE athlete_id NOT IN (SELECT id FROM athletes)").get().count;
      audit.orphans.competitions = db.prepare("SELECT COUNT(*) as count FROM competitions WHERE athlete_id NOT IN (SELECT id FROM athletes)").get().count;
      audit.orphans.nutrition = db.prepare("SELECT COUNT(*) as count FROM nutrition_plans WHERE athlete_id NOT IN (SELECT id FROM athletes)").get().count;

      // 2. User Integrity
      audit.integrity.athletesWithoutUsers = db.prepare("SELECT COUNT(*) as count FROM athletes WHERE user_id NOT IN (SELECT id FROM users)").get().count;
      audit.integrity.usersWithoutAthletes = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'athlete' AND id NOT IN (SELECT user_id FROM athletes)").get().count;

      // 3. Score Faithfulness (Sample check for top 10 athletes)
      const athletes = db.prepare("SELECT id, name, score FROM athletes ORDER BY score DESC LIMIT 10").all();
      audit.integrity.scoreChecks = athletes.map((a: any) => {
        const compPoints = db.prepare("SELECT SUM(points_earned) as total FROM competitions WHERE athlete_id = ?").get(a.id).total || 0;
        const physCount = db.prepare("SELECT COUNT(*) as count FROM physical_evaluations WHERE athlete_id = ?").get(a.id).count;
        const psychCount = db.prepare("SELECT COUNT(*) as count FROM psychological_evaluations WHERE athlete_id = ?").get(a.id).count;
        const trainCount = db.prepare("SELECT COUNT(*) as count FROM training_logs WHERE athlete_id = ?").get(a.id).count;
        
        // Simplified expected score calculation (matching App.tsx logic roughly)
        // Note: Real calculation is complex, but we can check if it's within a reasonable range
        const expectedMin = compPoints + (physCount * 5) + (psychCount * 5) + (trainCount * 2);
        return {
          id: a.id,
          name: a.name,
          currentScore: a.score,
          calculatedPoints: expectedMin,
          isFaithful: a.score >= expectedMin // Score can be higher due to other factors or base points
        };
      });

      // 4. Global Stats
      audit.stats.totalAthletes = db.prepare("SELECT COUNT(*) as count FROM athletes").get().count;
      audit.stats.totalEvaluations = db.prepare("SELECT (SELECT COUNT(*) FROM physical_evaluations) + (SELECT COUNT(*) FROM psychological_evaluations) as total").get().total;
      audit.stats.avgScoreByBelt = db.prepare("SELECT belt, AVG(score) as avg_score FROM athletes GROUP BY belt").all();

      res.json(audit);
    } catch (e: any) {
      res.status(500).json({ error: "Audit failed: " + e.message });
    }
  });

  // WebSocket broadcast helper
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // API Routes
  app.get("/api/athletes", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const athletes = db.prepare(`
        SELECT a.*, u.email, 
        (SELECT weight FROM physical_evaluations WHERE athlete_id = a.id ORDER BY date DESC LIMIT 1) as latest_weight,
        (SELECT COUNT(*) FROM training_logs WHERE athlete_id = a.id AND date > date('now', '-30 days')) as training_count_30d,
        (SELECT overall_score FROM psychological_evaluations WHERE athlete_id = a.id ORDER BY date DESC LIMIT 1) as latest_psych_score,
        (SELECT (pull_ups + push_ups + sit_ups) FROM physical_evaluations WHERE athlete_id = a.id ORDER BY date DESC LIMIT 1) as latest_physical_power
        FROM athletes a 
        JOIN users u ON a.user_id = u.id
      `).all();
      res.json(athletes);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch athletes" });
    }
  });

  app.get("/api/athletes/:id", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const athlete = db.prepare("SELECT * FROM athletes WHERE id = ?").get(req.params.id);
    if (!athlete) return res.status(404).json({ error: "Athlete not found" });
    
    const physical = db.prepare("SELECT * FROM physical_evaluations WHERE athlete_id = ? ORDER BY date DESC").all(req.params.id);
    const psychological = db.prepare("SELECT * FROM psychological_evaluations WHERE athlete_id = ? ORDER BY date DESC").all(req.params.id);
    const training = db.prepare("SELECT * FROM training_logs WHERE athlete_id = ? ORDER BY date DESC").all(req.params.id);
    const competitions = db.prepare("SELECT * FROM competitions WHERE athlete_id = ? ORDER BY date DESC").all(req.params.id);
    const nutrition = db.prepare("SELECT * FROM nutrition_plans WHERE athlete_id = ? ORDER BY date DESC").all(req.params.id);

    res.json({ ...athlete, physical, psychological, training, competitions, nutrition });
  });

  app.get("/api/athletes/:id/nutrition", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const nutrition = db.prepare("SELECT * FROM nutrition_plans WHERE athlete_id = ? ORDER BY date DESC").all(req.params.id);
    res.json(nutrition);
  });

  app.post("/api/athletes/:id/nutrition", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { 
      weight, height, age, gender, activity_level, body_fat_pct, 
      goal, breakfast, lunch, dinner, snacks, supplements, notes 
    } = req.body;

    // Nutritionist Logic: Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'M') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = Math.round(bmr * activity_level);
    
    // Macro distribution based on goal (High Performance)
    let protein_g, carbs_g, fats_g;
    if (goal === 'Cut') {
      protein_g = Math.round(weight * 2.2);
      fats_g = Math.round(weight * 0.8);
      carbs_g = Math.round((tdee * 0.8 - (protein_g * 4 + fats_g * 9)) / 4);
    } else if (goal === 'Bulk') {
      protein_g = Math.round(weight * 2.0);
      fats_g = Math.round(weight * 1.0);
      carbs_g = Math.round((tdee * 1.1 - (protein_g * 4 + fats_g * 9)) / 4);
    } else {
      protein_g = Math.round(weight * 1.8);
      fats_g = Math.round(weight * 0.9);
      carbs_g = Math.round((tdee - (protein_g * 4 + fats_g * 9)) / 4);
    }

    const info = db.prepare(`
      INSERT INTO nutrition_plans (
        athlete_id, weight, height, age, gender, activity_level, body_fat_pct, 
        bmr, tdee, protein_g, carbs_g, fats_g, goal, 
        breakfast, lunch, dinner, snacks, supplements, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.params.id, weight, height, age, gender, activity_level, body_fat_pct,
      bmr, tdee, protein_g, carbs_g, fats_g, goal,
      breakfast, lunch, dinner, snacks, supplements, notes
    );
    
    const athlete = db.prepare("SELECT name FROM athletes WHERE id = ?").get(req.params.id) as any;
    broadcast({ type: 'NOTIFICATION', title: 'Novo Plano Nutricional', message: `Plano de alta performance gerado para ${athlete.name}.` });

    res.json({ id: info.lastInsertRowid, bmr, tdee, macros: { protein_g, carbs_g, fats_g } });
  });

  app.post("/api/athletes", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { name, email, weight_class, belt, birth_date, goals } = req.body;
    try {
      const userResult = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, 'atleta123', 'athlete');
      const userId = userResult.lastInsertRowid;
      const athleteResult = db.prepare("INSERT INTO athletes (user_id, name, weight_class, belt, birth_date, goals) VALUES (?, ?, ?, ?, ?, ?)").run(userId, name, weight_class, belt, birth_date, goals);
      res.json({ id: athleteResult.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/evaluations/physical", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { athlete_id, pull_ups, push_ups, kimono_grip_seconds, burpees, sprint_seconds, sit_ups, rounds_resistance, weight } = req.body;
    const info = db.prepare(`
      INSERT INTO physical_evaluations (athlete_id, pull_ups, push_ups, kimono_grip_seconds, burpees, sprint_seconds, sit_ups, rounds_resistance, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(athlete_id, pull_ups, push_ups, kimono_grip_seconds, burpees, sprint_seconds, sit_ups, rounds_resistance, weight);
    
    // Update athlete score (simplified logic)
    db.prepare("UPDATE athletes SET score = score + 5 WHERE id = ?").run(athlete_id);
    
    const athlete = db.prepare("SELECT name FROM athletes WHERE id = ?").get(athlete_id) as any;
    broadcast({ type: 'NOTIFICATION', title: 'Nova Avaliação TAF', message: `Atleta ${athlete.name} realizou um TAF.` });

    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/evaluations/psychological", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { 
      athlete_id, 
      focus_score, 
      resilience_score, 
      motivation_score, 
      stress_control_score,
      self_confidence_score,
      anxiety_control_score,
      mental_imagery_score,
      goal_setting_score,
      emotional_regulation_score
    } = req.body;
    
    const scores = [
      focus_score, 
      resilience_score, 
      motivation_score, 
      stress_control_score,
      self_confidence_score,
      anxiety_control_score,
      mental_imagery_score,
      goal_setting_score,
      emotional_regulation_score
    ];
    const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    const info = db.prepare(`
      INSERT INTO psychological_evaluations (
        athlete_id, focus_score, resilience_score, motivation_score, stress_control_score,
        self_confidence_score, anxiety_control_score, mental_imagery_score, goal_setting_score, emotional_regulation_score,
        overall_score
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      athlete_id, focus_score, resilience_score, motivation_score, stress_control_score,
      self_confidence_score, anxiety_control_score, mental_imagery_score, goal_setting_score, emotional_regulation_score,
      overall
    );
    
    db.prepare("UPDATE athletes SET score = score + 5 WHERE id = ?").run(athlete_id);
    
    const athlete = db.prepare("SELECT name FROM athletes WHERE id = ?").get(athlete_id) as any;
    broadcast({ type: 'NOTIFICATION', title: 'Nova Avaliação Mental', message: `Atleta ${athlete.name} realizou uma avaliação mental.` });

    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/training", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { athlete_id, type, intensity, duration_minutes, notes } = req.body;
    const info = db.prepare(`
      INSERT INTO training_logs (athlete_id, type, intensity, duration_minutes, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(athlete_id, type, intensity, duration_minutes, notes);
    
    db.prepare("UPDATE athletes SET score = score + 2 WHERE id = ?").run(athlete_id);
    
    const athlete = db.prepare("SELECT name FROM athletes WHERE id = ?").get(athlete_id) as any;
    broadcast({ type: 'NOTIFICATION', title: 'Novo Treino Registrado', message: `Atleta ${athlete.name} registrou um treino de ${type}.` });

    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/competitions", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { athlete_id, name, date, category, result, points_earned } = req.body;
    const info = db.prepare(`
      INSERT INTO competitions (athlete_id, name, date, category, result, points_earned)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(athlete_id, name, date, category, result, points_earned);
    
    db.prepare("UPDATE athletes SET score = score + ? WHERE id = ?").run(points_earned, athlete_id);
    
    const athlete = db.prepare("SELECT name FROM athletes WHERE id = ?").get(athlete_id) as any;
    broadcast({ type: 'NOTIFICATION', title: 'Novo Resultado de Competição', message: `Atleta ${athlete.name} conquistou ${result} em ${name}.` });

    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/ranking", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const ranking = db.prepare("SELECT id, name, score, classification, belt FROM athletes ORDER BY score DESC").all();
    res.json(ranking);
  });

  app.get("/api/athletes/:id/signed-documents", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const signed = db.prepare(`
      SELECT sd.*, d.title as document_title 
      FROM signed_documents sd
      JOIN documents d ON sd.document_id = d.id
      WHERE sd.athlete_id = ?
    `).all(req.params.id);
    
    // If documents table is empty (hardcoded in API), we might need to handle that.
    // But let's assume we'll seed the documents table too.
    res.json(signed);
  });

  app.post("/api/signed-documents", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { athlete_id, document_id, signature_name, form_data } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO signed_documents (athlete_id, document_id, signature_name, form_data)
        VALUES (?, ?, ?, ?)
      `).run(athlete_id, document_id, signature_name, JSON.stringify(form_data));
      
      const athlete = db.prepare("SELECT name FROM athletes WHERE id = ?").get(athlete_id) as any;
      const doc = db.prepare("SELECT title FROM documents WHERE id = ?").get(document_id) as any;
      
      broadcast({ 
        type: 'NOTIFICATION', 
        title: 'Documento Assinado', 
        message: `O atleta ${athlete.name} assinou o documento: ${doc?.title || 'Documento'}.` 
      });

      res.json({ id: info.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/documents", (req, res) => {
    const docs = [
      { 
        id: 1, 
        title: "Manual do Atleta Campeão", 
        type: "PDF", 
        content: `MANUAL DO ATLETA CAMPEÃO
PAC – Programa de Formação de Atleta Campeão

MISSÃO
Formar atletas capazes de competir e vencer nos maiores campeonatos de Jiu-Jitsu do mundo, desenvolvendo excelência física, técnica, mental e comportamental.

VISÃO
Construir uma geração de atletas disciplinados, resilientes e preparados para alto rendimento esportivo.

VALORES
Disciplina, Respeito, Responsabilidade, Excelência, Superação.

O QUE SIGNIFICA SER UM ATLETA PAC
Ser atleta PAC significa assumir o compromisso de buscar excelência todos os dias. Não é apenas treinar. É viver como atleta.

PRINCÍPIOS DO ATLETA CAMPEÃO
1. DISCIPLINA: Campeões fazem o que precisa ser feito, mesmo quando não têm vontade.
2. CONSISTÊNCIA: Resultados extraordinários são construídos por esforço consistente ao longo do tempo.
3. RESPONSABILIDADE: O atleta é responsável por sua evolução. Não existem desculpas.
4. HUMILDADE: Sempre há algo a aprender. O atleta campeão aceita correções e busca melhorar continuamente.
5. RESILIÊNCIA: Fracassos fazem parte do processo. Campeões usam derrotas como combustível para evoluir.

ROTINA DO ATLETA PAC
O atleta deve manter: treinamento regular, alimentação adequada, rotina de sono e recuperação adequada.

COMPROMISSOS DO ATLETA
O atleta compromete-se a: cumprir horários, seguir o programa de treinamento, manter comportamento respeitoso, cuidar da própria saúde e representar o programa com dignidade.

ATITUDE EM TREINOS
Durante os treinos o atleta deve: manter intensidade, buscar evolução constante, respeitar colegas e ouvir instruções dos treinadores.

ATITUDE EM COMPETIÇÕES
O atleta PAC representa o programa. Deve demonstrar: coragem, respeito, determinação e espírito esportivo.

VISÃO DE LONGO PRAZO
O caminho para se tornar campeão exige anos de dedicação. O atleta deve compreender que evolução consistente ao longo do tempo produz resultados duradouros.

COMPROMISSO FINAL
Ser atleta PAC é assumir o compromisso de se tornar a melhor versão de si mesmo dentro e fora do tatame.` 
      },
      { 
        id: 2, 
        title: "Código de Conduta", 
        type: "PDF", 
        content: `CÓDIGO DE CONDUTA
PAC – Programa de Formação de Atleta Campeão

O atleta integrante do PAC compromete-se a seguir os princípios abaixo.

1. DISCIPLINA
O atleta deve cumprir rigorosamente horários, treinos e atividades estabelecidas pelo programa.

2. OBEDIÊNCIA AO PROGRAMA
O atleta não escolhe treinos ou atividades. Todo planejamento é definido pela equipe técnica.

3. NUTRIÇÃO
O atleta deve seguir rigorosamente o plano alimentar estabelecido. É proibido consumo frequente de alimentos ultraprocessados.

4. SONO
O atleta deve manter rotina regular de sono.

5. CONDUTA
É esperado comportamento respeitoso com treinadores, colegas e equipe.

6. COMPROMISSO
Faltas injustificadas podem resultar em advertência ou desligamento do programa.

7. RESPONSABILIDADE
O atleta é responsável por seu comprometimento, esforço e disciplina.

8. OBJETIVO
O atleta compromete-se com a missão do programa: Buscar excelência e desempenho competitivo máximo.` 
      },
      { 
        id: 3, 
        title: "Código Mental do Campeão", 
        type: "PDF", 
        content: `CÓDIGO MENTAL DO CAMPEÃO
PAC – Programa de Formação de Atleta Campeão

O Código Mental do Campeão estabelece princípios que orientam a mentalidade dos atletas do programa.

PRINCÍPIO 1 – COMPROMISSO
O atleta campeão entende que excelência exige dedicação contínua. Treinar apenas quando se sente motivado não produz resultados extraordinários.

PRINCÍPIO 2 – CONSISTÊNCIA
Resultados duradouros são construídos através de esforço consistente ao longo do tempo. Pequenas melhorias diárias geram grande evolução.

PRINCÍPIO 3 – FOCO
O atleta campeão mantém atenção total no processo de treinamento. Distrações e hábitos prejudiciais são evitados.

PRINCÍPIO 4 – RESILIÊNCIA
Dificuldades são inevitáveis no caminho do alto rendimento. O atleta campeão aprende com derrotas e retorna mais forte.

PRINCÍPIO 5 – CONTROLE EMOCIONAL
Em situações de pressão o atleta mantém clareza mental. Decisões são tomadas com calma e estratégia.

PRINCÍPIO 6 – DISCIPLINA MENTAL
Pensamentos negativos são substituídos por foco em soluções e aprendizado. O atleta desenvolve mentalidade construtiva.

PRINCÍPIO 7 – AUTOCONFIANÇA
A confiança do atleta é construída através de preparação consistente. Treino forte gera segurança na competição.

PRINCÍPIO 8 – CORAGEM
O atleta campeão enfrenta desafios e adversários fortes. O crescimento ocorre fora da zona de conforto.

PRINCÍPIO 9 – HUMILDADE
Sempre existe algo a aprender. O atleta permanece aberto a correções e aprendizado contínuo.

PRINCÍPIO 10 – MENTALIDADE DE CAMPEÃO
O atleta PAC entra em cada treino e competição com a intenção de evoluir e vencer. A mentalidade de campeão é construída diariamente através de atitudes e escolhas.` 
      },
      { 
        id: 4, 
        title: "Sistema Operacional do PAC", 
        type: "PDF", 
        content: `SISTEMA OPERACIONAL DO PAC
Programa de Formação de Atleta Campeão

OBJETIVO
Organizar todos os processos do programa para garantir funcionamento eficiente, desenvolvimento consistente dos atletas e manutenção de alto padrão de treinamento.

O Sistema Operacional do PAC integra: seleção de atletas, avaliação de desempenho, planejamento de treinamento, monitoramento de evolução e progressão esportiva.

1. FLUXO DE ENTRADA DO ATLETA
Etapa 1 – Inscrição: O candidato manifesta interesse em participar do programa. São coletadas informações como: nome, idade, histórico esportivo e objetivos competitivos.
Etapa 2 – Processo de Seleção: O candidato passa por três avaliações: física, técnica e psicológica.
Etapa 3 – Aprovação: Se aprovado, o atleta entra em período de adaptação de 60 dias. Durante esse período são avaliados: disciplina, comprometimento e capacidade de evolução.

2. CRIAÇÃO DO DOSSIÊ DO ATLETA
Após aprovação definitiva, é criado o Dossiê do Atleta PAC contendo: dados pessoais, avaliações física, psicológica e técnica, histórico de lesões e objetivos competitivos. Esse dossiê será atualizado continuamente.

3. AVALIAÇÃO INICIAL
O atleta passa por avaliações completas: TAF, Teste Psicológico PAC, avaliação técnica, avaliação de mobilidade e controle de peso. Esses dados definem o ponto de partida do atleta.

4. DEFINIÇÃO DO PLANO INDIVIDUAL
Com base nas avaliações é criado o Plano de Desenvolvimento Individual. Esse plano inclui: objetivos técnicos, físicos e psicológicos, e metas competitivas.

5. ROTINA DE TREINAMENTO
Os atletas seguem o Protocolo Semanal de Treinamento do PAC. Cada semana contém: treino técnico, sparring competitivo, preparação física, treino estratégico e recuperação.

6. MONITORAMENTO CONTÍNUO
Durante o treinamento são monitorados: presença, intensidade de treino, comportamento, condicionamento físico e evolução técnica. Essas informações alimentam o Sistema de Pontuação do Atleta PAC.

7. RANKING INTERNO
O desempenho dos atletas gera classificação no Ranking Interno PAC. O ranking influencia: participação em competições, convocação para treinos especiais e prioridade de desenvolvimento.

8. CICLO DE AVALIAÇÃO
A cada três meses são realizadas reavaliações completas: TAF, teste psicológico, avaliação técnica e controle de peso. Os resultados atualizam o Dossiê do Atleta.

9. PROGRESSÃO DE NÍVEL
Com base nos resultados o atleta pode avançar nas fases da carreira esportiva: Iniciação competitiva, Desenvolvimento competitivo, Alto rendimento e Elite PAC.

10. PLANEJAMENTO COMPETITIVO
Cada atleta possui planejamento anual de competições. O planejamento considera: nível do atleta, categoria de peso, objetivos esportivos e períodos de pico de performance.

11. SUPORTE AO ATLETA
O programa oferece suporte em: treinamento técnico, preparação física, nutrição esportiva, psicologia esportiva e prevenção de lesões.

12. CULTURA DO PROGRAMA
Todos os atletas seguem: Código de Conduta, Manual do Atleta Campeão e Código Mental do Campeão PAC. Esses elementos garantem ambiente disciplinado e orientado para excelência.

OBJETIVO FINAL DO SISTEMA
Criar um ambiente estruturado capaz de transformar talentos em campeões.` 
      },
      { 
        id: 5, 
        title: "Mapa de Valências do Atleta de Jiu-Jitsu", 
        type: "PDF", 
        content: `MAPA DE VALÊNCIAS DO ATLETA DE JIU-JITSU
PAC – Programa de Formação de Atleta Campeão

OBJETIVO
Mapear todas as capacidades físicas, técnicas, cognitivas e comportamentais necessárias para formar atletas campeões em esportes de grappling.

O desenvolvimento completo do atleta envolve cinco grandes dimensões:
1. VALÊNCIAS TÉCNICAS: Capacidade de executar e aplicar técnicas de forma eficiente durante combate. Elementos: domínio de fundamentos, precisão técnica, tempo de execução, eficiência biomecânica, fluidez nas transições, capacidade de adaptação técnica, domínio posicional, de finalizações, raspagens, passagens e quedas. Indicadores: execução sob pressão, taxa de sucesso em sparring, consistência técnica e tomada de decisão posicional.
2. VALÊNCIAS FÍSICAS: Capacidades fisiológicas que sustentam o desempenho. Subdivisão: Força (máxima, relativa, pegada, isométrica), Potência (quadril, membros inferiores e superiores), Resistência (anaeróbica, aeróbica, muscular localizada, pegada), Velocidade (reação, transição, execução técnica), Mobilidade (quadril, ombro, coluna) e Estabilidade (core, joelho, ombro).
3. VALÊNCIAS COGNITIVAS: Capacidades mentais relacionadas à tomada de decisão durante a luta. Componentes: leitura de adversário, antecipação, reconhecimento de padrões, tomada de decisão rápida, planejamento estratégico e adaptação tática. Indicadores: escolhas técnicas sob pressão, eficiência estratégica e capacidade de ajuste durante luta.
4. VALÊNCIAS PSICOLÓGICAS: Capacidades mentais que sustentam desempenho em ambientes competitivos. Principais: disciplina, resiliência, controle emocional, agressividade competitiva, tolerância à dor, foco sob pressão, autoconfiança e perseverança.
5. VALÊNCIAS COMPORTAMENTAIS: Aspectos de comportamento e estilo de vida que influenciam desempenho. Incluem: disciplina de rotina, consistência de treino, comprometimento com dieta, qualidade do sono, responsabilidade pessoal, respeito à equipe e mentalidade de crescimento.

CONCLUSÃO
O atleta campeão é resultado do desenvolvimento equilibrado de todas essas valências. O PAC monitora e desenvolve continuamente cada uma delas através de: avaliações físicas, psicológicas, análise técnica, controle comportamental e monitoramento competitivo.` 
      },
      { 
        id: 6, 
        title: "Sistema de Carreira do Atleta", 
        type: "PDF", 
        content: `SISTEMA DE CARREIRA DO ATLETA
PAC – Programa de Formação de Atleta Campeão

OBJETIVO
Organizar o desenvolvimento do atleta ao longo de sua trajetória esportiva, desde a iniciação competitiva até o alto rendimento. O sistema estabelece fases claras de desenvolvimento, metas e critérios de progressão.

FASE 1 – DESCOBERTA COMPETITIVA
Perfil do atleta: Iniciantes ou atletas com pouca experiência em competição.
Objetivos principais: desenvolver disciplina, construir base técnica, desenvolver condicionamento físico básico e introduzir mentalidade competitiva.
Foco do treinamento: fundamentos técnicos, coordenação motora, condicionamento geral e primeiras competições.
Duração média: 6 meses a 2 anos.

FASE 2 – DESENVOLVIMENTO COMPETITIVO
Perfil do atleta: Atletas que já competem regularmente.
Objetivos: desenvolver jogo técnico principal, melhorar condicionamento específico, aprimorar inteligência de luta, especialização técnica, estratégia e controle emocional em competição.
Duração média: 2 a 4 anos.

FASE 3 – ALTO RENDIMENTO
Perfil do atleta: Atletas com experiência competitiva relevante.
Objetivos: maximizar performance, construir consistência competitiva e desenvolver estratégias avançadas.
Foco: treinos específicos, análise estratégica, periodização competitiva e controle rigoroso de peso.

FASE 4 – ELITE COMPETITIVA
Perfil do atleta: Atletas preparados para grandes campeonatos.
Objetivos: disputar títulos relevantes, atingir pico de performance e manter alto nível competitivo.
Foco: treinamento altamente individualizado, estratégia específica para adversários e preparação psicológica avançada.

CRITÉRIOS DE PROGRESSÃO
A progressão de fase depende de: resultados competitivos, pontuação no sistema PAC, evolução técnica, evolução física e perfil psicológico.

PLANEJAMENTO ANUAL
Cada atleta possui planejamento anual contendo: principais competições, períodos de treinamento, períodos de recuperação e metas de desempenho.

OBJETIVO FINAL
Preparar atletas capazes de competir em alto nível nos maiores campeonatos de Jiu-Jitsu do mundo.` 
      },
      { 
        id: 7, 
        title: "Pirâmide de Formação", 
        type: "PDF", 
        content: `PIRÂMIDE DE FORMAÇÃO DE CAMPEÕES
PAC – Programa de Formação de Atleta Campeão

OBJETIVO:
Estabelecer uma estrutura de desenvolvimento esportivo que permita identificar, desenvolver e preparar atletas de alto rendimento. A pirâmide é composta por quatro níveis.

NÍVEL 1 – BASE ESPORTIVA
Grande volume de atletas.
Objetivo: Desenvolver habilidades motoras, introduzir fundamentos do Jiu-Jitsu e estimular o gosto pelo esporte.
Foco: Coordenação, movimento, disciplina e fundamentos técnicos.

NÍVEL 2 – FORMAÇÃO COMPETITIVA
Atletas que demonstram interesse competitivo.
Objetivos: Participar de campeonatos, desenvolver condicionamento e refinar fundamentos técnicos.
Foco: Treinos estruturados, experiência competitiva e desenvolvimento psicológico.

NÍVEL 3 – DESENVOLVIMENTO DE ALTO RENDIMENTO
Atletas com potencial competitivo.
Objetivos: Especialização técnica, preparação física avançada e desenvolvimento estratégico.
Foco: Treinos intensivos, monitoramento de performance e participação em campeonatos relevantes.

NÍVEL 4 – ELITE COMPETITIVA
Pequeno grupo de atletas de alto nível.
Objetivos: Disputar títulos importantes e representar o programa em grandes campeonatos.
Foco: Preparação altamente especializada, estratégia individual e pico de performance.

PRINCÍPIO DA PIRÂMIDE
Muitos atletas na base, menos atletas no desenvolvimento e poucos atletas na elite. Esse modelo garante renovação constante de talentos e sustentabilidade esportiva.

MISSÃO DA PIRÂMIDE PAC
Criar um ambiente estruturado capaz de transformar talentos em campeões.` 
      },
      { 
        id: 8, 
        title: "TAF – Teste de Aptidão Física", 
        type: "PDF", 
        content: `TAF – TESTE DE APTIDÃO FÍSICA
PAC – Programa de Formação de Atleta Campeão

OBJETIVO: Avaliar o nível de condicionamento físico específico para atletas de Jiu-Jitsu.

TESTE 1 — BARRA FIXA
Execução: Máximo de repetições em barra fixa. Mede: Força de puxada e pegada.
Referência: 0–5 iniciante, 6–10 intermediário, 11–15 avançado, 16+ elite.

TESTE 2 — FLEXÃO DE BRAÇO
Execução: Máximo de flexões em 2 minutos.
Referência: 20 iniciante, 35 intermediário, 50 avançado, 70+ elite.

TESTE 3 — ISOMETRIA DE PEGADA NO QUIMONO
Execução: Pendurar no quimono preso à barra. Tempo máximo.
Referência: 30s iniciante, 60s intermediário, 90s avançado, 120s elite.

TESTE 4 — SPRINT 50m
Avalia explosão.
Referência: 8s iniciante, 7s intermediário, 6s avançado, 5s elite.

TESTE 5 — BURPEES 2 MINUTOS
Avalia resistência anaeróbica.
Referência: 20 iniciante, 35 intermediário, 50 avançado, 65+ elite.

TESTE 6 — SHUTTLE RUN (IDA E VOLTA)
Avalia agilidade.

TESTE 7 — ROUND DE RESISTÊNCIA
3 rounds de 5 minutos de sparring contínuo.
Observação: capacidade de manter intensidade, recuperação e controle respiratório.

TESTE 8 — ABDOMINAL 2 MINUTOS
Referência: 30 iniciante, 50 intermediário, 70 avançado, 90 elite.

PERIODICIDADE DO TAF: Avaliação inicial e reavaliação a cada 3 meses.` 
      },
      { 
        id: 9, 
        title: "Termo de Responsabilidade e Compromisso", 
        type: "PDF", 
        content: `TERMO DE RESPONSABILIDADE E COMPROMISSO
PAC – Programa de Formação de Atleta Campeão

Eu, __________________________________________, declaro estar ciente de que o treinamento esportivo de alto rendimento envolve riscos físicos, incluindo lesões musculares, articulares e outras intercorrências.

Declaro que estou fisicamente apto para participar do programa ou apresentarei liberação médica quando solicitado.

Comprometo-me a:
1. Seguir rigorosamente as orientações da equipe técnica.
2. Participar das atividades programadas conforme cronograma.
3. Cumprir as regras de disciplina e conduta do programa.
4. Informar imediatamente qualquer dor, lesão ou problema de saúde.

Reconheço que o Programa PAC tem como objetivo formação de atletas de alto rendimento, exigindo alto nível de comprometimento físico e mental.

Declaro que participo do programa de forma voluntária.

Nome do atleta:
Assinatura:
Data:

Responsável legal (se menor):
Assinatura:` 
      },
      { 
        id: 10, 
        title: "Teste Psicológico – PAC", 
        type: "PDF", 
        content: `TESTE PSICOLÓGICO – PAC
Programa de Formação de Atleta Campeão

OBJETIVO
Avaliar o perfil psicológico do atleta para identificar sua aptidão para treinamento de alto rendimento no Programa PAC.

O teste avalia as seguintes dimensões psicológicas:
1. Disciplina
2. Resiliência
3. Mentalidade Competitiva
4. Controle Emocional
5. Responsabilidade
6. Tolerância à Dor e Desconforto
7. Mentalidade de Crescimento

INSTRUÇÕES: Leia cada afirmação e marque um número de 1 a 5.
1 – Discordo totalmente | 2 – Discordo | 3 – Neutro | 4 – Concordo | 5 – Concordo totalmente

SEÇÃO 1 — DISCIPLINA
1. Consigo seguir rotinas rígidas por longos períodos.
2. Cumpro horários com rigor.
3. Sigo instruções exatamente como foram dadas.
4. Consigo manter dieta mesmo quando tenho vontade de quebrar.
5. Não dependo de motivação para treinar.
6. Consigo abrir mão de lazer para alcançar objetivos.
7. Evito comportamentos que prejudiquem meu desempenho esportivo.
8. Consigo repetir tarefas cansativas sem perder foco.

SEÇÃO 2 — RESILIÊNCIA
9. Depois de perder uma luta, fico ainda mais motivado.
10. Consigo continuar treinando mesmo quando estou extremamente cansado.
11. Críticas dos treinadores me ajudam a melhorar.
12. Não desisto quando algo parece muito difícil.
13. Consigo lidar com dor física durante o treino.
14. Fracassos me fazem trabalhar mais forte.
15. Busco corrigir erros imediatamente.

SEÇÃO 3 — MENTALIDADE COMPETITIVA
16. Eu gosto de competir.
17. Gosto de enfrentar adversários mais fortes.
18. Competição me motiva.
19. Quero ser o melhor no que faço.
20. Não me contento em apenas participar.
21. Busco constantemente desafios maiores.

SEÇÃO 4 — CONTROLE EMOCIONAL
22. Consigo manter a calma sob pressão.
23. Meu desempenho não cai quando estou sendo observado.
24. Consigo focar mesmo quando estou nervoso.
25. Tomo decisões rapidamente em situações difíceis.
26. Não entro em pânico quando estou em desvantagem.

SEÇÃO 5 — RESPONSABILIDADE
27. Quando erro, assumo responsabilidade.
28. Não culpo fatores externos pelos meus resultados.
29. Cumpro compromissos assumidos.
30. Sou consistente nos meus esforços.
31. Sei que meu sucesso depende principalmente de mim.

SEÇÃO 6 — TOLERÂNCIA AO DESCONFORTO
32. Consigo continuar mesmo quando estou fisicamente desconfortável.
33. Não paro facilmente por cansaço.
34. Treino duro mesmo em dias ruins.
35. Não evito desafios físicos difíceis.

SEÇÃO 7 — MENTALIDADE DE CRESCIMENTO
36. Aceito correções técnicas sem resistência.
37. Reconheço quando preciso evoluir.
38. Estou sempre buscando melhorar.
39. Treino fundamentos mesmo quando são repetitivos.
40. Consigo mudar hábitos quando necessário.

PONTUAÇÃO: Some todas as respostas.
Classificação:
160 – 200: Perfil psicológico de alto rendimento
130 – 159: Alto potencial competitivo
100 – 129: Perfil desenvolvível
70 – 99: Risco comportamental
Abaixo de 70: Não recomendado para treinamento de alto rendimento` 
      },
      { 
        id: 11, 
        title: "Modelo de Centro de Alto Rendimento", 
        type: "PDF", 
        content: `MODELO DE CENTRO DE ALTO RENDIMENTO
PAC – Programa de Formação de Atleta Campeão

OBJETIVO: Criar um ambiente estruturado para formação de atletas de alto rendimento em esportes de combate.

ESTRUTURA TÉCNICA
Equipe mínima: Treinador principal, Treinador técnico, Preparador físico, Nutricionista esportivo, Psicólogo esportivo e Fisioterapeuta.

ESTRUTURA DE TREINAMENTO
Área de tatame: Espaço amplo para treino técnico e sparring.
Área de preparação física. Equipamentos: barra fixa, kettlebells, medicine balls, cordas, halteres e equipamentos funcionais.

ÁREA DE RECUPERAÇÃO
Espaço dedicado a recuperação: liberação miofascial, alongamento e mobilidade.

SUPORTE AO ATLETA
O centro oferece acompanhamento em: treinamento técnico, preparação física, nutrição esportiva, psicologia esportiva e prevenção de lesões.

MONITORAMENTO DE PERFORMANCE
Todos os atletas são acompanhados através de: dossiê individual, avaliações periódicas, controle de peso, controle de sono e análise de desempenho competitivo.

CULTURA DO CENTRO
O ambiente do centro deve promover: disciplina, respeito, excelência, competitividade saudável e busca constante por evolução.

OBJETIVO FINAL
Formar atletas capazes de competir e vencer nos maiores campeonatos de Jiu-Jitsu do mundo.` 
      },
      { 
        id: 12, 
        title: "Sistema de Identidade do Atleta", 
        type: "PDF", 
        content: `SISTEMA DE IDENTIDADE DO ATLETA
PAC – Programa de Formação de Atleta Campeão

OBJETIVO: Definir os princípios que caracterizam o comportamento, mentalidade e postura dos atletas integrantes do PAC.

A identidade do atleta PAC é baseada em cinco pilares fundamentais:
1. DISCIPLINA: O atleta PAC entende que excelência é construída por meio da repetição diária de hábitos corretos. Ele cumpre horários, segue o programa de treinamento e respeita as orientações da equipe técnica.
2. RESPONSABILIDADE: O atleta assume responsabilidade pelo próprio desempenho. Ele não busca desculpas externas para seus resultados. A evolução depende de esforço, consistência e comprometimento.
3. RESILIÊNCIA: O atleta PAC entende que derrotas e dificuldades fazem parte do caminho. Fracassos são tratados como oportunidades de aprendizado. A persistência diante da adversidade é parte essencial da identidade do programa.
4. EXCELÊNCIA: O atleta busca constantemente melhorar sua performance. Pequenos detalhes são valorizados. O objetivo é executar cada ação com qualidade e eficiência.
5. ESPÍRITO COMPETITIVO: O atleta PAC compete para vencer. Ele respeita adversários, mas entra em combate com determinação e coragem. A competitividade saudável fortalece o ambiente da equipe.

COMPORTAMENTO ESPERADO: O atleta PAC deve demonstrar respeito, disciplina, comprometimento, humildade para aprender e determinação para evoluir.

IDENTIDADE COLETIVA: Todos os integrantes do programa representam o PAC. O comportamento individual reflete a cultura e os valores do programa.

MISSÃO: Construir atletas que representem excelência dentro e fora do tatame.` 
      },
      { 
        id: 13, 
        title: "Sistema de Pontuação do Atleta", 
        type: "PDF", 
        content: `SISTEMA DE PONTUAÇÃO DO ATLETA
PAC – Programa de Formação de Atleta Campeão

OBJETIVO: Avaliar o desenvolvimento global do atleta em todas as dimensões do desempenho esportivo. A pontuação é baseada em cinco pilares.

1. TÉCNICA (Máx 100): Avaliação técnica feita pelos treinadores. Domínio técnico, capacidade de adaptação e eficiência em sparring.
2. CONDICIONAMENTO FÍSICO (Máx 100): Baseado nos resultados do TAF. Força, explosão, resistência e mobilidade.
3. PSICOLÓGICO (Máx 100): Baseado em: teste psicológico, comportamento em treinos e resiliência competitiva.
4. DISCIPLINA (Máx 100): Baseado em: presença, pontualidade, cumprimento de dieta e comprometimento.
5. RESULTADOS COMPETITIVOS (Máx 100): Baseado em: desempenho em campeonatos, qualidade dos adversários e evolução competitiva.

PONTUAÇÃO FINAL: Total máximo de 500 pontos.
Classificação:
450–500: Elite PAC
350–449: Alto desempenho
250–349: Em desenvolvimento
150–249: Iniciante competitivo
Abaixo de 150: Risco de desligamento

REAVALIAÇÃO: A pontuação é atualizada a cada três meses.` 
      },
      { 
        id: 14, 
        title: "Sistema de Ranking Interno", 
        type: "PDF", 
        content: `SISTEMA DE RANKING INTERNO
PAC – Programa de Formação de Atleta Campeão

OBJETIVO: Criar um ambiente competitivo interno que estimule evolução constante e meritocracia. O ranking interno é atualizado mensalmente.

CRITÉRIOS DE PONTUAÇÃO:
1. PRESENÇA EM TREINOS: 100% presença no mês (20 pts), 90% (15 pts), 80% (10 pts), menos de 80% (0 pts).
2. DESEMPENHO EM TREINOS: Avaliação do treinador. Excelente (20 pts), Bom (15 pts), Regular (10 pts), Insuficiente (0 pts).
3. RESULTADOS EM SPARRING: Baseado em desempenho nos treinos competitivos. Alto desempenho (20 pts), Bom desempenho (15 pts), Desempenho médio (10 pts).
4. RESULTADOS EM COMPETIÇÕES: Campeão (40 pts), Vice-campeão (30 pts), Terceiro lugar (20 pts), Participação (10 pts).
5. EVOLUÇÃO FÍSICA: Baseado em melhoria no TAF. Melhora significativa (20 pts), Melhora moderada (10 pts), Sem melhora (0 pts).

CLASSIFICAÇÃO: Os atletas são classificados mensalmente em ranking geral. Top 5 atletas recebem status de destaque no programa.

USO DO RANKING: O ranking influencia convocação para competições, prioridade em treinos especiais e status dentro da equipe.` 
      },
      { 
        id: 15, 
        title: "Sistema de Seleção de Atletas", 
        type: "PDF", 
        content: `SISTEMA DE SELEÇÃO DE ATLETAS
PAC – Programa de Formação de Atleta Campeão

OBJETIVO: Selecionar atletas com potencial para desenvolvimento competitivo de alto rendimento. O processo de seleção ocorre em quatro etapas.

1. AÇÃO DE PERFIL: Análise de histórico, objetivos e motivação intrínseca.
2. TRIAGEM FÍSICA: Realização de um TAF simplificado para verificar prontidão física.
3. SEMANA DE IMERSÃO: O candidato treina com o grupo para avaliação de comportamento e "coachability".
4. TESTE PSICOLÓGICO: Verificação de traços de personalidade compatíveis com o alto rendimento.

CRITÉRIOS DE APROVAÇÃO:
- Alto nível de disciplina e respeito.
- Capacidade de aprendizado rápido (inteligência motora).
- Resiliência mental demonstrada durante a semana de teste.
- Alinhamento total com os valores do programa.

PERÍODO DE ADAPTAÇÃO: Os atletas aprovados entram em período de avaliação de 60 dias. Durante esse período são observados: comprometimento, disciplina e evolução.

DESLIGAMENTO: O atleta pode ser desligado em casos de: indisciplina, faltas frequentes, quebra de regras ou baixo comprometimento.` 
      },
      { 
        id: 16, 
        title: "Dossiê do Atleta", 
        type: "PDF", 
        content: `DOSSIÊ DO ATLETA
PAC – Programa de Formação de Atleta Campeão

1. IDENTIFICAÇÃO: Nome completo, data de nascimento, idade, peso atual, categoria de peso, faixa, academia de origem, contato e responsável legal (se menor).
2. OBJETIVOS DO ATLETA: Objetivo competitivo principal, competições alvo, categoria pretendida e prazo de metas.
3. AVALIAÇÃO FÍSICA: Altura, peso, percentual de gordura, frequência cardíaca de repouso, histórico de lesões, mobilidade geral e força geral.
4. AVALIAÇÃO TÉCNICA: Nível técnico geral, especialidades técnicas, pontos fortes, pontos fracos, guarda principal, passagem principal e finalizações dominadas.
5. AVALIAÇÃO PSICOLÓGICA: Pontuação teste psicológico, perfil mental, pontos fortes psicológicos e pontos a desenvolver.
6. AVALIAÇÃO FÍSICA – TAF: Resultados dos testes físicos (Força, Potência, Resistência, Grip, Explosão, Aeróbico).
7. PLANO DE DESENVOLVIMENTO INDIVIDUAL: Objetivos técnicos, físicos, psicológicos e nutricionais.
8. CONTROLE DE PESO: Peso semanal, percentual de gordura e categoria alvo.
9. CONTROLE DE SONO: Horas médias de sono e qualidade do sono.
10. HISTÓRICO DE COMPETIÇÕES: Data, evento, categoria, resultado e observações técnicas.
11. OBSERVAÇÕES DO TREINADOR: Registro contínuo de evolução do atleta.` 
      },
    ];
    res.json(docs);
  });

  // Final catch-all for API
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Vite or Static serving
  const distPath = path.resolve(process.cwd(), "dist");
  const indexPath = path.join(distPath, "index.html");
  
  if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
    console.log("Serving static files from:", distPath);
    
    // Intercept index.html to inject ENV variables
    const serveIndex = (req: any, res: any) => {
      try {
        let html = fs.readFileSync(indexPath, 'utf-8');
        const rawKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        const apiKey = rawKey && rawKey !== 'undefined' ? rawKey : '';
        const envScript = `<script>window.ENV = { GEMINI_API_KEY: "${apiKey}" };</script>`;
        html = html.replace('</head>', `${envScript}</head>`);
        res.send(html);
      } catch (e) {
        res.sendFile(indexPath);
      }
    };

    app.get("/", serveIndex);
    app.get("/index.html", serveIndex);
    
    app.use(express.static(distPath, { index: false }));
    
    // SPA Fallback - must be AFTER express.static
    app.get("*", (req, res) => {
      if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: "API route not found" });
      }
      serveIndex(req, res);
    });
  } else {
    console.log("Dist folder or index.html not found, starting Vite middleware...");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      app.get("*", async (req, res, next) => {
        if (req.url.startsWith('/api/')) return next();
        try {
          const url = req.originalUrl;
          let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          const rawKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
          const apiKey = rawKey && rawKey !== 'undefined' ? rawKey : '';
          const envScript = `<script>window.ENV = { GEMINI_API_KEY: "${apiKey}" };</script>`;
          template = template.replace('</head>', `${envScript}</head>`);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          next(e);
        }
      });
    } catch (e) {
      console.error("Vite failed:", e);
      app.get("*", (req, res) => res.status(500).send("Server Error: Vite failed to start"));
    }
  }

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).send("Internal Server Error");
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
