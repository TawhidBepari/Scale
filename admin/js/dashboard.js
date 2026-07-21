const admin = localStorage.getItem("scale_admin");

if(!admin){

  window.location.href = "/admin/login.html";

}

document.getElementById("logoutBtn").onclick = () => {

  localStorage.removeItem("scale_admin");

  window.location.href = "/admin/login.html";

};

const menuButtons =
  document.querySelectorAll(".menu button");

const sections =
  document.querySelectorAll(".section");

menuButtons.forEach(button => {

  button.onclick = () => {

    const target = button.dataset.section;

    sections.forEach(section => {
      section.classList.remove("active");
    });

    document
      .getElementById(target)
      .classList.add("active");

  };

});

loadServices();

loadBonusServiceOptions();

loadBonuses();

loadReviews();

loadPaymentRequests();
