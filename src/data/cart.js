document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------
    // Recupera ou inicializa o carrinho e variáveis de estado
    // ------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    let pedidoTipo = null; // 'mesa' ou 'entrega'
    let mesaNumero = null;
  
    // ------------------------------------------------------
    // Elementos do DOM
    // ------------------------------------------------------
    const menu = document.getElementById("menu");
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cartCount = document.getElementById("cart-count");
    const dateSpan = document.getElementById("date-span");
  
    // Endereço (para entrega)
    const addressInputNome = document.getElementById("nome-completo");
    const addressInputRuaNumero = document.getElementById("rua-numero");
    const addressInputBairro = document.getElementById("Bairro");
    const addressInputReferencia = document.getElementById("Referencia");
    const addressWarn = document.getElementById("address-warn");
  
    // Modal de horários
    const closeModalHorarios = document.getElementById("close-modal-horarios");
  
    // Botões e formulários de pedido
    const mesaBtn = document.getElementById("mesa-btn");
    const entregaBtn = document.getElementById("entrega-btn");
    const mesaForm = document.getElementById("mesa-form");
    const entregaForm = document.getElementById("entrega-form");
    const mesaButtonsContainer = document.getElementById("mesa-buttons");
    const selectedMesaDisplay = document.getElementById("selected-mesa");
  
    // ------------------------------------------------------
    // Função de Toast (usando Toastify – certifique‑se de incluir a biblioteca)
    // ------------------------------------------------------
    function showToast(message) {
      Toastify({
        text: message,
        duration: 4000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          padding: "10px 20px",
        },
        offset: { x: 10, y: 50 },
        onClick: () => console.log("Toast clicado!"),
      }).showToast();
    }
  
    // ------------------------------------------------------
    // Atualização do Carrinho – Contagem, Total e Modal
    // ------------------------------------------------------
    function updateCartCount() {
      itemQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartCount) cartCount.textContent = itemQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function updateCartTotal() {
      const total = cart.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        const comboTotal = (item.comboQuantity || 0) * 12.90;
        return sum + itemTotal + comboTotal;
      }, 0);
      if (cartTotalElement) {
        cartTotalElement.textContent = total.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }
    }
  
    function updateModal() {
      if (!cartItemsContainer) return;
      cartItemsContainer.innerHTML = "";
      let total = 0;
      cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.className = "flex flex-col mb-4 p-4 border rounded-lg shadow-md";
        const comboButtonsVisibility = item.isBurguers ? "flex" : "hidden";
        const comboMessage = item.isCombo
          ? `<p class="text-red-500 font-semibold">Combo: ${item.comboQuantity}</p>`
          : "";
        cartItemElement.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200">
            <div>
              <p class="text-lg font-semibold">${item.name}</p>
              <p>Quantidade: ${item.quantity}</p>
              <p class="text-green-500">R$ ${item.price.toFixed(2)}</p>
              ${comboMessage}
            </div>
            <div class="${comboButtonsVisibility} flex-col items-center space-y-2 min-w-[150px]">
              <button 
                class="add-combo bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                data-name="${item.name}">
                Adicionar Combo
              </button>
              <button 
                class="remove-combo bg-yellow-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                data-name="${item.name}">
                Remover Combo
              </button>
            </div>
            <div class="min-w-[100px]">
              <button 
                class="remove-from-cart bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                data-name="${item.name}">
                Remover
              </button>
            </div>
          </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
      });
      if (cartTotalElement) {
        cartTotalElement.textContent = total.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }
    }
  
    function updateButtonState(button, isInCart) {
      if (button) {
        if (isInCart) {
          button.classList.remove("bg-gray-900");
          button.classList.add("bg-green-500");
        } else {
          button.classList.remove("bg-green-500");
          button.classList.add("bg-gray-900");
        }
      }
    }
  
    // ------------------------------------------------------
    // Funções para Manipulação do Carrinho
    // ------------------------------------------------------
    function addToCart(name, price) {
      const buttonElement = document.querySelector(`[data-name="${name}"]`);
      const isHamburguer = buttonElement && buttonElement.closest(".card-burguer") !== null;
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity++;
        if (isHamburguer) {
          existingItem.isBurguers = true;
        }
      } else {
        cart.push({
          name,
          price,
          quantity: 1,
          comboQuantity: 0,
          isCombo: false,
          isBurguers: isHamburguer || false,
        });
      }
      itemQuantity++;
      updateCartCount();
      updateModal();
      updateCartTotal();
    }
  
    function updateCombo(itemName, action) {
      const item = cart.find(i => i.name === itemName);
      if (!item) return;
      if (action === "add") {
        if (item.quantity > (item.comboQuantity || 0)) {
          item.comboQuantity = (item.comboQuantity || 0) + 1;
          item.isCombo = true;
          showToast(`Combo adicionado para ${item.name}!`);
        } else {
          showToast(`Quantidade insuficiente para adicionar combo.`);
        }
      } else if (action === "remove") {
        if ((item.comboQuantity || 0) > 0) {
          item.comboQuantity--;
          if (item.comboQuantity === 0) {
            item.isCombo = false;
          }
          showToast(`Combo removido de ${item.name}!`);
        } else {
          showToast(`Não há combos para remover.`);
        }
      }
      updateModal();
      updateCartTotal();
    }
  
    function removeItemCart(name) {
      const itemIndex = cart.findIndex(item => item.name === name);
      if (itemIndex === -1) return;
      const item = cart[itemIndex];
      if (item.quantity > 1) {
        item.quantity--;
        if (item.comboQuantity > 0) {
          item.comboQuantity--;
          showToast(`Combo removido automaticamente de ${item.name}!`);
        }
      } else {
        cart.splice(itemIndex, 1);
        const button = document.querySelector(`[data-name="${item.name}"]`);
        updateButtonState(button, false);
      }
      itemQuantity--;
      updateCartCount();
      updateModal();
      updateCartTotal();
    }
  
    // ------------------------------------------------------
    // Verificação do Horário de Funcionamento do Restaurante
    // ------------------------------------------------------
    function checkRestauranteOpen() {
      const data = new Date();
      const diaSemana = data.getDay();
      const hora = data.getHours();
      const minutos = data.getMinutes();
      const horarioAtual = hora * 60 + minutos;
      const abertura = 18 * 60 + 30;
      const fechamentoSemana = 2 * 60 + 24 * 60;
      const fechamentoFimDeSemana = 3 * 60 + 24 * 60;
      if (diaSemana === 2) return false;
      const horarioAjustado = horarioAtual < abertura ? horarioAtual + 24 * 60 : horarioAtual;
      if (diaSemana >= 1 && diaSemana <= 4) {
        return horarioAjustado >= abertura && horarioAjustado < fechamentoSemana;
      }
      if (diaSemana === 5 || diaSemana === 6 || diaSemana === 0) {
        return horarioAjustado >= abertura && horarioAjustado < fechamentoFimDeSemana;
      }
      return false;
    }
  
    const isOpenRestaurante = checkRestauranteOpen();
    if (dateSpan) {
      if (isOpenRestaurante) {
        dateSpan.classList.remove("bg-red-500");
        dateSpan.classList.add("bg-green-600");
        document.getElementById('status-text').textContent = "Estamos funcionando";
      } else {
        dateSpan.classList.remove("bg-green-600");
        dateSpan.classList.add("bg-red-500");
        document.getElementById('status-text').textContent = "Estamos fechados";
      }
    }
  
    // ------------------------------------------------------
    // Validação do Endereço para Pedidos de Entrega
    // ------------------------------------------------------
    function validateAddress() {
      const fieldsToValidate = [
        { input: addressInputNome, name: "Nome Completo" },
        { input: addressInputRuaNumero, name: "Rua, Número" },
        { input: addressInputBairro, name: "Bairro" },
        { input: addressInputReferencia, name: "Referencia" }
      ];
      let valid = true;
      fieldsToValidate.forEach(field => field.input.classList.remove("border-red-300"));
      fieldsToValidate.forEach(field => {
        if (field.input.value.trim() === "") {
          valid = false;
          field.input.classList.add("border-red-300");
        }
      });
      if (!valid) {
        addressWarn.classList.remove("hidden");
      } else {
        addressWarn.classList.add("hidden");
      }
      return valid;
    }
  
    // ------------------------------------------------------
    // Criação da Mensagem para o WhatsApp
    // ------------------------------------------------------
    function createWhatsAppMessage() {
      let cartItemsText = "";
      let totalProducts = 0;
      let totalCombos = 0;
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalProducts += itemTotal;
        let itemText = `\n${item.name} - Quantidade: ${item.quantity} - Subtotal: R$${itemTotal.toFixed(2)}`;
        if (item.isCombo) {
          const comboTotal = (item.comboQuantity || 0) * 12.90;
          totalCombos += comboTotal;
          itemText += ` \nQuantidade de Combos: ${item.comboQuantity}, Total dos combos: R$${comboTotal.toFixed(2)}\n`;
        }
        cartItemsText += `${itemText}\n`;
      });
      const totalGeral = totalProducts + totalCombos;
      let additionalInfo = "";
      if (pedidoTipo === 'mesa') {
        additionalInfo = `\nNúmero da mesa: ${mesaNumero}`;
      } else if (pedidoTipo === 'entrega') {
        additionalInfo = `\nNome do cliente: ${addressInputNome.value}` +
          `\nEndereço: ${addressInputRuaNumero.value}, ${addressInputBairro.value}` +
          `\nReferência: ${addressInputReferencia.value}`;
      }
      const message = `Olá, gostaria de fazer um pedido:\n\n` +
        `${cartItemsText}\n` +
        `Total dos produtos: R$${totalProducts.toFixed(2)}\n` +
        `Total dos combos: R$${totalCombos.toFixed(2)}\n` +
        `Total geral: R$${totalGeral.toFixed(2)}\n` +
        `${additionalInfo}`;
      return encodeURIComponent(message);
    }
  
    function resetCart() {
      cart = [];
      updateCartTotal();
      updateModal();
    }
  
    // ------------------------------------------------------
    // Checkout – Valida e Envia o Pedido via WhatsApp
    // ------------------------------------------------------
    checkoutBtn.addEventListener("click", () => {
      if (!checkRestauranteOpen()) {
        showToast("⚠️ Ops, estamos fechados no momento!");
        return;
      }
      if (cart.length === 0) {
        showToast("⚠️ Ops, seu carrinho está vazio!");
        return;
      }
      if (pedidoTipo === null) {
        showToast("⚠️ Ops, você precisa escolher um tipo de serviço!");
        return;
      }
      if (pedidoTipo === 'entrega' && !validateAddress()) {
        showToast("⚠️ Ops, preencha todos os campos!");
        return;
      }
      if (pedidoTipo === 'mesa' && mesaNumero === null) {
        showToast("⚠️ Ops, você precisa selecionar uma mesa!");
        return;
      }
      // Reseta os botões de "adicionar" para o estado padrão
      cart.forEach(item => {
        const button = document.querySelector(`[data-name="${item.name}"]`);
        if (button) updateButtonState(button, false);
      });
      itemQuantity = 0;
      updateCartCount();
      const msg = createWhatsAppMessage();
      const phone = "31999918730";
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
      resetCart();
    });
  
    // ------------------------------------------------------
    // Eventos para Abertura/Fechamento do Modal do Carrinho
    // ------------------------------------------------------
    cartBtn.addEventListener("click", () => {
      if (cartModal) cartModal.style.display = "flex";
    });
    cartModal.addEventListener("click", (event) => {
      if (event.target === cartModal) {
        cartModal.style.display = "none";
      }
    });
    closeModalBtn.addEventListener("click", () => {
      if (cartModal) cartModal.style.display = "none";
    });
  
    // ------------------------------------------------------
    // Eventos para Seleção de Mesa e Tipo de Pedido
    // ------------------------------------------------------
    mesaButtonsContainer.addEventListener("click", (event) => {
      if (event.target.dataset.mesa) {
        mesaNumero = event.target.dataset.mesa;
        if (selectedMesaDisplay) {
          selectedMesaDisplay.querySelector("span").textContent = mesaNumero;
          selectedMesaDisplay.classList.remove("hidden");
        }
      }
    });
  
    mesaBtn.addEventListener("click", () => {
      pedidoTipo = 'mesa';
      mesaForm.classList.remove("hidden");
      entregaForm.classList.add("hidden");
    });
  
    entregaBtn.addEventListener("click", () => {
      pedidoTipo = 'entrega';
      entregaForm.classList.remove("hidden");
      mesaForm.classList.add("hidden");
    });
  
    // ------------------------------------------------------
    // Modal de Horários – Abertura e Fechamento
    // ------------------------------------------------------
    function openModalHorarios() {
      const modal = document.getElementById('modal-horarios');
      if (modal) modal.style.display = 'flex';
    }
    closeModalHorarios.addEventListener("click", () => {
      const modal = document.getElementById('modal-horarios');
      if (modal) modal.style.display = 'none';
    });
  
    // ------------------------------------------------------
    // Eventos para Adicionar Itens via Clique no Menu (com Throttle)
    // ------------------------------------------------------
    let isProcessingClick = false;
    menu.addEventListener("click", (event) => {
      if (isProcessingClick) return;
      isProcessingClick = true;
      setTimeout(() => isProcessingClick = false, 300);
      const parentButton = event.target.closest(".add-to-cart-btn");
      if (parentButton) {
        updateButtonState(parentButton, true);
        setTimeout(() => { parentButton.style.backgroundColor = ""; }, 0);
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
      }
    });
  
    // ------------------------------------------------------
    // Eventos para Combos e Remoção de Itens dentro do Modal
    // ------------------------------------------------------
    // Delegação de eventos dentro do container do modal
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener("click", (event) => {
        const target = event.target;
        const itemName = target.dataset.name;
        if (target.classList.contains("remove-from-cart")) {
          removeItemCart(itemName);
        }
        if (target.classList.contains("add-combo")) {
          updateCombo(itemName, "add");
        } else if (target.classList.contains("remove-combo")) {
          updateCombo(itemName, "remove");
        }
      });
    }
  
    // ------------------------------------------------------
    // Atualiza a contagem inicial do carrinho
    // ------------------------------------------------------
    updateCartCount();
  });
  