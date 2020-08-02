import bot_api

bot_api.Login()


bot_api.ts3conn.start_keepalive_loop()


bot_api.SendMessageToClients(bot_api.ts3conn.clientlist(), "Der Bot ist Nun Online")


#bot_api.ts3conn.close()


print("Der Server wurde gestartet")