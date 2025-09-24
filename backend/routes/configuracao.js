// routes/configuracao.js

const express = require('express');
const router = express.Router();
const ConfiguracaoUsuario = require('../models/ConfiguracaoUsuario');

// Middleware de autenticação simulado
router.use((req, res, next) => {
  req.userId = 1; // Simulação para testes
  next();
});

// GET /api/configuracao - retorna configurações do usuário ou padrões
router.get('/api/configuracao', async (req, res) => {
  try {
    const config = await ConfiguracaoUsuario.buscarPorUsuarioId(req.userId);
    if (!config) {
      // Retorna padrão se não houver configuração
      return res.json({
        tema: 'claro',
        notificacoes: true,
        idioma: 'pt-BR'
      });
    }
    res.json({
      tema: config.tema,
      notificacoes: !!config.notificacoes,
      idioma: config.idioma
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar configurações.' });
  }
});

// PUT /api/configuracao - recebe e valida JSON, salva no banco
router.put('/api/configuracao', async (req, res) => {
  const { tema, notificacoes, idioma } = req.body;
  // Validação rigorosa dos dados
  if (!ConfiguracaoUsuario.validarConfiguracao({ tema, notificacoes, idioma })) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }
  try {
    const existente = await ConfiguracaoUsuario.buscarPorUsuarioId(req.userId);
    if (existente) {
      await ConfiguracaoUsuario.atualizarConfiguracao({
        usuario_id: req.userId,
        tema,
        notificacoes,
        idioma
      });
    } else {
      await ConfiguracaoUsuario.inserirConfiguracao({
        usuario_id: req.userId,
        tema,
        notificacoes,
        idioma
      });
    }
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar configurações.' });
  }
});

module.exports = router;
