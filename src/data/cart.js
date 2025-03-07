document.addEventListener("DOMContentLoaded", () => {
    // Função auxiliar para adicionar múltiplos event listeners
    function addListeners(element, events, handler) {
      events.forEach(event => element.addEventListener(event, handler, { passive: true }));
    }
  
    // Seleção de elementos
    const menu = document.getElementById("menu"); // Contêiner dos produtos
    const cartBtn = document.getElementById("cart-btn"); // Botão do carrinho (verifique se o Footer contém este ID)
    const cartModal = document.getElementById("cart-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModal = document.getElementById("close-modal-btn");
    const cartCount = document.getElementById("cart-count");
    const entregaBtn = document.getElementById("entrega-btn");
    const entregaForm = document.getElementById("entrega-form");
  
    // Inputs de endereço para delivery
    const addressInputNome = document.getElementById("nome-completo");
    const addressInputRuaNumero = document.getElementById("rua-numero");
    const addressInputBairro = document.getElementById("Bairro");
    const addressInputReferencia = document.getElementById("Referencia");
    const addressWarn = document.getElementById("address-warn");
  
    /* --- Variáveis globais --- */
    let cart = [];
    let itemQuanty = 0;
    let pedidoTipo = "entrega"; // Atendimento somente delivery
  
    /* --- Funções auxiliares --- */

      const botoes = document.querySelectorAll('.add-to-cart-btn');
      botoes.forEach(botao => {
          botao.addEventListener('click', (event) => {
             
              const parentButton = event.target.closest(".add-to-cart-btn");
              if (!parentButton) return;
              // Atualiza o botão para verde imediatamente
              updateButtonState(parentButton, true);
              // Garante que a alteração de classe seja renderizada antes de adicionar
              requestAnimationFrame(() => {
                const name = parentButton.getAttribute("data-name");
                const priceAttr = parentButton.getAttribute("data-price");
                const price = parseFloat(priceAttr.replace('R$', '').replace(',', '.'));
                addToCart(name, price);
                console.log|("chegou")
              });
          });
      });
  
  
    // Atualiza o modal com os itens do carrinho
    function updateModal() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        cart.forEach(item => {
          const cartItemElement = document.createElement("div");
          cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col", "p-4", "border", "rounded-lg", "shadow-md");
          cartItemElement.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200">
              <div>
                <p class="text-lg font-semibold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="text-green-500">R$ ${item.price.toFixed(2)}</p>
              </div>
              <div class="min-w-[100px]">
                <button class="remove-from-cart bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition" data-name="${item.name}">
                  Remover
                </button>
              </div>
            </div>
          `;
          total += item.price * item.quantity;
          cartItemsContainer.appendChild(cartItemElement);
        });
        cartTotal.textContent = total.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
      }
  
    // Atualiza o total do carrinho (considerando combos)

  
    // Adiciona ou remove um combo de um item
    function updateCombo(itemName, action) {
      const item = cart.find(i => i.name === itemName);
      if (!item) return;
      if (action === "add") {
        if (item.quantity > item.comboQuantity) {
          item.comboQuantity++;
          item.isCombo = true;
          showToast(`Combo adicionado para ${item.name}!`);
        } else {
          showToast(`Quantidade insuficiente para adicionar combo.`);
        }
      } else if (action === "remove") {
        if (item.comboQuantity > 0) {
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
  
    // Remove um item do carrinho e atualiza o botão correspondente
    function removeItemCart(name) {
      const itemIndex = cart.findIndex(item => item.name === name);
      if (itemIndex === -1) return;
      const item = cart[itemIndex];
      const button = document.querySelector(`[data-name="${item.name}"]`);
      if (item.quantity > 1) {
        item.quantity--;
        if (item.comboQuantity > 0) {
          item.comboQuantity--;
          showToast(`Combo removido automaticamente de ${item.name}!`);
        }
      } else {
        cart.splice(itemIndex, 1);
        updateButtonState(button, false);
      }
      itemQuanty--;
      cartCount.textContent = itemQuanty;
      updateModal();
      updateCartTotal();
    }
  
    // Atualiza o estado do botão: se o item está no carrinho, deixa verde; senão, cinza
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
  
    // Verifica se o restaurante está aberto (baseado em horários configurados)
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
  
    // Valida os campos de endereço
    function validateAddress() {
      const fields = [
        { input: addressInputNome, name: "Nome Completo" },
        { input: addressInputRuaNumero, name: "Rua, Número" },
        { input: addressInputBairro, name: "Bairro" },
        { input: addressInputReferencia, name: "Referência" }
      ];
      let valid = true;
      fields.forEach(field => field.input.classList.remove("border-red-300"));
      fields.forEach(field => {
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
  
    // Cria a mensagem para o WhatsApp com os itens do carrinho e dados do pedido
    function createWhatsAppMessage() {
      let cartItemsText = "";
      let totalProducts = 0;
      let totalCombos = 0;
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalProducts += itemTotal;
        let itemText = `\n${item.name} - Quantidade: ${item.quantity} - Subtotal: R$${itemTotal.toFixed(2)}`;
        if (item.isCombo) {
          const comboTotal = item.comboQuantity * 12.90;
          totalCombos += comboTotal;
          itemText += `\nCombos: ${item.comboQuantity} - Total dos combos: R$${comboTotal.toFixed(2)}`;
        }
        cartItemsText += `${itemText}\n`;
      });
      const totalGeral = totalProducts + totalCombos;
      const additionalInfo = `\nDados do cliente:\nNome: ${addressInputNome.value}\nEndereço: ${addressInputRuaNumero.value}, ${addressInputBairro.value}\nReferência: ${addressInputReferencia.value}`;
      const message = `Olá, gostaria de fazer um pedido:\n\n${cartItemsText}\nTotal produtos: R$${totalProducts.toFixed(2)}\nTotal combos: R$${totalCombos.toFixed(2)}\nTotal geral: R$${totalGeral.toFixed(2)}${additionalInfo}`;
      return encodeURIComponent(message);
    }
  
    // Reseta o carrinho e atualiza a interface
    function resetCart() {
      cart = [];
      itemQuanty = 0;
      cartCount.textContent = itemQuanty;
      updateModal();
      updateCartTotal();
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
    /* --- Eventos --- */
  
    // Exibe o formulário de entrega
    addListeners(entregaBtn, ["click", "touchend"], () => {
      entregaForm.classList.remove("hidden");
    });
  
    // Exibe o modal do carrinho (footer)
    cartBtn.addEventListener("click", () => {
        cartModal.style.display = "flex";
      });
  
    // Fecha o modal ao clicar fora dele ou no botão "Fechar"
    cartModal.addEventListener("click", event => {
      if (event.target === cartModal) {
        cartModal.style.display = "none";
      }
    });
    addListeners(closeModal, ["click", "touchend"], () => {
      cartModal.style.display = "none";
    });
  
    // Handler único para adicionar produtos
   
    // Adiciona o handler para click e touchend (evitando duplicidade)
  // Adiciona o handler para adicionar produtos
  menu.addEventListener("click", event => {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (!parentButton) return;
    
    const name = parentButton.getAttribute("data-name");
    const priceAttr = parentButton.getAttribute("data-price");
    const price = parseFloat(priceAttr.replace('R$', '').replace(',', '.'));
    addToCart(name, price);
  });

  // Delegação de eventos para ações dentro do modal do carrinho
  cartItemsContainer.addEventListener("click", event => {
    const target = event.target;
    const itemName = target.dataset.name;
    if (target.classList.contains("remove-from-cart")) {
      removeItemCart(itemName);
    }
  });
  let isAddingToCart = false;
  function addToCart(name, price) {
    if (isAddingToCart) return; // Previne múltiplas adições
    isAddingToCart = true;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    itemQuanty++;
    cartCount.textContent = itemQuanty;
    updateModal();
    updateCartTotal();

    setTimeout(() => {
      isAddingToCart = false; // Reseta o estado após um pequeno atraso
    }, 300);
  }
  
    // Delegação de eventos para ações dentro do modal do carrinho
    cartItemsContainer.addEventListener("click", event => {
      const target = event.target;
      const itemName = target.dataset.name;
      if (target.classList.contains("remove-from-cart")) {
        removeItemCart(itemName);
      }
      if (target.classList.contains("add-combo")) {
        updateCombo(itemName, "add");
      }
      if (target.classList.contains("remove-combo")) {
        updateCombo(itemName, "remove");
      }
    });
  
    // Finaliza o pedido, valida os dados e reinicia o carrinho
    addListeners(checkoutBtn, ["click", "touchend"], () => {
      if (!checkRestauranteOpen()) {
        alert("fechado")
        showToast("⚠️ Ops, estamos fechados no momento!");
        
        return;
      }
      if (cart.length === 0) {
        showToast("⚠️ Ops, seu carrinho está vazio!");
        return;
      }
      if (pedidoTipo === "entrega" && !validateAddress()) {
        showToast("⚠️ Ops, preencha todos os campos!");
        return;
      }
      // Reseta a cor dos botões dos itens presentes no carrinho
      cart.forEach(item => {
        const button = document.querySelector(`[data-name="${item.name}"]`);
        if (button) updateButtonState(button, false);
      });
      const msg = createWhatsAppMessage();
      const phone = "31999918730";
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
      resetCart();
    });
  
    // Atualiza o status do restaurante na interface
    const spanItem = document.getElementById("date-span");
    const statusText = document.getElementById("status-text");
    if (checkRestauranteOpen()) {
      spanItem.classList.remove("bg-red-500");
      spanItem.classList.add("bg-green-600");
      statusText.textContent = "Estamos funcionando";
    } else {
      spanItem.classList.remove("bg-green-600");
      spanItem.classList.add("bg-red-500");
      statusText.textContent = "Estamos fechados";
    }
  });
  