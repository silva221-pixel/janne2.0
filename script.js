/* =========================
   FILTRO DE CATEGORIA
========================= */

const botoesFiltro = document.querySelectorAll(".filtro-btn");
const produtos = document.querySelectorAll(".produto-card");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        const categoria = botao.dataset.categoria;

        // remover ativo
        botoesFiltro.forEach(btn => btn.classList.remove("active"));
        botao.classList.add("active");

        produtos.forEach(produto => {
            if (produto.dataset.categoria === categoria) {
                produto.style.display = "block";
            } else {
                produto.style.display = "none";
            }
        });
    });
});


/* =========================
   CARRINHO
========================= */

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const carrinhoLateral = document.querySelector(".carrinho-lateral");
const overlay = document.querySelector(".carrinho-overlay");
const listaCarrinho = document.querySelector(".carrinho-itens");
const totalElemento = document.getElementById("total-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");

function abrirCarrinho() {
    carrinhoLateral.classList.add("ativo");
    overlay.classList.add("ativo");
}

function fecharCarrinho() {
    carrinhoLateral.classList.remove("ativo");
    overlay.classList.remove("ativo");
}

function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";
    let total = 0;
    let totalItens = 0;

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;
        totalItens += item.quantidade;

        listaCarrinho.innerHTML += `
      <div class="item-carrinho">
        <div>
          <h4>${item.nome}</h4>
          <p>R$ ${item.preco.toFixed(2)}</p>
        </div>

        <div class="controle-qtd">
          <button onclick="diminuirQuantidade(${index})">−</button>
          <span>${item.quantidade}</span>
          <button onclick="aumentarQuantidade(${index})">+</button>
        </div>
      </div>
    `;
    });

    totalElemento.textContent = "R$ " + total.toFixed(2);
    contadorCarrinho.textContent = totalItens;

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ nome, preco, quantidade: 1 });
    }

    atualizarCarrinho();
    abrirCarrinho();
}

function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    atualizarCarrinho();
}

function diminuirQuantidade(index) {
    carrinho[index].quantidade--;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}


/* =========================
   BOTÕES ADICIONAR
========================= */

document.querySelectorAll(".btn-add").forEach(botao => {
    botao.addEventListener("click", () => {
        const card = botao.closest(".produto-card");
        const nome = card.querySelector("h4").textContent;
        const precoTexto = card.querySelector(".preco").textContent;

        const preco = parseFloat(
            precoTexto.replace("A partir de R$", "")
                .replace("R$", "")
                .replace(",", ".")
        );

        adicionarAoCarrinho(nome, preco);
    });
});


/* =========================
   FINALIZAR WHATSAPP
========================= */

document.querySelector(".btn-finalizar").addEventListener("click", () => {

    if (carrinho.length === 0) return;

    let mensagem = "Olá, gostaria de fazer o pedido:%0A%0A";

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });

    mensagem += `%0ATotal: ${totalElemento.textContent}`;

    const numero = "5561991199563"; // COLOQUE O NÚMERO AQUI
    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
});


/* =========================
   INICIAR
========================= */
// Iniciar mostrando apenas a categoria ativa
document.querySelector(".filtro-btn.active").click();

atualizarCarrinho();