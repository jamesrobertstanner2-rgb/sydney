/* ========================================
   SYDNEY ROLEPLAY
   LIVE SERVER V2
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       ELEMENTS
    ======================================== */

    const serverName =
        document.getElementById("serverName");

    const serverStatus =
        document.getElementById("serverStatus");

    const serverStatusBadge =
        document.getElementById("serverStatusBadge");

    const playerCount =
        document.getElementById("playerCount");

    const queueCount =
        document.getElementById("queueCount");

    const staffCount =
        document.getElementById("staffCount");

    const serverCapacity =
        document.getElementById("serverCapacity");

    const capacityText =
        document.getElementById("capacityText");

    const capacityPercent =
        document.getElementById("capacityPercent");

    const capacityFill =
        document.getElementById("capacityFill");

    const lastUpdated =
        document.getElementById("lastUpdated");

    const playerSummary =
        document.getElementById("playerSummary");

    const playerList =
        document.getElementById("playerList");

    const playerSearch =
        document.getElementById("playerSearch");

    const teamFilter =
        document.getElementById("teamFilter");

    const staffFilter =
        document.getElementById("staffFilter");

    const refreshButton =
        document.getElementById("refreshServer");

    const refreshIcon =
        document.getElementById("refreshIcon");


    /* ========================================
       STATE
    ======================================== */

    let players = [];

    let currentTeam = "all";

    let staffOnly = false;

    let loading = false;


    /* ========================================
       LOAD SERVER
    ======================================== */

    async function loadServer() {

        if (loading) {
            return;
        }


        loading = true;

        setRefreshLoading(true);


        try {

            const response =
                await fetch(
                    "/api/server",
                    {
                        cache: "no-store"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Unable to retrieve server."
                );

            }


            players =
                Array.isArray(data.players)
                    ? data.players
                    : [];


            updateServer(data);

            buildTeamFilter();

            applyFilters();

            setOnline(true);

            updateTimestamp();


        } catch (error) {

            console.error(
                "Sydney Roleplay Live Server Error:",
                error
            );


            showError();

        } finally {

            loading = false;

            setRefreshLoading(false);

        }

    }


    /* ========================================
       UPDATE SERVER
    ======================================== */

    function updateServer(data) {

        if (serverName) {

            serverName.textContent =
                data.name ||
                "Sydney Roleplay";

        }


        const current =
            Number(
                data.currentPlayers ??
                players.length
            );


        const maximum =
            Number(
                data.maxPlayers ??
                50
            );


        const queue =
            Number(
                data.queue ??
                0
            );


        const staff =
            Number(
                data.staff ??
                0
            );


        playerCount.textContent =
            `${current} / ${maximum}`;


        queueCount.textContent =
            queue;


        staffCount.textContent =
            staff;


        serverCapacity.textContent =
            maximum;


        capacityText.textContent =
            `${current} of ${maximum} slots occupied`;


        const percent =
            maximum > 0
                ? Math.min(
                    Math.round(
                        (current / maximum) * 100
                    ),
                    100
                )
                : 0;


        capacityPercent.textContent =
            `${percent}%`;


        capacityFill.style.width =
            `${percent}%`;


        playerSummary.textContent =

            current === 1

                ? "1 player currently online"

                : `${current} players currently online`;

    }


    /* ========================================
       ONLINE / OFFLINE
    ======================================== */

    function setOnline(online) {

        serverStatusBadge.classList.remove(
            "online",
            "offline"
        );


        if (online) {

            serverStatus.textContent =
                "Server Online";

            serverStatusBadge.classList.add(
                "online"
            );

        } else {

            serverStatus.textContent =
                "Server Unavailable";

            serverStatusBadge.classList.add(
                "offline"
            );

        }

    }


    /* ========================================
       PLAYER DISPLAY
    ======================================== */

    function displayPlayers(playerArray) {

        playerList.innerHTML = "";


        if (playerArray.length === 0) {

            playerList.innerHTML = `

                <div class="server-v2-empty">

                    <div class="empty-player-icon">
                        ○
                    </div>

                    <h3>
                        No players found
                    </h3>

                    <p>
                        No online players match
                        the selected filters.
                    </p>

                </div>

            `;

            return;

        }


        playerArray.forEach((player) => {

            const username =
                player.username ||
                "Unknown Player";


            const team =
                player.team ||
                "Unknown";


            const callsign =
                player.callsign ||
                "—";


            const permission =
                player.permission ||
                "Normal";


            const row =
                document.createElement("div");


            row.className =
                "player-row-v2";


            row.innerHTML = `

                <div class="player-v2-user">

                    <div class="player-v2-avatar">

                        ${escapeHTML(
                            username
                                .charAt(0)
                                .toUpperCase()
                        )}

                    </div>


                    <div class="player-v2-name">

                        <strong>
                            ${escapeHTML(username)}
                        </strong>

                        ${
                            player.staff

                            ? `
                                <span class="player-online-dot">
                                    STAFF
                                </span>
                              `

                            : `
                                <span class="player-member-text">
                                    PLAYER
                                </span>
                              `
                        }

                    </div>

                </div>


                <div>

                    <span
                        class="team-badge
                        ${getTeamClass(team)}"
                    >
                        ${escapeHTML(team)}
                    </span>

                </div>


                <div class="player-v2-callsign">

                    ${escapeHTML(callsign)}

                </div>


                <div>

                    ${createPermissionBadge(
                        permission
                    )}

                </div>

            `;


            playerList.appendChild(row);

        });

    }


    /* ========================================
       PERMISSION BADGES
    ======================================== */

    function createPermissionBadge(permission) {

        const value =
            String(
                permission ||
                "Normal"
            );


        const lower =
            value.toLowerCase();


        let badgeClass =
            "permission-member";


        if (
            lower.includes("owner")
        ) {

            badgeClass =
                "permission-owner";

        } else if (
            lower.includes("admin")
        ) {

            badgeClass =
                "permission-admin";

        } else if (
            lower.includes("moderator") ||
            lower.includes("mod")
        ) {

            badgeClass =
                "permission-moderator";

        } else if (
            lower.includes("staff")
        ) {

            badgeClass =
                "permission-staff";

        }


        const displayPermission =

            lower === "normal"

                ? "Member"

                : value;


        return `

            <span
                class="permission-badge
                ${badgeClass}"
            >
                ${escapeHTML(
                    displayPermission
                )}
            </span>

        `;

    }


    /* ========================================
       TEAM COLOURS
    ======================================== */

    function getTeamClass(team) {

        const value =
            String(team)
                .toLowerCase();


        if (
            value.includes("police")
        ) {

            return "team-police";

        }


        if (
            value.includes("sheriff")
        ) {

            return "team-police";

        }


        if (
            value.includes("fire") ||
            value.includes("ambulance") ||
            value.includes("ems")
        ) {

            return "team-medical";

        }


        if (
            value.includes("transport") ||
            value.includes("dot")
        ) {

            return "team-dot";

        }


        if (
            value.includes("civilian")
        ) {

            return "team-civilian";

        }


        return "team-other";

    }


    /* ========================================
       BUILD TEAM FILTER
    ======================================== */

    function buildTeamFilter() {

        const previous =
            currentTeam;


        const teams = [

            ...new Set(

                players

                    .map(
                        player =>
                            player.team
                    )

                    .filter(Boolean)

            )

        ].sort();


        teamFilter.innerHTML = `

            <option value="all">
                All Teams
            </option>

        `;


        teams.forEach((team) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                team;


            option.textContent =
                team;


            teamFilter.appendChild(
                option
            );

        });


        if (
            teams.includes(previous)
        ) {

            teamFilter.value =
                previous;

        } else {

            currentTeam =
                "all";

            teamFilter.value =
                "all";

        }

    }


    /* ========================================
       FILTER PLAYERS
    ======================================== */

    function applyFilters() {

        const search =
            playerSearch.value
                .toLowerCase()
                .trim();


        const filtered =
            players.filter((player) => {

                const username =
                    String(
                        player.username ||
                        ""
                    ).toLowerCase();


                const team =
                    String(
                        player.team ||
                        ""
                    ).toLowerCase();


                const callsign =
                    String(
                        player.callsign ||
                        ""
                    ).toLowerCase();


                const permission =
                    String(
                        player.permission ||
                        ""
                    ).toLowerCase();


                const matchesSearch =

                    username.includes(search) ||

                    team.includes(search) ||

                    callsign.includes(search) ||

                    permission.includes(search);


                const matchesTeam =

                    currentTeam === "all" ||

                    player.team ===
                    currentTeam;


                const matchesStaff =

                    !staffOnly ||

                    player.staff === true;


                return (

                    matchesSearch &&
                    matchesTeam &&
                    matchesStaff

                );

            });


        displayPlayers(filtered);

    }


    /* ========================================
       SEARCH
    ======================================== */

    playerSearch.addEventListener(
        "input",
        applyFilters
    );


    /* ========================================
       TEAM FILTER
    ======================================== */

    teamFilter.addEventListener(
        "change",
        () => {

            currentTeam =
                teamFilter.value;

            applyFilters();

        }
    );


    /* ========================================
       STAFF FILTER
    ======================================== */

    staffFilter.addEventListener(
        "click",
        () => {

            staffOnly =
                !staffOnly;


            staffFilter.classList.toggle(
                "active",
                staffOnly
            );


            staffFilter.textContent =

                staffOnly

                    ? "✓ Staff Only"

                    : "Staff Only";


            applyFilters();

        }
    );


    /* ========================================
       MANUAL REFRESH
    ======================================== */

    refreshButton.addEventListener(
        "click",
        loadServer
    );


    function setRefreshLoading(value) {

        refreshButton.disabled =
            value;


        refreshButton.classList.toggle(
            "loading",
            value
        );


        if (value) {

            refreshIcon.textContent =
                "↻";

        }

    }


    /* ========================================
       LAST UPDATED
    ======================================== */

    function updateTimestamp() {

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        lastUpdated.textContent =
            `Updated ${time}`;

    }


    /* ========================================
       ERROR STATE
    ======================================== */

    function showError() {

        setOnline(false);


        playerCount.textContent =
            "--";

        queueCount.textContent =
            "--";

        staffCount.textContent =
            "--";

        serverCapacity.textContent =
            "--";

        capacityText.textContent =
            "Information unavailable";

        capacityPercent.textContent =
            "--";

        capacityFill.style.width =
            "0%";

        playerSummary.textContent =
            "Unable to retrieve players";


        playerList.innerHTML = `

            <div class="server-v2-empty">

                <div class="empty-player-icon error">
                    !
                </div>

                <h3>
                    Server information unavailable
                </h3>

                <p>
                    Sydney Roleplay could not connect
                    to the live ER:LC server.
                </p>

                <button
                    class="empty-retry-button"
                    id="retryServer"
                    type="button"
                >
                    Try Again
                </button>

            </div>

        `;


        const retry =
            document.getElementById(
                "retryServer"
            );


        if (retry) {

            retry.addEventListener(
                "click",
                loadServer
            );

        }

    }


    /* ========================================
       ESCAPE HTML
    ======================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value ?? "";


        return div.innerHTML;

    }


    /* ========================================
       START
    ======================================== */

    loadServer();


    /* ========================================
       AUTO REFRESH

       Every 30 seconds
    ======================================== */

    setInterval(
        loadServer,
        30000
    );

});
