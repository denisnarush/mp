let container = document.querySelector(".container");
let w = container.clientWidth;
let d = (container.scrollWidth -w) / 100;
let cw = 50;

container.scrollTo((container.scrollWidth - w) / 2, 0);

console.log(w - container.childElementCount * cw);
console.log(Math.ceil((w - container.childElementCount * cw) / cw));

container.addEventListener("scroll", (e) => {
    console.log(e.target.scrollLeft / d);
});