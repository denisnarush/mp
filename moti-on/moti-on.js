import "./../modules/moti-on.js";

function activeToggle (e) {
    e.target.classList.toggle("active");
}

function activeToggleAndRemove (e) {
    activeToggle(e);
    e.target.textContent = "Removed";

    let action = e.constructor.name.replace("Event", "").toLowerCase();
    e.target.doOff(action, activeToggleAndRemove);
}

function textToggle (e) {
    let action = e.constructor.name.replace("Event", "");
    e.target.textContent = (e.target.textContent === action ? action + " +": action);
}

// 1.1
document.querySelector(".one_one").doOn("tap", activeToggle);
// 1.2
document.querySelector(".one_two").doOn("tap", activeToggle);
document.querySelector(".one_two").doOn("tap", textToggle);
// 1.3
document.querySelector(".one_three").doOn("tap", activeToggleAndRemove);

// 2.1
document.querySelector(".two_one").doOn("hold", activeToggle);
// 2.2
document.querySelector(".two_two").doOn("hold", activeToggle);
document.querySelector(".two_two").doOn("hold", textToggle);
// 2.3
document.querySelector(".two_three").doOn("hold", activeToggleAndRemove);