/* ========================================
   SYDNEY ROLEPLAY
   DISCORD USER DISPLAY
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const params =
        new URLSearchParams(window.location.search);

    const encodedDiscord =
        params.get("discord");


    console.log(
        "Discord login data:",
        encodedDiscord
    );


    if (!encodedDiscord) {

        console.log(
            "No Discord user information found."
        );

        return;
    }


    try {

        /* ========================================
           DECODE USER
        ======================================== */

        let base64 =
            encodedDiscord
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        while (base64.length % 4) {
            base64 += "=";
        }


        const user =
            JSON.parse(
                decodeURIComponent(
                    Array.prototype.map
                        .call(
                            atob(base64),
                            character =>
                                "%" +
                                character
                                    .charCodeAt(0)
                                    .toString(16)
                                    .padStart(2, "0")
                        )
                        .join("")
                )
            );


        console.log(
            "Discord user:",
            user
        );


        const displayName =
            user.globalName ||
            user.username ||
            "Discord User";


        /* ========================================
           TOP-RIGHT ACCOUNT
        ======================================== */

        const dashboardUsername =
            document.getElementById(
                "dashboardUsername"
            );


        if (dashboardUsername) {

            dashboardUsername.textContent =
                displayName;

        }


        /* ========================================
           WELCOME MESSAGE
        ======================================== */

        const welcomeUsername =
            document.getElementById(
                "welcomeUsername"
            );


        if (welcomeUsername) {

            welcomeUsername.textContent =
                displayName;

        }


        /* ========================================
           DISCORD CARD
        ======================================== */

        document
            .querySelectorAll(
                ".dashboard-account-info strong"
            )
            .forEach(element => {

                element.textContent =
                    user.username;

            });


        /* ========================================
           PROFILE USERNAME
        ======================================== */

        const profileDetails =
            document.querySelectorAll(
                ".dashboard-profile-details"
            );


        profileDetails.forEach(section => {

            const label =
                section.querySelector("p");

            const value =
                section.querySelector("strong");


            if (
                label &&
                value &&
                label.textContent
                    .trim()
                    .toUpperCase() ===
                    "DISCORD USERNAME"
            ) {

                value.textContent =
                    user.username;

            }

        });


        /* ========================================
           AVATAR
        ======================================== */

        if (
            user.avatar &&
            user.id
        ) {

            const avatarURL =
                `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;


            document
                .querySelectorAll(
                    ".dashboard-avatar, .dashboard-mini-avatar, .dashboard-profile-avatar"
                )
                .forEach(avatar => {

                    avatar.innerHTML = "";


                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        avatarURL;

                    image.alt =
                        displayName;


                    image.style.width =
                        "100%";

                    image.style.height =
                        "100%";

                    image.style.objectFit =
                        "cover";

                    image.style.borderRadius =
                        "inherit";


                    avatar.appendChild(
                        image
                    );

                });

        } else {

            const initial =
                displayName
                    .charAt(0)
                    .toUpperCase();


            document
                .querySelectorAll(
                    ".dashboard-avatar, .dashboard-mini-avatar, .dashboard-profile-avatar"
                )
                .forEach(avatar => {

                    avatar.textContent =
                        initial;

                });

        }


        /* ========================================
           CLEAN URL

           Removes the Discord data from the
           address bar after we've read it.
        ======================================== */

        window.history.replaceState(
            {},
            document.title,
            "/dashboard.html"
        );


    } catch (error) {

        console.error(
            "Failed to load Discord account:",
            error
        );

    }

});