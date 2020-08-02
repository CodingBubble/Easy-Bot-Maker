
# Initialize
import os
import json
import bot_api.definitions as definitions

config_file = open("config.json")
config = json.load(config_file)


os.system("py -3 -m pip install blinker")

from ts3.TS3Connection import TS3Connection
import ts3.Events as Events


ts3conn = TS3Connection(config["host"], config["port"])

def Login():
        global ts3conn

        try:
                ts3conn.login(
                        config["login"],
                        config["password"]
                )
                print("Connected Successfully")
        except Exception as err:
                print("Login failed:", err)
                exit(1)

        ts3conn.use(sid=1)
        try:
                ts3conn.clientupdate(["client_nickname="+config["name"]])
        except:
                ts3conn.clientupdate(["client_nickname="+config["name"]+"2"])

        RegisterEvents()




def RegisterEvents():

        ts3conn.register_for_private_messages(EventCallback)
        ts3conn.register_for_server_events(EventCallback)




def SendMessageToClients(clients, message):
        for client in clients:

                try:
                        if client["client_type"]!="1":

                                ts3conn.sendtextmessage(definitions.TextMessageTargetMode.CLIENT, client["clid"], message)
                                print(client)
                except Exception as e:
                        print(e)




def PokeClients (clients, message):
        for client in clients:
                try:
                        ts3conn.clientpoke(client["clid"], msg=message)
                except:
                        pass











def ExecuteCommand (Command, Args, Sender):
        print(Command, Args, Sender)
        for command in config["commands"]:
                if command["name"] == Command:
                        Actionargs = command["action"]["args"].copy()
                        for i in range(len(Actionargs)):
                                Actionargs[i] = Actionargs[i].replace("{s}", str(Sender))
                                for j in range(len(Args)):
                                        Actionargs[i] = Actionargs[i].replace("{"+str(j)+"}", Args[j])

                        ExecuteAction(command["action"]["name"], Actionargs)





def EventCallback(sender, **kw):
        event = kw["event"]

        if type(event) is Events.TextMessageEvent:
                if event.invoker_id != int(ts3conn.whoami()["client_id"]):
                        Message: str = event.data["msg"]
                        if Message.startswith("!"):
                                Command: str = Message[1:].split(" ")
                                ExecuteCommand(Command[0], Command[-1:], event.invoker_id)

        else:
               # print(event.data)
               # print(event.reason_msg)
               pass





def ExecuteAction(Action, Args):

        if Action == "sendtextmessage":
                print(int(Args[0]), Args[1])
                ts3conn.sendtextmessage(definitions.TextMessageTargetMode.CLIENT, int(Args[0]), Args[1])
