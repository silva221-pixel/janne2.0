// ============================
// ELEMENTOS
// ============================

const botoesFiltro = document.querySelectorAll(".filtro-btn");
const produtos = document.querySelectorAll(".produto-card");

const btnsBolo = document.querySelectorAll(".btn-bolo");
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
// MODAL BOLO
// ============================

btnsBolo.forEach(botao => {
    botao.addEventListener("click", () => {
        modal.classList.add("ativo");
        modalOverlay.classList.add("ativo");
    });
});

function fecharModal() {
    modal.classList.remove("ativo");
    modalOverlay.classList.remove("ativo");

    selectTamanho.value = "";
    selectMassa.value = "";
    selectRecheio.value = "";
}

// ============================
// ADICIONAR BOLO AO CARRINHO
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

// ============================
// CARRINHO
// ============================

function atualizarCarrinho() {

    carrinhoItens.innerHTML = "";
    let total = 0;

    itensCarrinho.forEach((item, index) => {

        total += item.preco;

        const div = document.createElement("div");
        div.classList.add("item-carrinho");

        div.innerHTML = `
            <p><strong>${item.nome}</strong></p>
            <small>${item.tamanho} • ${item.massa} • ${item.recheio}</small>
            <p>R$ ${item.preco.toFixed(2)}</p>
            <button onclick="removerItem(${index})">Remover</button>
        `;

        carrinhoItens.appendChild(div);
    });

    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
    contadorCarrinho.textContent = itensCarrinho.length;
}

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
// FINALIZAR NO WHATSAPP
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
        mensagem += `  Tamanho: ${item.tamanho}%0A`;
        mensagem += `  Massa: ${item.massa}%0A`;
        mensagem += `  Recheio: ${item.recheio}%0A`;
        mensagem += `  Valor: R$ ${item.preco.toFixed(2)}%0A%0A`;
        total += item.preco;
    });

    mensagem += `Total: R$ ${total.toFixed(2)}`;

    const numero = "5561991199563";
    const url = `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank");
});