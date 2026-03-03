/* =========================
   UTILIDADES
========================= */

const formatarMoeda = (valor) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};


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

      if (categoria === "todos" || produto.dataset.categoria === categoria) {
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

overlay.addEventListener("click", fecharCarrinho);


/* =========================
   ATUALIZAR CARRINHO
========================= */

function atualizarCarrinho() {

  listaCarrinho.innerHTML = "";
  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item, index) => {

    total += item.preco * item.quantidade;
    totalItens += item.quantidade;

    const itemHTML = `
      <div class="item-carrinho">
        <div>
          <h4>${item.nome}</h4>
          <p>${formatarMoeda(item.preco)}</p>
        </div>

        <div class="qtd-controle">
          <button onclick="diminuirQuantidade(${index})">−</button>
          <span>${item.quantidade}</span>
          <button onclick="aumentarQuantidade(${index})">+</button>
        </div>
      </div>
    `;

    listaCarrinho.innerHTML += itemHTML;
  });

  totalElemento.textContent = formatarMoeda(total);
  contadorCarrinho.textContent = totalItens;

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


/* =========================
   ADICIONAR AO CARRINHO
========================= */

function adicionarAoCarrinho(nome, preco) {

  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      nome,
      preco,
      quantidade: 1
    });
  }

  atualizarCarrinho();
  abrirCarrinho();
}


/* =========================
   CONTROLE DE QUANTIDADE
========================= */

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
    const nomeBase = card.querySelector("h4").textContent;

    const select = card.querySelector(".select-tamanho");

    let nomeFinal = nomeBase;
    let precoFinal;

    if (select) {
      const optionSelecionada = select.options[select.selectedIndex];
      const tamanho = optionSelecionada.value;
      precoFinal = parseFloat(optionSelecionada.dataset.preco);

      nomeFinal = `${nomeBase} - ${tamanho}kg`;
    } else {
      const precoTexto = card.querySelector(".preco").textContent;
      precoFinal = parseFloat(
        precoTexto.replace("R$", "").replace(",", ".").trim()
      );
    }

    adicionarAoCarrinho(nomeFinal, precoFinal);

  });

});


/* =========================
   FINALIZAR WHATSAPP
========================= */

document.querySelector(".btn-finalizar").addEventListener("click", () => {

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "Olá! Gostaria de fazer o seguinte pedido:%0A%0A";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome} (x${item.quantidade}) - ${formatarMoeda(item.preco * item.quantidade)}%0A`;
  });

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  mensagem += `%0ATotal: ${formatarMoeda(total)}%0A`;
  mensagem += "%0AObrigado! 😊";

  const numero = "5561991199563"; // coloque o número real aqui
  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");

});


/* =========================
   INICIAR
========================= */

// Inicia mostrando todos
document.querySelector('[data-categoria="todos"]').click();

atualizarCarrinho();