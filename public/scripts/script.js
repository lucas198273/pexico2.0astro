document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const cartBtn = document.getElementById("cart-btn"); // Botão do carrinho
  const closeModal = document.getElementById("close-modal-btn");
  const cartTotal = document.getElementById("cart-total");
  const entregaBtn = document.getElementById("entrega-btn");
  const entregaForm = document.getElementById("entrega-form");
  const modalHorarios = document.getElementById("modal-horarios");
  const openModal = document.getElementById("open-modal-horarios");
  const openModalMobile = document.getElementById("open-modal-horarios-mobile");
  const checkoutBtn = document.getElementById("checkout-btn");
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");



  const addressInputNome = document.getElementById("nome-completo");
const addressInputRuaNumero = document.getElementById("rua-numero");
const addressInputBairro = document.getElementById("bairro");      // Use "bairro" (minúsculo)
const addressInputReferencia = document.getElementById("referencia"); // Use "referencia" (minúsculo)
const addressWarn = document.getElementById("address-warn");


  let cart = [];
  let itemQuanty = 0;
  let pedidoTipo = ""; // Atendimento somente delivery
  const spanItem = document.getElementById("date-span");
  const statusText = document.getElementById("status-text");


  const mesaBtn = document.getElementById("mesa-btn");
  const mesaForm = document.getElementById("mesa-form");
  const mesaButtonsContainer = document.getElementById("mesa-buttons");
  const mesaNumberInput = document.getElementById("mesa-number");
  const selectedMesaText = document.getElementById("selected-mesa");

  function validarTipoDePedido() {
    if (pedidoTipo === "mesa") {
        if (!validateMesa()) {
            showToast("Selecione uma mesa");
            return false;
        }
    } else if (pedidoTipo === "entrega") {
        if (!validateAddress()) {
            showToast("Confirme o endereço de entrega");
            return false;
        }
    } else {
        showToast("Por favor, selecione um tipo de pedido: Entrega ou Atendimento em Mesa.");
        return false;
    }
    return true;
}

  
  mesaBtn.addEventListener("click", () => {
    pedidoTipo = "mesa";
    entregaForm.classList.add("hidden");
    mesaForm.classList.remove("hidden");
  });
  function validateMesa(){
    const mesaSelecionada = document.getElementById("mesa-number").value;
    if(mesaSelecionada === ""){;
      return false;
    }
    return true;
    
  }
  
  entregaBtn.addEventListener("click", () => {
    pedidoTipo = "entrega";
    entregaForm.classList.remove("hidden");
    mesaForm.classList.add("hidden");
  });

  for (let i = 1; i <= 20; i++) {
    const button = document.createElement("button");
    button.classList.add("bg-gray-300", "p-2", "rounded", "hover:bg-gray-400");
    button.textContent = i;
    button.addEventListener("click", () => {
      mesaNumberInput.value = i;
      selectedMesaText.classList.remove("hidden");
      selectedMesaText.querySelector("span").textContent = i;
    });
    mesaButtonsContainer.appendChild(button);
  }

  checkoutBtn.addEventListener("click", () => {
    if (!checkRestauranteOpen()) {
      showToast("Estamos fechados, volte mais tarde!");
      return;
    }
  
    if (cart.length === 0) {
      showToast("Carrinho vazio");
      return;
    }
  
    if (!validarTipoDePedido()) {
      return; // A função já exibe a mensagem de erro se necessário
    }
  
    if (pedidoTipo === "entrega" && !validateAddress()) {
      showToast("Confirme o endereço de entrega");
      return;
    }
    if(pedidoTipo === "mesa" && !validateMesa()) {
      showToast("Selecione uma uma mesa");
      return;
    }
  
    // Reseta a cor dos botões dos itens presentes no carrinho
    cart.forEach(item => {
      const button = document.querySelector(`[data-name="${item.name}"]`);
      if (button) updateButtonState(button, false);
    });
  
    const msg = createWhatsAppMessage();
    const phone = "31999564747";
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  
    resetCart();
  });
  

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
  const mobileMenuItems = mobileMenu.querySelectorAll("a, button");
  mobileMenuItems.forEach(item => {
    item.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  openModal.addEventListener("click", () => {
    modalHorarios.classList.remove("hidden");
  });
  openModalMobile.addEventListener("click", () => {
    modalHorarios.classList.remove("hidden");
  });

  if (checkRestauranteOpen()) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    statusText.textContent = "Estamos funcionando";
  } else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    statusText.textContent = "Estamos fechados";
  }



  function updateButtonState(button, isInCart) {
    button.classList.toggle("bg-green-600", isInCart);
    button.classList.toggle("bg-gray-900", !isInCart);
  }

  function resetCart() {
    cart = [];
    itemQuanty = 0;
    cartCount.textContent = itemQuanty;
    updateModal();
    updateCartTotal();
  }

  function checkRestauranteOpen() {
    const data = new Date();
    const diaSemana = data.getDay();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    const horarioAtual = hora * 60 + minutos;
    const abertura = 18 * 60 + 30; // 18:30
    const fechamentoSemana = 2 * 60 + 24 * 60; // 02:00 AM
    const fechamentoFimDeSemana = 3 * 60 + 24 * 60; // 03:00 AM

    if (diaSemana === 2) return false; // Terça-feira fechado

    const horarioAjustado = horarioAtual < abertura ? horarioAtual + 24 * 60 : horarioAtual;
    if (diaSemana >= 1 && diaSemana <= 4) {
      return horarioAjustado >= abertura && horarioAjustado < fechamentoSemana;
    }
    if ([0, 5, 6].includes(diaSemana)) {
      return horarioAjustado >= abertura && horarioAjustado < fechamentoFimDeSemana;
    }
    return false;
  }
  function validateAddress() {
    const fields = [
      { input: addressInputNome, name: "Nome Completo" },
      { input: addressInputRuaNumero, name: "Rua, Número" },
      { input: addressInputBairro, name: "Bairro" },
      { input: addressInputReferencia, name: "Referência" }
    ];
    let valid = true;
  
    // Remove as marcações de erro e loga os valores
    fields.forEach(field => {
      field.input.classList.remove("border-red-300");
      console.log(field.name, `"${field.input.value}"`);
    });
    
    // Verifica se algum campo está vazio (ou contém apenas espaços)
    fields.forEach(field => {
      if (field.input.value.trim() === "") {
        valid = false;
        field.input.classList.add("border-red-300");
        console.log(`Campo ${field.name} está vazio.`);
      }
    });
    
    // Mostra ou esconde o aviso de endereço inválido
    if (!valid) {
      addressWarn.classList.remove("hidden");
    } else {
      addressWarn.classList.add("hidden");
    }
    
    console.log("validateAddress retorna", valid);
    return valid;
  }

     
function showToast(message) {
  Toastify({
      text: message,
      duration: 4000, // Um pouco mais de tempo para leitura
      close: true, // Botão de fechamento
      gravity: "top", // `top` ou `bottom`
      position: "right", // `left`, `center` ou `right`
      stopOnFocus: true, // Evita fechar ao passar o mouse
      style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)", // Gradiente com cores quentes
          color: "#fff", // Texto em branco para contraste
          fontSize: "16px", // Tamanho da fonte
          fontWeight: "bold", // Deixa o texto mais destacado
          borderRadius: "8px", // Bordas arredondadas
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Adiciona sombra para profundidade
          padding: "10px 20px", // Aumenta o espaço interno
      },
      offset: {
          x: 10, // Distância da borda lateral
          y: 50, // Distância do topo
      },
      onClick: function () {
          console.log("Toast clicado!"); // Callback após clique
      },
  }).showToast();
}
  
  function updateModal() {
    // Limpa o container de itens do carrinho
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "flex-col", "mb-4", "p-4", "border", "rounded-lg", "shadow-md", "bg-white");
      cartItemElement.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
          <div class="flex-1">
            <p class="text-lg font-semibold">${item.name}</p>
            <p>Quantidade: <span class="item-quantity">${item.quantity}</span></p>
            <p class="text-green-500">R$ ${item.price.toFixed(2)}</p>
          </div>
          <div class="min-w-[100px] flex-shrink-0">
            <button class="remove-from-cart w-full bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition" data-name="${item.name}">
              Remover
            </button>
          </div>
        </div>
      `;
      total += item.price * item.quantity;
      cartItemsContainer.appendChild(cartItemElement);
    });
    updateCartTotal();
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Seu carrinho está vazio.</p>';
    }
  }

  function updateCartTotal() {
    const currentTotal = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    cartTotal.textContent = currentTotal.toLocaleString("pt-br", { 
      style: "currency", 
      currency: "BRL" 
    });
  }

  let isAddingToCart = false;

  menu.addEventListener("click", event => {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (!parentButton) return;
    // Muda a cor imediatamente ao clicar
    parentButton.classList.remove("bg-gray-900");
    parentButton.classList.add("bg-green-500");
    parentButton.style.transition = 'none';
    parentButton.offsetHeight; // Força o navegador a reprocessar o estilo imediatamente

    const name = parentButton.getAttribute("data-name");
    const priceAttr = parentButton.getAttribute("data-price");
    const price = parseFloat(priceAttr.replace('R$', '').replace(',', '.'));

    // Adiciona o produto ao carrinho
    addToCart(name, price);
  });

  function addToCart(name, price) {
    if (isAddingToCart) return;
    isAddingToCart = true;
    const existingItem = cart.find(item => item.name === name);
    const button = document.querySelector(`[data-name="${name}"]`);
    if (!button) return;
    if (existingItem) {
      existingItem.quantity++;
      
    } else {
      cart.push({ name, price, quantity: 1 });
      showToast("Item Adicionado")
    }
    itemQuanty++;
    cartCount.textContent = itemQuanty;
    updateModal();
    updateCartTotal();
    setTimeout(() => isAddingToCart = false, 300);
    setTimeout(() => {
      button.style.transition = '';
    }, 50);
  }

  cartBtn.addEventListener("click", () => {
    cartModal.style.display = "flex";
  });
  closeModal.addEventListener("click", () => {
    cartModal.style.display = "none";
  });
  cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  cartItemsContainer.addEventListener("click", event => {
    const target = event.target;
    const itemName = target.dataset.name;
    if (target.classList.contains("remove-from-cart")) {
      removeItemCart(itemName);
    }
  });

  function removeItemCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex === -1) return;
    const button = document.querySelector(`[data-name="${name}"]`);
    const item = cart[itemIndex];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.splice(itemIndex, 1);
      button.classList.remove("bg-green-500");
      button.classList.add("bg-gray-900");
      button.style.transition = 'none';
      button.offsetHeight;
      setTimeout(() => {
        button.style.transition = '';
      }, 50);
    }
    itemQuanty--;
    cartCount.innerHTML = itemQuanty;
    updateModal();
    updateCartTotal();
  }
  function createWhatsAppMessage() {
    if (cart.length === 0) {
        showToast("Carrinho vazio");
        return "";
    }

    let cartItemsText = "";
    let totalProducts = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalProducts += itemTotal;
        cartItemsText += `\n${item.name} - Quantidade: ${item.quantity} - Subtotal: R$${itemTotal.toFixed(2)}`;
    });

    let pedidoInfo = `Olá, gostaria de fazer um pedido:\n${cartItemsText}\nTotal geral: R$${totalProducts.toFixed(2)}\n`;

    if (pedidoTipo === "entrega") {
        if (!validateAddress()) {
            showToast("Confirme o endereço de entrega");
            return "";
        }
        pedidoInfo += `\n📍 *Entrega para:* ${addressInputNome.value}\n🏠 *Endereço:* ${addressInputRuaNumero.value}, ${addressInputBairro.value}\n📝 *Referência:* ${addressInputReferencia.value || "Nenhuma"}\n`;
    } else if (pedidoTipo === "mesa") {
        const mesaInput = document.getElementById("mesa-number");
        const mesaSelecionada = mesaInput ? mesaInput.value : "";
        if (!mesaSelecionada) {
            showToast("Selecione um número de mesa antes de continuar!");
            return "";
        }
        pedidoInfo += `\n🍽️ *Atendimento na Mesa:* ${mesaSelecionada}\n`;
    } else {
        showToast("Escolha um tipo de pedido antes de finalizar!");
        return "";
    }

    return encodeURIComponent(pedidoInfo);
}

  
});
