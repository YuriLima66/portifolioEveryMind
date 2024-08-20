const db = require('./db'); // Importando as funções do db.js

// Função para carregar produtos na tabela
function carregarProdutos() {
    const tbody = document.querySelector('#produto-table tbody');
    tbody.innerHTML = ''; // Limpa a tabela

    db.listarProdutos((err, rows) => {
        if (err) {
            console.error(err);
        } else {
            rows.forEach(produto => {
                const linha = tbody.insertRow();
                const celulaNome = linha.insertCell();
                const celulaCodigo = linha.insertCell();
                const celulaDescricao = linha.insertCell();
                const celulaPreco = linha.insertCell();
                const celulaAcoes = linha.insertCell();

                celulaNome.textContent = produto.nome_produto;
                celulaCodigo.textContent = produto.codigo_produto;
                celulaDescricao.textContent = produto.descricao_produto;
                celulaPreco.textContent = produto.preco_produto;

                // Botões de edição e exclusão
                celulaAcoes.innerHTML = `
                    <button class="btn btn-sm btn-warning" onclick="editarProduto(${produto.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="excluirProduto(${produto.id})">Excluir</button>
                `;
            });
        }
    });
}

// Função para salvar um novo produto
function salvarProduto() {
    const nome = document.getElementById('nome-produto').value;
    const codigo = document.getElementById('codigo-produto').value;
    const descricao = document.getElementById('descricao-produto').value;
    const preco = document.getElementById('preco-produto').value;

    if (nome && codigo && preco) {
        const novoProduto = {
            nome: nome,
            codigo: codigo,
            descricao: descricao,
            preco: preco
        };

        db.criarProduto(novoProduto, (err, id) => {
            if (err) {
                console.error(err);
            } else {
                // Limpa os campos do formulário
                document.getElementById('nome-produto').value = '';
                document.getElementById('codigo-produto').value = '';
                document.getElementById('descricao-produto').value = '';
                document.getElementById('preco-produto').value = '';

                // Atualiza a tabela
                carregarProdutos();
            }
        });
    } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
}

// Função para editar um produto
function editarProduto(id) {
    db.listarProdutos((err, rows) => {
        if (err) {
            console.error(err);
        } else {
            const produto = rows.find(p => p.id === id);

            if (produto) {
                // Preenche os campos do formulário
                document.getElementById('nome-produto').value = produto.nome_produto;
                document.getElementById('codigo-produto').value = produto.codigo_produto;
                document.getElementById('descricao-produto').value = produto.descricao_produto;
                document.getElementById('preco-produto').value = produto.preco_produto;

                // Altera o botão "Salvar" para "Atualizar"
                document.getElementById('salvar-produto').textContent = "Atualizar";
                document.getElementById('salvar-produto').onclick = () => atualizarProduto(id);
            } else {
                console.error("Produto não encontrado.");
            }
        }
    });
}

// Função para atualizar um produto
function atualizarProduto(id) {
    const nome = document.getElementById('nome-produto').value;
    const codigo = document.getElementById('codigo-produto').value;
    const descricao = document.getElementById('descricao-produto').value;
    const preco = document.getElementById('preco-produto').value;

    const produto = {
        nome: nome,
        codigo: codigo,
        descricao: descricao,
        preco: preco
    };

    db.atualizarProduto(id, produto, (err) => {
        if (err) {
            console.error(err);
        } else {
            // Limpa os campos do formulário
            document.getElementById('nome-produto').value = '';
            document.getElementById('codigo-produto').value = '';
            document.getElementById('descricao-produto').value = '';
            document.getElementById('preco-produto').value = '';

            // Altera o botão "Atualizar" para "Salvar"
            document.getElementById('salvar-produto').textContent = "Salvar";
            document.getElementById('salvar-produto').onclick = salvarProduto;

            // Atualiza a tabela
            carregarProdutos();
        }
    });
}

// Função para excluir um produto
function excluirProduto(id) {
    db.excluirProduto(id, (err) => {
        if (err) {
            console.error(err);
        } else {
            // Atualiza a tabela
            carregarProdutos();
        }
    });
}

// Carrega os produtos ao iniciar a página
carregarProdutos();

// Adiciona o evento de clique ao botão "Salvar"
document.getElementById('salvar-produto').addEventListener('click', salvarProduto);