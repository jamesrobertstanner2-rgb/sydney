/* ========================================
   SYDNEY ROLEPLAY
   ER:LC LIVE SERVER API
======================================== */

export default async function handler(req, res) {

    /* ========================================
       ONLY ALLOW GET REQUESTS
    ======================================== */

    if (req.method !== "GET") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    /* ========================================
       GET SERVER KEY FROM VERCEL
    ======================================== */

    const serverKey =
        process.env.ERLC_SERVER_KEY;


    if (!serverKey) {

        return res.status(500).json({
            error: "ERLC_SERVER_KEY is not configured."
        });

    }


    try {

        /* ========================================
           REQUEST ER:LC SERVER DATA
        ======================================== */

        const response = await fetch(

            "https://api.erlc.gg/v2/server?Players=true&Queue=true&Staff=true",

            {
                method: "GET",

                headers: {
                    "server-key": serverKey,
                    "Accept": "application/json"
                }
            }

        );


        /* ========================================
           READ RESPONSE
        ======================================== */

        const text =
            await response.text();


        let data = null;


        try {

            data =
                JSON.parse(text);

        } catch {

            data = null;

        }


        /* ========================================
           ER:LC API ERROR
        ======================================== */

        if (!response.ok) {

            console.error(
                "ER:LC API Error:",
                response.status,
                text
            );


            return res
                .status(response.status)
                .json({

                    error:
                        "ER:LC API request failed.",

                    status:
                        response.status,

                    details:
                        data || text

                });

        }


        /* ========================================
           MAKE SURE RESPONSE IS JSON
        ======================================== */

        if (!data) {

            return res.status(500).json({

                error:
                    "ER:LC returned an invalid response."

            });

        }


        /* ========================================
           PLAYERS
        ======================================== */

        const rawPlayers =
            data.Players ||
            data.players ||
            [];


        const players =
            rawPlayers.map((player) => {


                /* PLAYER NAME */

                const rawPlayerName =

                    player.Player ||
                    player.Username ||
                    player.username ||
                    "Unknown Player";


                let username =
                    rawPlayerName;


                /*
                    ER:LC can return something like:

                    ExamplePlayer:123456789

                    We only want to display:

                    ExamplePlayer
                */

                if (
                    typeof rawPlayerName === "string" &&
                    rawPlayerName.includes(":")
                ) {

                    username =
                        rawPlayerName.split(":")[0];

                }



                /* PERMISSION */

                const permission =

                    player.Permission ||
                    player.permission ||
                    "Normal";



                /* RETURN PLAYER */

                return {

                    username: username,

                    team:

                        player.Team ||
                        player.team ||
                        "Unknown",

                    callsign:

                        player.Callsign ||
                        player.callsign ||
                        "—",

                    permission: permission,

                    staff:

                        permission !== "Normal"

                };

            });



        /* ========================================
           QUEUE
        ======================================== */

        const rawQueue =

            data.Queue ||
            data.queue ||
            [];


        let queueCount = 0;


        if (Array.isArray(rawQueue)) {

            queueCount =
                rawQueue.length;

        } else if (
            typeof rawQueue === "number"
        ) {

            queueCount =
                rawQueue;

        }



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
                Fall back to player permissions
                if Staff isn't separately returned.
            */

            staffCount =
                players.filter(
                    (player) =>
                        player.staff
                ).length;

        }



        /* ========================================
           PLAYER COUNT
        ======================================== */

        const currentPlayers =

            data.CurrentPlayers ??

            data.currentPlayers ??

            players.length;



        /* ========================================
           MAX PLAYERS
        ======================================== */

        const maxPlayers =

            data.MaxPlayers ??

            data.maxPlayers ??

            40;



        /* ========================================
           SEND SAFE DATA TO WEBSITE
        ======================================== */

        return res.status(200).json({

            online: true,

            name:

                data.Name ||
                data.name ||
                "Sydney Roleplay",

            currentPlayers:
                currentPlayers,

            maxPlayers:
                maxPlayers,

            queue:
                queueCount,

            staff:
                staffCount,

            players:
                players

        });


    } catch (error) {


        /* ========================================
           CONNECTION ERROR
        ======================================== */

        console.error(
            "Sydney Roleplay API Error:",
            error
        );


        return res.status(500).json({

            error:
                "Unable to connect to the ER:LC API.",

            message:
                error.message

        });

    }

}