export default function handler(req, res) {

    try {

        const clientId = process.env.DISCORD_CLIENT_ID;
        const redirectUri = process.env.DISCORD_REDIRECT_URI;

        if (!clientId) {
            return res.status(500).json({
                error: "DISCORD_CLIENT_ID is missing."
            });
        }

        if (!redirectUri) {
            return res.status(500).json({
                error: "DISCORD_REDIRECT_URI is missing."
            });
        }

        const params = new URLSearchParams({
            client_id: clientId,
            response_type: "code",
            redirect_uri: redirectUri,
            scope: "identify"
        });

        const discordUrl =
            `https://discord.com/oauth2/authorize?${params.toString()}`;

        return res.redirect(302, discordUrl);

    } catch (error) {

        console.error("Discord OAuth start error:", error);

        return res.status(500).json({
            error: "Unable to start Discord login.",
            message: error.message
        });

    }

}