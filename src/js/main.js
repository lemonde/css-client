(function () {
    /*  CARROUSEL */
    'use strict';

    var activeClass = 'est-actif';

    function Carrousel() {

        this.config = {
            CarrouselId: 'carrousel-home-recrutement',
            CarrouselItemClass: 'js-item',
            CarrouselNextClass: 'js-next',
            CarrouselPrevClass: 'js-prev',
            bulletClass: 'js-bullet',
            loopDuration: 5000
        };

        this.current;
        this.interval;
        this.container = document.getElementById(this.config.CarrouselId);
        this.items = this.container.getElementsByClassName(this.config.CarrouselItemClass);
        this.bullets = this.container.getElementsByClassName(this.config.bulletClass);
        this.active = this.container.getElementsByClassName(activeClass);

        this.goto(0);
        this.handleEvent();
    };

    Carrousel.prototype.next = function () {
        this.goto(this.current + 1);
    };

    Carrousel.prototype.prev = function () {
        this.goto(this.current - 1);
    };

    Carrousel.prototype.updateDom = function () {
        Array.prototype.slice.call(this.active).forEach(function (el) {
            el.classList.remove(activeClass);
        });

        this.items[this.current].classList.add(activeClass);
        this.bullets[this.current].classList.add(activeClass);
    };

    Carrousel.prototype.goto = function (x) {

        clearTimeout(this.interval);
        this.interval = setTimeout(this.next.bind(this), this.config.loopDuration);

        if (x === this.bullets.length) {
            this.current = 0;
        } else if (x < 0) {
            this.current = this.bullets.length -1;
        } else {
            this.current = x;
        }

        this.updateDom();
    };

    Carrousel.prototype.handleEvent = function () {
        this.container.addEventListener('click', function(e) {
            var targetClassList = e.target.classList;

            if (targetClassList.contains(this.config.CarrouselNextClass)) {
                e.preventDefault();
                this.next();
            } else if (targetClassList.contains(this.config.CarrouselPrevClass)) {
                e.preventDefault();
                this.prev();
            } else if (targetClassList.contains(this.config.bulletClass)) {
                e.preventDefault();
                Array.prototype.slice.call(this.bullets).forEach(function (el, idx) {
                    if(el === e.target) {
                        this.goto(idx);
                    }
                }.bind(this));
            };
        }.bind(this));
    };

    function instantiateCarrousel() {
        var CarrouselExist = document.getElementById('carrousel-home-recrutement');
        if (CarrouselExist !== null) {
            new Carrousel();
        }
    }

    /* POPIN */
    function popin(handler, targetId) {
        var popin = document.getElementById(targetId);

        handler.addEventListener('click', function(event) {
            togglePopin(event);
        });

        popin.addEventListener('click', function(event) {
            if (event.target.classList.contains('js-popin-close')) {
                togglePopin(event);
            }
        });

        function togglePopin(event) {
            event.preventDefault();
            popin.classList.toggle('est-visible');
        };
    }

    function instantiatePopins() {
        var handlers = document.getElementsByClassName('js-popin-launcher');
        Array.prototype.slice.call(handlers).forEach(function(el) {
            var targetId = el.getAttribute('data-popin-id');
            popin(el, targetId);
        });
    }

    /* MENU BURGER */
    function burgerMenu(){
        var menuContainer = document.getElementById('js-menu-container');

        if (menuContainer === null) {
            return;
        }

        menuContainer.addEventListener('click', function(event) {

            if (event.target.classList.contains('js-toggle-menu')) {
                event.preventDefault();
                menuContainer.classList.toggle('est-menu-ouvert');
            }
        });
    }

    /* Autoscroll Panier (tunnel) */
    function instantiateScrollPanier() {

        var viewportX = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var notLargeDevice = 1023;

        if(viewportX < notLargeDevice) {
            return;
        }

        var panier = document.getElementById('js-panier');

        if (panier === null) {
            return;
        }

        // element with witch we compare the height to get maximum margi-top
        var maxHeightElement = document.getElementById('js-max-height-col');
        var maxMargin, timeout, margin;

        var debounce = function () {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {
                maxMargin = Math.max(0, (maxHeightElement.offsetHeight - panier.offsetHeight));
                margin = Math.min(window.pageYOffset, maxMargin);
                panier.style.marginTop = margin + 'px';
                timeout = null;
            }, 100);
        };

        window.addEventListener('scroll', debounce);
    }

    /* selection d'une offre */
    function formuleSelector(selectorContainer) {
        var selected = selectorContainer.getElementsByClassName('est-selectionne');
        var inputs = selectorContainer.getElementsByTagName("input");
        var selectChoices = selectorContainer.getElementsByClassName('js-select-choice');


        Array.prototype.slice.call(inputs).forEach(function(input, idx) {
            input.addEventListener('change', function(event) {
                if(selected.length) {
                    selected[0].classList.remove('est-selectionne');
                }
                selectChoices[idx].classList.add('est-selectionne');
            });
        });
    }

    function instantiateFormuleSelector() {
        var selectorContainer = document.getElementById('js-select-duration');

        if (!selectorContainer) {
            return;
        }

        formuleSelector(selectorContainer);
    }

    document.addEventListener("DOMContentLoaded", function() {
        burgerMenu();
        instantiatePopins();
        instantiateCarrousel();
        instantiateScrollPanier();
        instantiateFormuleSelector();
    });

}());
