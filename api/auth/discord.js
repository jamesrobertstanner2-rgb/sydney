document.addEventListener("DOMContentLoaded", () => {

    console.log("Discord dashboard script loaded.");

    const params = new URLSearchParams(window.location.search);
    const encodedDiscord = params.get("discord");

    console.log("Discord data received:", encodedDiscord);

    if (!encodedDiscord) {
        console.error("No Discord data was provided to the dashboard.");
        return;
    }

    try {

        let base64 = encodedDiscord
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        while (base64.length % 4) {
            base64 += "=";
        }

        const decodedText = atob(base64);
        const user = JSON.parse(decodedText);

        console.log("Logged in Discord user:", user);

        const displayName =
            user.globalName ||
            user.username ||
            "Discord User";

        /* ================================
           USERNAME
        ================================ */

        const dashboardUsername =
            document.getElementById("dashboardUsername");

        if (dashboardUsername) {
            dashboardUsername.textContent = displayName;
        }


        const welcomeUsername =
            document.getElementById("welcomeUsername");

        if (welcomeUsername) {
            welcomeUsername.textContent = displayName;
        }


        /* ================================
           DISCORD CARD
        ================================ */

        document
            .querySelectorAll(".dashboard-account-info strong")
            .forEach(element => {
                element.textContent = user.username;
            });


        /* ================================
           PROFILE
        ================================ */

        document
            .querySelectorAll(".dashboard-profile-details")
            .forEach(section => {

                const label = section.querySelector("p");
                const value = section.querySelector("strong");

                if (!label || !value) return;

                if (
                    label.textContent
                        .trim()
                        .toUpperCase() === "DISCORD USERNAME"
                ) {
                    value.textContent = user.username;
                }

            });


        /* ================================
           AVATAR
        ================================ */

        const avatarElements =
            document.querySelectorAll(
                ".dashboard-avatar, " +
                ".dashboard-mini-avatar, " +
                ".dashboard-profile-avatar"
            );


        if (user.avatar && user.id) {

            const avatarURL =
                `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;

            avatarElements.forEach(element => {

                const img = document.createElement("img");

                img.src = avatarURL;
                img.alt = displayName;

                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.style.borderRadius = "inherit";

                element.innerHTML = "";
                element.appendChild(img);

            });

        } else {

            const initial =
                displayName.charAt(0).toUpperCase();

            avatarElements.forEach(element => {
                element.textContent = initial;
            });

        }

        console.log("Discord dashboard updated successfully.");

    } catch (error) {

        console.error(
            "Discord dashboard error:",
            error
        );

    }

});