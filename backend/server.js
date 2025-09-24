const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Banco SQLite
const db = new sqlite3.Database("./backend/alunos.db", (err) => {
  if (err) console.error("Erro ao abrir banco:", err.message);
  else console.log("Banco conectado!");
});

// Criação das tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    curso TEXT NOT NULL,
    periodo TEXT NOT NULL,
    senha TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS grupos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    dono_email TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sessoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// ---------------- ROTAS API ----------------

// Cadastro de aluno
app.post("/cadastro", (req, res) => {
  const { nome, email, curso, periodo, senha } = req.body;

  if (!email.endsWith("@universidade.edu")) {
    return res.status(400).json({ erro: "E-mail não é institucional" });
  }

  const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!senhaRegex.test(senha)) {
    return res.status(400).json({ erro: "Senha inválida" });
  }

  db.run(
    `INSERT INTO alunos (nome, email, curso, periodo, senha) VALUES (?, ?, ?, ?, ?)`,
    [nome, email, curso, periodo, senha],
    function (err) {
      if (err) return res.status(400).json({ erro: "E-mail já cadastrado" });
      res.json({ msg: "Cadastro realizado com sucesso!" });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.get(
    `SELECT * FROM alunos WHERE email = ? AND senha = ?`,
    [email, senha],
    (err, usuario) => {
      if (err) return res.status(500).json({ erro: "Erro no servidor" });
      if (!usuario) return res.status(400).json({ erro: "Credenciais inválidas" });

      // Gera token e salva sessão
      const token = uuidv4();
      db.run(`INSERT INTO sessoes (email, token) VALUES (?, ?)`, [email, token], (err) => {
        if (err) return res.status(500).json({ erro: "Não foi possível criar sessão" });
        res.json({ msg: "Login bem-sucedido", token, usuario });
      });
    }
  );
});

// Middleware de autenticação
function autenticar(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ erro: "Token ausente" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ erro: "Token inválido" });

  db.get(`SELECT * FROM sessoes WHERE token = ?`, [token], (err, sessao) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });
    if (!sessao) return res.status(401).json({ erro: "Sessão inválida" });

    req.usuarioEmail = sessao.email;
    next();
  });
}

// Validar sessão
app.get("/validar-sessao", autenticar, (req, res) => {
  res.json({ msg: "Sessão válida", email: req.usuarioEmail });
});

// Criar grupo (protegido)
app.post("/grupo", autenticar, (req, res) => {
  const { nome } = req.body;
  const dono_email = req.usuarioEmail;

  db.run(
    `INSERT INTO grupos (nome, dono_email) VALUES (?, ?)`,
    [nome, dono_email],
    function (err) {
      if (err) return res.status(500).json({ erro: "Erro ao criar grupo" });
      res.json({ msg: "Grupo criado com sucesso!" });
    }
  );
});

// Listar grupos (protegido)
app.get("/grupos", autenticar, (req, res) => {
  const email = req.usuarioEmail;
  db.all(`SELECT * FROM grupos WHERE dono_email = ?`, [email], (err, rows) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar grupos" });
    res.json(rows);
  });
});

// Logout
app.post("/logout", autenticar, (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  db.run(`DELETE FROM sessoes WHERE token = ?`, [token], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao finalizar sessão" });
    res.json({ msg: "Logout realizado com sucesso" });
  });
});

// Servir frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.use((req, res, next) => {
  if (!req.path.startsWith("/cadastro") && 
      !req.path.startsWith("/login") &&
      !req.path.startsWith("/grupo") &&
      !req.path.startsWith("/grupos") &&
      !req.path.startsWith("/logout") &&
      !req.path.startsWith("/validar-sessao")) {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
  } else {
    next();
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});


