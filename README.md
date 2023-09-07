# mineflayer-afk-bot

Minecraft bot created to bee AFK at server farms. It's ready to deploy using docker. Update `docker-compose.yml` with your server and bot information.

Tis bot is ment to be used in your own spigot/paper server.

## Server configuration
### Permissions
Plugin special permissions (appart from other tipical permissions) that allows bot to use all funcionalities
```
essentials.god
essentials.sleepingignored
essentials.tp
essentials.home
```

## Recomended plugin
Since 1.13 minecraft server automatically kicks players if they send a lot of messages or commands. This [plugin](https://www.spigotmc.org/resources/disablekickspam.74766/) avoids that, and it's necesary. Otherwise, bots will be kicked.

## Authentication
It's ready to be used with Authme or other `/login` authentication plugins. You will need to register the bots previously using server console.