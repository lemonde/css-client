var burger = document.getElementById('js-menu');
var popin = document.getElementById('js-popin');
var overlay = document.getElementById('js-overlay');

function toggleBurger() {
    burger.classList.toggle('est-ouvert');
    overlay.classList.toggle('est-ouvert');
}

function togglePopin() {
    popin.classList.toggle('est-visible');
}
