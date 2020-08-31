document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".videocover").forEach((elem) => {
    elem.onmouseover = function () {
      document.querySelector(`#caption${elem.id}`).innerHTML = "Enter";
      document.querySelector(`#caption${elem.id}`).style.backgroundColor =
        "black";
    };
    elem.onmouseout = function () {
      otxt = elem.getAttribute("data-value");
      document.querySelector(`#caption${elem.id}`).innerHTML = otxt;
      document.querySelector(`#caption${elem.id}`).style.color = "white";
      document.querySelector(`#caption${elem.id}`).style.backgroundColor =
        "transparent";
    };
  });
});
