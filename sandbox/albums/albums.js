import anime from "./anime.es.js";

const scrollElement = document.querySelector(".scroll");
const container = document.querySelector(".container_vertical");
const albums = container.querySelectorAll(".album");

let startScrollTop = scrollElement.scrollTop;
let d = 0;

var timer;
scrollElement.addEventListener("scroll", function () {
  d = scrollElement.scrollTop - startScrollTop;
  clearTimeout(timer);
  timer = setTimeout(refresh, 40);
});

var refresh = function () {
  anime({
    targets: albums,
    translateY: -scrollElement.scrollTop,
    delay: anime.stagger(1, { from: d < 0 ? "last" : "first" }), // increase delay by 100ms for each elements.
  });
  startScrollTop = scrollElement.scrollTop;
};
