// models/ConfiguracaoUsuario.js

// Importa o módulo sqlite3 e abre o banco de dados
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/alunos.db');

// Função para criar a tabela de configurações de usuário, se não existir
const criarTabela = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS configuracoes_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tema TEXT NOT NULL CHECK (tema IN ('claro', 'escuro')),
      notificacoes INTEGER NOT NULL CHECK (notificacoes IN (0, 1)),
      idioma TEXT NOT NULL CHECK (idioma IN ('pt-BR', 'en-US'))
    )
  `);
};

// Valida os dados de configuração recebidos
const validarConfiguracao = ({ tema, notificacoes, idioma }) => {
  const temasPermitidos = ['claro', 'escuro'];
  const idiomasPermitidos = ['pt-BR', 'en-US'];
  if (!temasPermitidos.includes(tema)) return false;
  if (typeof notificacoes !== 'boolean') return false;
  if (!idiomasPermitidos.includes(idioma)) return false;
  return true;
};

// Busca configurações de um usuário pelo ID
const buscarPorUsuarioId = (usuario_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM configuracoes_usuario WHERE usuario_id = ?',
      [usuario_id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

// Insere configurações para um usuário
const inserirConfiguracao = ({ usuario_id, tema, notificacoes, idioma }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO configuracoes_usuario (usuario_id, tema, notificacoes, idioma)
       VALUES (?, ?, ?, ?)`,
      [usuario_id, tema, notificacoes ? 1 : 0, idioma],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

// Atualiza configurações de um usuário
const atualizarConfiguracao = ({ usuario_id, tema, notificacoes, idioma }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE configuracoes_usuario
       SET tema = ?, notificacoes = ?, idioma = ?
       WHERE usuario_id = ?`,
      [tema, notificacoes ? 1 : 0, idioma, usuario_id],
      function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      }
    );
  });
};

// Cria a tabela ao importar o módulo
criarTabela();

module.exports = {
  criarTabela,
  validarConfiguracao,
  buscarPorUsuarioId,
  inserirConfiguracao,
  atualizarConfiguracao,
};