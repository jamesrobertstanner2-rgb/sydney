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

        const discordUrl =
            "https://discord.com/oauth2/authorize" +
            "?client_id=" + encodeURIComponent(clientId) +
            "&response_type=code" +
            "&redirect_uri=" + encodeURIComponent(redirectUri) +
            "&scope=identify";

        return res.redirect(302, discordUrl);

    } catch (error) {

        console.error("Discord login error:", error);

        return res.status(500).json({
            error: "Discord login failed.",
            message: error.message
        });

    }

}