document.addEventListener('DOMContentLoaded', () => {
    const openModalButtons = document.querySelectorAll('.openModalButton');
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('closeModalButton');
  
    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
      });
    });
  
    closeModalButton.addEventListener('click', () => {
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0', 'pointer-events-none');
    });
  });
  