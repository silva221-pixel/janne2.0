// ============================
// ELEMENTOS
// ============================

const botoesFiltro = document.querySelectorAll(".filtro-btn");
const produtos = document.querySelectorAll(".produto-card");

const modal = document.getElementById("modalBolo");
const modalOverlay = document.getElementById("modalOverlay");

const confirmarBolo = document.getElementById("confirmarBolo");
const selectTamanho = document.getElementById("modalTamanho");
const selectMassa = document.getElementById("modalMassa");
const selectRecheio = document.getElementById("modalRecheio");

const carrinho = document.querySelector(".carrinho-lateral");
const overlayCarrinho = document.querySelector(".carrinho-overlay");
const carrinhoItens = document.querySelector(".carrinho-itens");
const totalCarrinho = document.getElementById("total-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");
const btnFinalizar = document.querySelector(".btn-finalizar");

const modalFatia = document.getElementById("modalFatia");
const modalFatiaOverlay = document.getElementById("modalFatiaOverlay");
const selectSaborFatia = document.getElementById("selectSaborFatia");
const confirmarFatia = document.getElementById("confirmarFatia");

let itensCarrinho = [];

// ============================
// FILTROS
// ============================

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {

        botoesFiltro.forEach(btn => btn.classList.remove("active"));
        botao.classList.add("active");

        const categoria = botao.dataset.categoria;

        produtos.forEach(produto => {
            if (categoria === "todos" || produto.dataset.categoria === categoria) {
                produto.style.display = "block";
            } else {
                produto.style.display = "none";
            }
        });
    });
});

// ============================
// MODAL
// ============================

function abrirModal() {
    modal.classList.add("ativo");
    modalOverlay.classList.add("ativo");
}

function fecharModal() {
    modal.classList.remove("ativo");
    modalOverlay.classList.remove("ativo");

    selectTamanho.value = "";
    selectMassa.value = "";
    selectRecheio.value = "";
}

function abrirModalFatia() {
    modalFatia.classList.add("ativo");
    modalFatiaOverlay.classList.add("ativo");
}

function fecharModalFatia() {
    modalFatia.classList.remove("ativo");
    modalFatiaOverlay.classList.remove("ativo");
    selectSaborFatia.value = "";
}

// ============================
// ADICIONAR BOLO PERSONALIZADO
// ============================

confirmarBolo.addEventListener("click", () => {

    const tamanho = selectTamanho.value;
    const massa = selectMassa.value;
    const recheio = selectRecheio.value;

    if (!tamanho || !massa || !recheio) {
        alert("Escolha tamanho, massa e recheio.");
        return;
    }

    const preco = parseFloat(
        selectTamanho.options[selectTamanho.selectedIndex].dataset.preco
    );

    const item = {
        nome: "Bolo Personalizado",
        tamanho,
        massa,
        recheio,
        preco
    };

    itensCarrinho.push(item);
    atualizarCarrinho();
    fecharModal();
});

confirmarFatia.addEventListener("click", () => {

    const sabor = selectSaborFatia.value;

    if (!sabor) {
        alert("Escolha o sabor da fatia.");
        return;
    }

    const item = {
        nome: "Fatia Gourmet",
        sabor: sabor,
        preco: 12
    };

    itensCarrinho.push(item);
    atualizarCarrinho();
    fecharModalFatia();
});

// ============================
// ADICIONAR OUTROS PRODUTOS
// ============================

function adicionarItem(nome, preco) {

    const item = {
        nome,
        preco
    };

    itensCarrinho.push(item);
    atualizarCarrinho();
}

// ============================
// ATUALIZAR CARRINHO
// ============================

function atualizarCarrinho() {

    carrinhoItens.innerHTML = "";
    let total = 0;

    itensCarrinho.forEach((item, index) => {

        total += item.preco;

        const div = document.createElement("div");
        div.classList.add("item-carrinho");

        div.innerHTML = `
            <h4>${item.nome}</h4>
            ${item.tamanho ? `
    <small>${item.tamanho} • ${item.massa} • ${item.recheio}</small>
` : ""}

${item.sabor ? `
    <small>Sabor: ${item.sabor}</small>
` : ""}
            <div class="item-footer">
                <strong>R$ ${item.preco.toFixed(2)}</strong>
                <button class="remover-item" onclick="removerItem(${index})">
                    Remover
                </button>
            </div>
        `;

        carrinhoItens.appendChild(div);
    });

    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
    contadorCarrinho.textContent = itensCarrinho.length;
}

// ============================
// REMOVER ITEM
// ============================

function removerItem(index) {
    itensCarrinho.splice(index, 1);
    atualizarCarrinho();
}

// ============================
// ABRIR / FECHAR CARRINHO
// ============================

function abrirCarrinho() {
    carrinho.classList.add("ativo");
    overlayCarrinho.classList.add("ativo");
}

function fecharCarrinho() {
    carrinho.classList.remove("ativo");
    overlayCarrinho.classList.remove("ativo");
}

// ============================
// FINALIZAR WHATSAPP
// ============================

btnFinalizar.addEventListener("click", () => {

    if (itensCarrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o pedido:%0A%0A";
    let total = 0;

    itensCarrinho.forEach(item => {

        mensagem += `• ${item.nome}%0A`;

        if (item.tamanho) {
            mensagem += `  Tamanho: ${item.tamanho}%0A`;
            mensagem += `  Massa: ${item.massa}%0A`;
            mensagem += `  Recheio: ${item.recheio}%0A`;
        }

        if (item.sabor) {
            mensagem += `  Sabor: ${item.sabor}%0A`;
        }

        mensagem += `  Valor: R$ ${item.preco.toFixed(2)}%0A%0A`;

        total += item.preco;
    });

    mensagem += `Total do pedido: R$ ${total.toFixed(2)}`;

    const numero = "5561991199563";
    const url = `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank");
});