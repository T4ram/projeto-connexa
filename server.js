const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middlewaren
app.use(cors());
app.use(express.json());

// Simulação de "banco de dados" em memória
let userProfile = {
  pic: "https://i.pravatar.cc/130?img=5",
  username: "Maria Silva",
  bio: "Estudante de Engenharia apaixonada por tecnologia e inovação.",
  age: 21,
  course: "Engenharia de Computação"
};

// Rota para obter o perfil
app.get('/api/profile', (req, res) => {
  res.json(userProfile);
});

// Rota para atualizar o perfil
app.put('/api/profile', (req, res) => {
  const { pic, username, bio, age, course } = req.body;
  userProfile = { pic, username, bio, age, course };
  res.json({ success: true, profile: userProfile });
});

const hobbiesRouter = require('./routes/hobbies');
app.use('/api/hobbies', hobbiesRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});