/* ========================================
   SYDNEY ROLEPLAY
   MEMBER DASHBOARD
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const players =
            document.getElementById(
                "dashboardPlayers"
            );

        const staff =
            document.getElementById(
                "dashboardStaff"
            );

        const status =
            document.getElementById(
                "dashboardServerStatus"
            );


        async function loadServer() {

            try {

                const response =
                    await fetch(
                        "/api/server",
                        {
                            cache:
                                "no-store"
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        "Server unavailable"
                    );

                }


                players.textContent =
                    `${data.currentPlayers} / ${data.maxPlayers}`;


                staff.textContent =
                    data.staff;


                status.textContent =
                    "ONLINE";


                status.classList.add(
                    "online"
                );


            } catch (error) {

                console.error(
                    "Dashboard Server Error:",
                    error
                );


                players.textContent =
                    "--";

                staff.textContent =
                    "--";

                status.textContent =
                    "UNAVAILABLE";


                status.classList.remove(
                    "online"
                );

            }

        }


        loadServer();


        setInterval(
            loadServer,
            30000
        );

    }
);