const openModal = document.getElementById("open-modal-horarios");
const openModalMobile = document.getElementById("open-modal-horarios-mobile");
const mobileMenu = document.getElementById("mobile-menu");
const modalHorarios = document.getElementById("modal-horarios");
const menuButton = document.getElementById("menu-button");

openModal.addEventListener("click", () => {
    modalHorarios.classList.remove("hidden");
  });

openModalMobile.addEventListener("click", () => {
    modalHorarios.classList.remove("hidden");
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