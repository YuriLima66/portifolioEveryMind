const sqlite3 = require('sqlite3').verbose();

// Conexão com o banco de dados
const db = new sqlite3.Database('nunes_sports.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite!');
  }
});

// Criar a tabela produtos (se não existir)
db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_produto VARCHAR(255) NOT NULL,
    codigo_produto VARCHAR(20) NOT NULL,
    descricao_produto TEXT,
    preco_produto DECIMAL(10,2) NOT NULL
  )
`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Tabela produtos criada!');
  }
});

// Função para listar todos os produtos
exports.listarProdutos = (callback) => {
  db.all('SELECT * FROM produtos', (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
};

// Função para criar um novo produto
exports.criarProduto = (produto, callback) => {
  db.run(
    'INSERT INTO produtos (nome_produto, codigo_produto, descricao_produto, preco_produto) VALUES (?, ?, ?, ?)',
    [produto.nome, produto.codigo, produto.descricao, produto.preco],
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, this.lastID);
      }
    }
  );
};

// Função para atualizar um produto
exports.atualizarProduto = (id, produto, callback) => {
  db.run(
    'UPDATE produtos SET nome_produto = ?, codigo_produto = ?, descricao_produto = ?, preco_produto = ? WHERE id = ?',
    [produto.nome, produto.codigo, produto.descricao, produto.preco, id],
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
};

// Função para excluir um produto
exports.excluirProduto = (id, callback) => {
  db.run('DELETE FROM produtos WHERE id = ?', [id], (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Fecha a conexão com o banco de dados quando o processo termina
db.on('close', () => {
  console.log('Conexão com o banco de dados fechada!');
});

// Exporta as funções para serem usadas no script.js
module.exports = {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto
};