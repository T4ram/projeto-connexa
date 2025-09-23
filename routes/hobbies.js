const express = require('express');
const router = express.Router();

// Simulação de hobbies em memória
let hobbies = ["Leitura", "Programação", "Ciclismo"];

// Obter hobbies
router.get('/', (req, res) => {
  res.json(hobbies);
});

// Atualizar hobbies
router.put('/', (req, res) => {
  const { newHobbies } = req.body;
  if (!Array.isArray(newHobbies)) {
    return res.status(400).json({ success: false, message: "Envie um array de hobbies." });
  }
  hobbies = newHobbies;
  res.json({ success: true, hobbies });
});

module.exports = router;