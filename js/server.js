/* ========================================
   SYDNEY ROLEPLAY
   LIVE ER:LC SERVER
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const playerCount =
            document.getElementById(
                "playerCount"
            );

        const queueCount =
            document.getElementById(
                "queueCount"
            );

        const staffCount =
            document.getElementById(
                "staffCount"
            );

        const serverCapacity =
            document.getElementById(
                "serverCapacity"
            );

        const serverStatus =
            document.getElementById(
                "serverStatus"
            );

        const serverStatusBadge =
            document.getElementById(
                "serverStatusBadge"
            );

        const playerList =
            document.getElementById(
                "playerList"
            );

        const playerSearch =
            document.getElementById(
                "playerSearch"
            );


        let players = [];


        /* ========================================
           LOAD SERVER
        ======================================== */

        async function loadServer() {

            try {

                const response =
                    await fetch(
                        "/api/server"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Unable to load server."
                    );

                }


                players =
                    data.players || [];


                updateStatus(
                    data.online
                );


                updateStats(
                    data
                );


                displayPlayers(
                    players
                );


            } catch (error) {

                console.error(
                    "Live Server Error:",
                    error
                );


                showOffline();

            }

        }



        /* ========================================
           SERVER STATUS
        ======================================== */

        function updateStatus(online) {

            serverStatusBadge
                .classList
                .remove(
                    "online",
                    "offline"
                );


            if (online) {

                serverStatus.textContent =
                    "Server Online";

                serverStatusBadge
                    .classList
                    .add("online");

            } else {

                serverStatus.textContent =
                    "Server Offline";

                serverStatusBadge
                    .classList
                    .add("offline");

            }

        }



        /* ========================================
           STATISTICS
        ======================================== */

        function updateStats(data) {

            playerCount.textContent =
                `${data.currentPlayers} / ${data.maxPlayers}`;


            queueCount.textContent =
                data.queue ?? 0;


            staffCount.textContent =
                data.staff ?? 0;


            serverCapacity.textContent =
                data.maxPlayers ?? "--";

        }



        /* ========================================
           PLAYER LIST
        ======================================== */

        function displayPlayers(
            playerArray
        ) {

            playerList.innerHTML = "";


            if (
                !playerArray ||
                playerArray.length === 0
            ) {

                playerList.innerHTML = `

                    <div class="no-players">

                        <span>○</span>

                        <h3>
                            No players online
                        </h3>

                        <p>
                            There are currently no
                            players in the server.
                        </p>

                    </div>

                `;

                return;

            }


            playerArray.forEach(
                player => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "player-row";


                    const initial =
                        (
                            player.username ||
                            "?"
                        )
                        .charAt(0)
                        .toUpperCase();


                    row.innerHTML = `

                        <div class="player-name">

                            <div
                                class="player-avatar"
                            >
                                ${escapeHTML(initial)}
                            </div>


                            <div>

                                <strong>
                                    ${escapeHTML(
                                        player.username
                                    )}
                                </strong>


                                ${
                                    player.staff

                                    ? `

                                    <span
                                        class="staff-tag"
                                    >
                                        STAFF
                                    </span>

                                    `

                                    : ""
                                }

                            </div>

                        </div>


                        <div
                            class="player-team"
                        >
                            ${escapeHTML(
                                player.team
                            )}
                        </div>


                        <div
                            class="player-callsign"
                        >
                            ${escapeHTML(
                                player.callsign
                            )}
                        </div>

                    `;


                    playerList.appendChild(
                        row
                    );

                }
            );

        }



        /* ========================================
           SEARCH
        ======================================== */

        if (playerSearch) {

            playerSearch.addEventListener(
                "input",
                () => {

                    const search =
                        playerSearch
                            .value
                            .toLowerCase()
                            .trim();


                    const filtered =
                        players.filter(
                            player => {

                                return (

                                    player.username
                                        .toLowerCase()
                                        .includes(
                                            search
                                        )

                                    ||

                                    player.team
                                        .toLowerCase()
                                        .includes(
                                            search
                                        )

                                    ||

                                    player.callsign
                                        .toLowerCase()
                                        .includes(
                                            search
                                        )

                                );

                            }
                        );


                    displayPlayers(
                        filtered
                    );

                }
            );

        }



        /* ========================================
           OFFLINE / ERROR
        ======================================== */

        function showOffline() {

            updateStatus(false);


            playerCount.textContent =
                "--";

            queueCount.textContent =
                "--";

            staffCount.textContent =
                "--";

            serverCapacity.textContent =
                "--";


            playerList.innerHTML = `

                <div class="no-players">

                    <span>!</span>

                    <h3>
                        Server information unavailable
                    </h3>

                    <p>
                        We couldn't retrieve the live
                        server information right now.
                    </p>

                </div>

            `;

        }



        /* ========================================
           SECURITY
        ======================================== */

        function escapeHTML(value) {

            const element =
                document.createElement(
                    "div"
                );


            element.textContent =
                value ?? "";


            return element.innerHTML;

        }



        /* ========================================
           START
        ======================================== */

        loadServer();


        /*
            Refresh every 30 seconds.

            Don't make this extremely fast because
            the ER:LC API has rate limits.
        */

        setInterval(
            loadServer,
            30000
        );

    }
);