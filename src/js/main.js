

(function () {
    /*  CARROUSEL */
    'use strict';

    var activeClass = 'est-actif';

    function carrousel() {

        this.config = {
            carrouselId: 'carrousel-home-recrutement',
            carrouselItemClass: 'js-item',
            carrouselNextClass: 'js-next',
            carrouselPrevClass: 'js-prev',
            bulletClass: 'js-bullet',
            loopDuration: 5000
        };

        this.current;
        this.interval;
        this.container = document.getElementById(this.config.carrouselId);
        this.items = this.container.getElementsByClassName(this.config.carrouselItemClass);
        this.bullets = this.container.getElementsByClassName(this.config.bulletClass);
        this.active = this.container.getElementsByClassName(activeClass);

        this.goto(0);
        this.handleEvent();
    };

    carrousel.prototype.next = function () {
        this.goto(this.current + 1);
    };

    carrousel.prototype.prev = function () {
        this.goto(this.current - 1);
    };

    carrousel.prototype.updateDom = function () {
        Array.prototype.slice.call(this.active).forEach(function (el) {
            el.classList.remove(activeClass);
        });

        this.items[this.current].classList.add(activeClass);
        this.bullets[this.current].classList.add(activeClass);
    };

    carrousel.prototype.goto = function (x) {
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

    carrousel.prototype.handleEvent = function () {
        this.container.addEventListener('click', function(e) {
            var targetClassList = e.target.classList;

            if (targetClassList.contains(this.config.carrouselNextClass)) {
                e.preventDefault();
                this.next();
            } else if (targetClassList.contains(this.config.carrouselPrevClass)) {
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

    /* POPIN */
    function popin(handler, targetId) {

        this.popin = document.getElementById(targetId);
        this.handler = handler;

        this.handler.addEventListener('click', function(e) {
            e.preventDefault();
            togglePopin(this);
        }.bind(this));

        this.popin.addEventListener('click', function(e) {
            var targetClassList = e.target.classList;
            if (targetClassList.contains('js-popin-close')) {
                e.preventDefault();
                togglePopin(this);
            }
        }.bind(this));

        function togglePopin(instance) {
            instance.popin.classList.toggle('est-visible');
        };
    };


    function instanciatePopins() {
        var handlers = document.getElementsByClassName('js-popin-luncher');

        Array.prototype.slice.call(handlers).forEach(function(el) {
            var targetId = el.getAttribute('data-popin-id');
            new popin(el, targetId);
        });
    }

    /* MENU BURGER */
    function burgerMenu(){

        var menuContainer = document.getElementById('js-menu-container');

        if( menuContainer != null ) {
            var burger = document.getElementById('js-menu');
            var overlay = document.getElementById('js-overlay');
            listenner();
        }

        function listenner() {
            menuContainer.addEventListener('click', function(e){
                e.preventDefault();
                var targetClassList = e.target.classList;

                if (targetClassList.contains('js-toggle-menu')) {
                    toggleMenu();
                }
            });
        }

        function toggleMenu() {
            burger.classList.toggle('est-ouvert');
            overlay.classList.toggle('est-ouvert');
        };
    };

    document.addEventListener("DOMContentLoaded", function() {
        burgerMenu();
        instanciatePopins();
    });
}());
