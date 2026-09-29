/* ========================================
   SYDNEY ROLEPLAY
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ========================================
           MOBILE NAVIGATION
        ======================================== */

        const menuButton =
            document.getElementById(
                "menuButton"
            );

        const navLinks =
            document.getElementById(
                "navLinks"
            );


        if (menuButton && navLinks) {

            menuButton.addEventListener(
                "click",
                () => {

                    navLinks.classList.toggle(
                        "open"
                    );

                }
            );


            navLinks
                .querySelectorAll("a")
                .forEach((link) => {

                    link.addEventListener(
                        "click",
                        () => {

                            navLinks.classList.remove(
                                "open"
                            );

                        }
                    );

                });

        }



        /* ========================================
           NAVBAR SCROLL
        ======================================== */

        const navbar =
            document.querySelector(
                ".navbar"
            );


        window.addEventListener(
            "scroll",
            () => {

                if (!navbar) return;


                if (window.scrollY > 30) {

                    navbar.style.background =
                        "rgba(3, 8, 5, 0.96)";

                } else {

                    navbar.style.background =
                        "rgba(4, 9, 6, 0.75)";

                }

            }
        );



        /* ========================================
           SCROLL REVEAL
        ======================================== */

        document.body.classList.add(
            "reveal-ready"
        );


        const revealElements =
            document.querySelectorAll(
                ".reveal"
            );


        if (
            "IntersectionObserver"
            in window
        ) {

            const observer =
                new IntersectionObserver(

                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target
                                        .classList
                                        .add(
                                            "visible"
                                        );

                                    observer
                                        .unobserve(
                                            entry.target
                                        );

                                }

                            }
                        );

                    },

                    {
                        threshold: 0.12
                    }

                );


            revealElements.forEach(
                (element) => {

                    observer.observe(
                        element
                    );

                }
            );

        } else {

            revealElements.forEach(
                (element) => {

                    element.classList.add(
                        "visible"
                    );

                }
            );

        }

    }
);