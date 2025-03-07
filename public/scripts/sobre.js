
const openModalMobile = document.getElementById("open-modal-horarios-mobile");
const mobileMenu = document.getElementById("mobile-menu");

const menuButton = document.getElementById("menu-button");




  
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  const mobileMenuItems = mobileMenu.querySelectorAll("a, button");
  mobileMenuItems.forEach(item => {
    item.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });