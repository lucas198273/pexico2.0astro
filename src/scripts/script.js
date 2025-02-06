import { servicesData } from './servicesData.js';

document.addEventListener('DOMContentLoaded', () => {
  const openModalButtons = document.querySelectorAll('.openModalButton');
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('closeModalButton');
  const closeModalButtonalt = document.getElementById('closeModalButtonAlt');


  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Obtém a chave do serviço a partir do atributo data-service
      const serviceKey = button.getAttribute('data-service');
      const service = servicesData[serviceKey];

      if (service) {
        document.getElementById('modalTitle').textContent = service.title;
        document.getElementById('modalDescription').textContent = service.description;
        document.getElementById('modalPrice').textContent = `Preço: ${service.price}`;

        // Atualiza a lista de funcionalidades
        const functionalitiesList = document.getElementById('modalFunctionalities');
        functionalitiesList.innerHTML = ''; // Limpa o conteúdo anterior
        service.functionalities.forEach(func => {
          const li = document.createElement('li');
          li.textContent = func;
          functionalitiesList.appendChild(li);
        });

        // Atualiza a imagem de descrição
        document.getElementById('modalImage').setAttribute('src', service.image);
      }

      // Exibe o modal
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
    });
  });

  closeModalButton.addEventListener('click', () => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
  });  
  closeModalButtonalt.addEventListener('click', () => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
  });

});
