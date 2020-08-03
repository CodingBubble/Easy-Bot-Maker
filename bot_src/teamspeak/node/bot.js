
const { TeamSpeak, QueryProtocol  } = require("ts3-nodejs-library")

const config = require("./config.json")
const { Command } = require("ts3-nodejs-library/lib/transport/Command")


const teamspeak = new TeamSpeak({
  host: config.host,
  queryport: config.port, 
  serverport: 9987,
  username: config.login,
  password: config.password,
  nickname: config.name
})



teamspeak.on("ready", async () => {
  	console.log("Connected")
	const clients = await teamspeak.clientList()

	Promise.all([
    teamspeak.registerEvent("server"),
    teamspeak.registerEvent("channel", 0),
    teamspeak.registerEvent("textserver"),
    teamspeak.registerEvent("textchannel"),
    teamspeak.registerEvent("textprivate")
	  ]).then(() => {
		  console.log("Subscribed to all Events")
	  }).catch(e => {
		  console.log("CATCHED", e.message)
	})



	console.log("Sending Welcome Message to all Players")
	clients.forEach(client => {
		if (client.propcache.clientType==0)
		{
			
			client.message("The Bot is now online!")
		
		}
	})
	
	
})




teamspeak.on("error", () => {
	console.log("An Error Occured")
})





teamspeak.on("textmessage", ev => {
	const sender = ev.invoker.clid;
	const msg = ev.msg;
	var command = msg.split(" ")[0];
	var args = msg.shift();
	HandleCommand (command, args, sender)
})










function HandleCommand(Command, Args, Sender)
{
	config.commands.forEach(command => {	
			if (command["name"] == Command)
			{
				Actionargs = command["action"]["args"].copy()
				for (var i=0; i!=Actionargs.length; i++)
				{
					Actionargs[i] = Actionargs[i].replace("{s}", str(Sender))
					for (var j=0; j!=Args.length; j++)
					{
						Actionargs[i] = Actionargs[i].replace("{"+str(j)+"}", Args[j])
					}
				}

		
				ExecuteAction(command["action"]["name"])
			}
	})

                
}


function ExecuteAction (Action, Args)
{
	if (Action == "sendtextmessage")
	{
		const client = teamspeak.getClientById(Args[0])
		client.message(Args[0])
	}

}


