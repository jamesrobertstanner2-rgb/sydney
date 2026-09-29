export default async function handler(req, res) {

    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const serverKey = process.env.ERLC_SERVER_KEY;

    if (!serverKey) {
        return res.status(500).json({
            error: "ERLC_SERVER_KEY is not configured."
        });
    }

    try {

        const response = await fetch(
            "https://api.policeroleplay.community/v2/server?Players=true&Queue=true&Staff=true",
            {
                method: "GET",

                headers: {
                    "server-key": serverKey,
                    "Accept": "application/json"
                }
            }
        );


        const text = await response.text();


        if (!response.ok) {

            console.error(
                "ERLC API Error:",
                response.status,
                text
            );

            return res.status(response.status).json({
                error: "ER:LC API request failed.",
                status: response.status
            });

        }


        let data;

        try {
            data = JSON.parse(text);
        } catch {

            return res.status(500).json({
                error: "ER:LC returned an invalid response."
            });

        }


        /* ========================================
           NORMALISE PLAYERS
        ======================================== */

        const rawPlayers =
            data.Players ||
            data.players ||
            [];


        const players = rawPlayers.map(player => {

            const playerName =
                player.Player ||
                player.Username ||
                player.username ||
                "Unknown Player";


            let username = playerName;

            /*
                Some ER:LC responses may contain:
                Username:123456789

                This removes the ID from what we display.
            */

            if (
                typeof playerName === "string" &&
                playerName.includes(":")
            ) {

                username =
                    playerName.split(":")[0];

            }


            const permission =
                player.Permission ||
                player.permission ||
                "Normal";


            return {

                username,

                team:
                    player.Team ||
                    player.team ||
                    "Unknown",

                callsign:
                    player.Callsign ||
                    player.callsign ||
                    "—",

                permission,

                staff:
                    permission !== "Normal"

            };

        });



        /* ========================================
           QUEUE
        ======================================== */

        const queue =
            data.Queue ||
            data.queue ||
            [];


        const queueCount =
            Array.isArray(queue)
                ? queue.length
                : 0;



        /* ========================================
           STAFF
        ======================================== */

        const rawStaff =
            data.Staff ||
            data.staff;


        let staffCount = 0;


        if (Array.isArray(rawStaff)) {

            staffCount =
                rawStaff.length;

        } else {

            /*
                If Staff isn't returned in the format
                expected, fall back to permissions
                from the player list.
            */

            staffCount =
                players.filter(
                    player => player.staff
                ).length;

        }



        /* ========================================
           RETURN SAFE DATA TO WEBSITE
        ======================================== */

        return res.status(200).json({

            online: true,

            name:
                data.Name ||
                data.name ||
                "Sydney Roleplay",

            currentPlayers:
                data.CurrentPlayers ??
                players.length,

            maxPlayers:
                data.MaxPlayers ??
                40,

            queue: queueCount,

            staff: staffCount,

            players

        });


    } catch (error) {

        console.error(
            "Server API Error:",
            error
        );


        return res.status(500).json({

            error:
                "Unable to connect to the ER:LC API."

        });

    }

}