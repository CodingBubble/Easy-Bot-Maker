const { exec } = require("child_process");

exec("npm install ts3-nodejs-library", (error, stdout, stderr) => {
	
});

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



config.events.forEach(Eve=>{
	teamspeak.on(Eve.name.toLowerCase(), async(ev) => {
		
		var sender; 
		try 
		{
			sender = ev.client.propcache.clientNickname
		} catch 
		{
			sender = ev.invoker.propcache.clientNickname;
		}
		
		var cond = ""
		switch (Eve.name.toLowerCase())
		{
			case "textmessage":
				cond = ev.msg;
				break
			case "clientmoved":
				cond = ev.channel.name
				
		}



		if (Eve.condition=="" || Eve.condition == cond)
		{
			Actionargs = [...Eve["action"]["args"]]
			for (var i=0; i!=Actionargs.length; i++)
			{
				Actionargs[i] = Actionargs[i].replace(new RegExp("\\{s\\}","g"), sender);
			}
	
	
			ExecuteAction(Eve["action"]["name"], Actionargs)
		}


	})
})







function HandleCommand(Command, Args, Sender)
{
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

	var client;

	switch (Action)
	{


		

		case "sendtextmessage":	
			client = await teamspeak.getClientByName(Args[0]);	
			client.message(Args[1])
			break


		case "sendmessagetogroup":	
		
			try
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
			catch 
			{

			}

			break
	
			
			case "sendmessagetoall":	
		
			try
			{
				client = await teamspeak.getClientByName(Args[0]);
				const clients = await teamspeak.clientList();

				clients.forEach(client => {		
					if (client.propcache.clientType==0)
					{		
						client.message(Args[0])
					}
				})
			}
			catch 
			{

			}

			break
	


		case "addservergroup":
			try
			{
				client = await teamspeak.getClientByName(Args[0]);

				const Groups = await teamspeak.serverGroupList()

				Group = null

				Groups.forEach(g => {
					if (g.name==Args[1] && g.type==1)
					{
						Group = g
					}
				})

				if (Group != null)
				{
					try 
					{
						Group.addClient(client).catch(()=>{})
					}
					catch{}
				}
			} 
			catch
			{

			}
			break

	

		case "removeservergroup":	
			try
			{
				client = await teamspeak.getClientByName(Args[0]);
				const Groups = await teamspeak.serverGroupList()
				Group = null
				Groups.forEach(g => {
					if (g.name==Args[1] && g.type==1)
					{
						Group = g						
					}

				})

				if (Group != null)
				{
					try 
					{
						client.delGroups(Group).catch(()=>{})
					}
					catch (e) {console.log(e)}
				}
			} 
			catch {}
			break




		case "moveclienttochannel":
			try 
			{
				client = await teamspeak.getClientByName(Args[0]);
				const Channels = await teamspeak.channelList()
				var channel = null
				Channels.forEach(c => {
					if (c.name==Args[1])
					{
						channel = c
						
					}

				})

				if (channel != null)
				{
					try 
					{
						client.move(channel).catch(()=>{})
					}
					catch (e) {console.log(e)}
				}
			}
			catch {}	
			break	 
		


		case  "kickclientfromchannel":
			client = await teamspeak.getClientByName(Args[0]);
			try 
			{
				client.kickFromChannel().catch(()=>{})
			}
			catch {}
			break

	



		case  "kickclientfromserver":
			client = await teamspeak.getClientByName(Args[0]);
			try 
			{
				client.kickFromServer().catch(()=>{})
			}
			catch {}
			break


		case  "banclient":	
			try 
			{	
				client = await teamspeak.getClientByName(Args[0]);
				client.ban(Args[1], Args[2]).catch(()=>{})
				break
			} catch {}
	


	}

	


}
