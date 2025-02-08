import { servicesData } from './servicesData.js';

document.addEventListener('DOMContentLoaded', () => {
  const servicesContainer = document.getElementById('servicesContainer');
  const modal = document.getElementById('modal');
  const closeModalButtons = document.querySelectorAll('.closeModalButton');

  // Função para criar um card de serviço dinamicamente
  function createServiceCard(service, key) {
    const card = document.createElement('div');
    card.className = "inline-block w-[280px] min-w-[280px] flex-shrink-0 bg-white shadow-lg rounded-lg overflow-hidden";
    card.innerHTML = `
      <img class="w-full h-48 object-cover" src="${service.image}" alt="${service.title}" />
      <div class="p-4">
        <h2 class="text-xl font-bold text-blue-900">${service.title}</h2>
        <p class="text-gray-700 mt-2">${service.description}</p>
        <button class="openModalButton mt-4 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-700" data-service="${key}">
          Saiba mais
        </button>
      </div>
    `;
    return card;
  }

  // Renderiza os cards dinamicamente a partir do objeto servicesData
  Object.keys(servicesData).forEach(key => {
    const card = createServiceCard(servicesData[key], key);
    servicesContainer.appendChild(card);
  });

  // Atualiza o conteúdo do modal com os dados do serviço
  function updateModalContent(service) {
    if (!service) return;
    document.getElementById('modalTitle').textContent = service.title;
    document.getElementById('modalDescription').textContent = service.description;
    document.getElementById('modalPrice').textContent = `Preço: ${service.price}`;
    
    // Atualiza a lista de funcionalidades
    const functionalitiesList = document.getElementById('modalFunctionalities');
    functionalitiesList.innerHTML = '';
    service.functionalities.forEach(func => {
      const li = document.createElement('li');
      li.textContent = func;
      functionalitiesList.appendChild(li);
    });

    // Atualiza a imagem do modal
    document.getElementById('modalImage').setAttribute('src', service.image);
  }

  // Função para abrir o modal e atualizar o conteúdo
  function openModal(serviceKey) {
    const service = servicesData[serviceKey];
    if (service) {
      updateModalContent(service);
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
    }
  }

  // Função para fechar o modal
  function closeModal() {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
  }

  // Utiliza event delegation para capturar os cliques nos botões "Saiba mais"
  servicesContainer.addEventListener('click', (event) => {
    if (event.target && event.target.matches('.openModalButton')) {
      const serviceKey = event.target.getAttribute('data-service');
      openModal(serviceKey);
    }
  });

  // Adiciona listener para fechar o modal em todos os botões com a classe .closeModalButton
  closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // (Opcional) Fecha o modal ao clicar fora do conteúdo (na área escura)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});
