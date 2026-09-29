export default async function handler(req, res) {

    const code =
        req.query.code;


    if (!code) {

        return res.redirect(
            "/login.html?error=discord"
        );

    }


    const clientId =
        process.env.DISCORD_CLIENT_ID;

    const clientSecret =
        process.env.DISCORD_CLIENT_SECRET;

    const redirectUri =
        process.env.DISCORD_REDIRECT_URI;


    if (
        !clientId ||
        !clientSecret ||
        !redirectUri
    ) {

        return res.status(500).json({
            error:
                "Discord OAuth environment variables are missing."
        });

    }


    try {

        /* ========================================
           EXCHANGE CODE FOR TOKEN
        ======================================== */

        const tokenBody =
            new URLSearchParams({

                client_id:
                    clientId,

                client_secret:
                    clientSecret,

                grant_type:
                    "authorization_code",

                code:
                    code,

                redirect_uri:
                    redirectUri

            });


        const tokenResponse =
            await fetch(
                "https://discord.com/api/v10/oauth2/token",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        tokenBody.toString()

                }
            );


        const tokenData =
            await tokenResponse.json();


        if (!tokenResponse.ok) {

            console.error(
                "Discord Token Error:",
                tokenData
            );


            return res.redirect(
                "/login.html?error=token"
            );

        }


        /* ========================================
           GET DISCORD USER
        ======================================== */

        const userResponse =
            await fetch(
                "https://discord.com/api/v10/users/@me",
                {

                    headers: {

                        Authorization:
                            `Bearer ${tokenData.access_token}`

                    }

                }
            );


        const user =
            await userResponse.json();


        if (!userResponse.ok) {

            console.error(
                "Discord User Error:",
                user
            );


            return res.redirect(
                "/login.html?error=user"
            );

        }


        /* ========================================
           BUILD SAFE USER DATA
        ======================================== */

        const safeUser = {

            id:
                user.id,

            username:
                user.username,

            globalName:
                user.global_name || null,

            avatar:
                user.avatar || null

        };


        /* ========================================
           TEMPORARY LOGIN HANDOFF

           We'll replace this with a secure session
           in the next stage.
        ======================================== */

        const encodedUser =
            Buffer
                .from(
                    JSON.stringify(
                        safeUser
                    )
                )
                .toString("base64url");


        return res.redirect(
            `/dashboard.html?discord=${encodedUser}`
        );


    } catch (error) {

        console.error(
            "Discord OAuth Error:",
            error
        );


        return res.redirect(
            "/login.html?error=unknown"
        );

    }

}