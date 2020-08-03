
const { TeamSpeak, QueryProtocol, TeamSpeakChannel  } = require("ts3-nodejs-library")

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


	const clients = await teamspeak.clientList()
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





teamspeak.on("textmessage", async(ev) => {
	const sender = ev.invoker.propcache.clientNickname;
	var msg = ev.msg;
	if (msg.charAt(0)=='!')
	{
		msg = msg.substr(1)
		var command = msg.split(" ")[0];
		var args = []
		try
		{
			 args = msg.split(" ").shift();
		}
		catch (e)
		{
			console.log(e)
			return
		}		
		HandleCommand (command, args, sender)
	}
})










function HandleCommand(Command, Args, Sender)
{
	console.log(Command)
	config.commands.forEach(command => {	
			if (command["name"] == Command)
			{
				Actionargs = [...command["action"]["args"]]
				for (var i=0; i!=Actionargs.length; i++)
				{
					Actionargs[i] = Actionargs[i].replace(new RegExp("\\{s\\}","g"), Sender);
					for (var j=0; j!=Args.length; j++)
					{
						Actionargs[i] = Actionargs[i].replace((new RegExp("\\{"+j+"\\}", "g")), Args[j]);
					}
				}

		
				ExecuteAction(command["action"]["name"], Actionargs)
			}
	})

                
}


async function ExecuteAction (Action, Args)
{

	Action = Action.toLowerCase()
	if (Action == "sendtextmessage")
	{
		const client = await teamspeak.getClientByName(Args[0]);
		
		client.message(Args[1])
	}



	if (Action == "sendmessagetogroup")
	{
		const clients = await teamspeak.clientList();
		const group = Args[0];

		clients.forEach(client => {
			client.servergroups.forEach(async(GroupId)=>{
				const Group = await teamspeak.getServerGroupById(GroupId);
				GroupName = Group.name;				
				if (client.propcache.clientType==0 && group==GroupName)
				{		
					client.message(Args[1])
				}
			})

		})
	}

	if (Action == "addservergroup")
	{
		const client = await teamspeak.getClientByName(Args[0]);
		console.log(Args)
		client.addGroups(Args[1])
	}


}
