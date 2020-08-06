

var CommandElement = document.getElementById("commands");

var EventElement = document.getElementById("events");








const CommandEntryPrefab ='<div class="Command">                                     \
                    <label for="Command[ID]"> When a User sends the Command: </label> \
                    <input type="text" placeholder="CommandName" id="Command[ID]">    <button class="SubButton" onclick="RemCommandEntry([ID])">X</button>\
                    <br>                                                              \
                                                                                      \
                    <div class="Action">                                              \
                        <label for="CommandAction[ID]"> Then </label>                 \
                        <select id="CommandAction[ID]">                               \
                          [ACTIONS]                                                   \
                        </select><br>                                                 \
                        <div id="CommandActionArgs[ID]">  </div>                         \
                  </div>                                                          \
                  </div> \
';

var EventEntryPrefab   ='<div class="Command">    \
<label for="Event[ID]"> When: </label>            \
<select id="EventSelect[ID]">                           \
  [EVENTS]                                        \
</select>                                         <button class="SubButton" onclick="RemEventEntry([ID])">X</button>\
<div id="EventOption[ID]">                        \
</div>                                            \
<div class="Action">                              \
    <label for="ActionEventArg[ID]"> Then </label>   \
    <select id="EventAction[ID]">                 \
      [ACTIONS]                                   \
    </select><br>                                 \
    <div id="EventActionArgs[ID]">  </div>        \
</div> \
</div> \
';











CommandID = 0;
EventID = 0;



const ActionOptionPrefab = ' <option value="[OPT]">[OPT]</option> '


const ActionDisplayInputPrefab = ' <input id="ActionArg[TYPE]|[ACTION]|[ID]"> '



const EventArgPrefab = ' <input id="EventArg[ACTION]"> '


const ExistingCommands = [];

const ExitstingEvents = [];






function AddCommandEntry()
{

  if (CommandElement == null)
  {
    CommandElement = document.getElementById("commands");
  }
  var Command = CommandEntryPrefab;
  Command = Command.replace(/\[ID\]/g, CommandID.toString());
  Command = Command.replace(/\[ACTIONS\]/g, ActionOptions.join(""));

  CommandElement.appendChild(createElementFromHTML(Command));
  document.getElementById("CommandAction"+CommandID.toString()).addEventListener('change', function (){UpdateCommand(this)}, false);
  UpdateCommand(document.getElementById("CommandAction"+CommandID.toString()) )
  ExistingCommands.push(CommandID)
  CommandID++;

}




function UpdateCommand(El)
{
  var selectedOption = El.options[El.selectedIndex].value;
  ID = El.id.toString().replace(/\D/g,'');
  const ArgsObj = document.getElementById("CommandActionArgs"+ID)
  ArgsObj.innerHTML = ActionDescMap[selectedOption].replace(/\[ACTION\]/g,ID.toString()).replace(/\[TYPE\]/g,"1")
}



function RemCommandEntry(ID)
{
  const ArgsObj = document.getElementById("Command"+ID).parentElement;
  CommandElement.removeChild(ArgsObj)
  const index = ExistingCommands.indexOf(ID);
  if (index > -1) {
    ExistingCommands.splice(index, 1);
  }
}









var EventPerms = {}



function AddEventEntry()
{

  if (EventElement == null)
  {
    EventElement = document.getElementById("events");
  }
  var Command = EventEntryPrefab;
  Command = Command.replace(/\[ID\]/g, EventID.toString());
  Command = Command.replace(/\[ACTIONS\]/g, ActionOptions.join(""));



  EventElement.appendChild(createElementFromHTML(Command));
  document.getElementById("EventAction"+EventID.toString()).addEventListener('change', function (){UpdateEvent(this)}, false);
  UpdateEvent(document.getElementById("EventAction"+EventID.toString()) )
  ExitstingEvents.push(EventID)
  document.getElementById("EventSelect"+EventID.toString()).addEventListener('change', function (){UpdateEventPerm(this)}, false);
  UpdateEventPerm(document.getElementById("EventSelect"+EventID.toString()))
  EventID++;

}


function UpdateEventPerm(El)
{
  var selectedOption = El.options[El.selectedIndex].value;
  ID = El.id.toString().replace(/\D/g,'');
  const ArgsObj = document.getElementById("EventOption"+ID)
  ArgsObj.innerHTML = EventPerms[selectedOption].replace(/\[ACTION\]/g,ID.toString())
}


function UpdateEvent(El)
{
  var selectedOption = El.options[El.selectedIndex].value;
  ID = El.id.toString().replace(/\D/g,'');
  const ArgsObj = document.getElementById("EventActionArgs"+ID)
  ArgsObj.innerHTML = ActionDescMap[selectedOption].replace(/\[ACTION\]/g,ID.toString()).replace(/\[TYPE\]/g,"2")
}



function RemEventEntry(ID)
{
  const ArgsObj = document.getElementById("EventSelect"+ID).parentElement;
  EventElement.removeChild(ArgsObj)
  const index = ExistingCommands.indexOf(ID);
  if (index > -1) {
    ExitstingEvents.splice(index, 1);
  }
}














function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}





function defineAll()
{
  HelpData = JSON.parse(loadData("./scripts/ShowHelper.json"));
  Config = JSON.parse(loadData("./src/node/config.json"));
  ActionOptions = []
  ActionDescMap = {};
  ArgNumMap = {}
  EventArgNumMap = {}

  HelpData.Actions.forEach(Action=>{
    	ActionOptions.push(ActionOptionPrefab.replace(/\[OPT\]/g, Action.name))
      var ActionDesc = Action.display;
      for (var i = 1; i != Action.ArgNum + 1; i++)
      {
        ActionDesc = ActionDesc.replace(new RegExp("<"+i+">") , ActionDisplayInputPrefab.replace(/\[ID\]/, i.toString()))
      }
      ArgNumMap[Action.name] = Action.ArgNum
      ActionDescMap[Action.name] = ActionDesc
  })



  HelpData.Events.forEach(Action=>{
    var ActionDesc = Action.display;
    
    if (Action.ArgNum==1)
    {
      ActionDesc = ActionDesc.replace(/<>/g , EventArgPrefab)
    }


    ArgNumMap[Action.name] = Action.ArgNum
   
    EventPerms[Action.name] = ActionDesc
})
 EventEntryPrefab = EventEntryPrefab.replace(/\[EVENTS\]/g, Object.keys(EventPerms).map(key=>{return ActionOptionPrefab.replace(/\[OPT\]/g, key)}).join(""))


}





function MakeDownloadable ()
{
  Config.host = document.getElementById("Host").value;
  Config.login = document.getElementById("ServerQueryName").value;  
  Config.password = document.getElementById("ServerQueryPass").value;  
  Config.port = document.getElementById("Port").value;  
  Config.name = document.getElementById("Nickname").value;   

  ExistingCommands.forEach(Command=>{
    const CommandName = document.getElementById("Command"+Command).value
    const El = document.getElementById("CommandAction"+Command)
    const selectedOption = El.options[El.selectedIndex].value;
    var ActionArgs = []
    for (var i = 1; i != ArgNumMap[selectedOption] + 1; i++)
    {
      ActionArgs.push(document.getElementById("ActionArg1|"+Command+"|"+i).value)
    }
    Config.commands.push({"name": CommandName, "argNum": 0, "action": {"name": selectedOption, "args":ActionArgs}})
  })



  ExitstingEvents.forEach(Command=>{
    const E2 = document.getElementById("EventSelect"+Command)
    const selectedOptionEvent = E2.options[E2.selectedIndex].value;

    const El = document.getElementById("EventAction"+Command)
    const selectedOption = El.options[El.selectedIndex].value;
    var ActionArgs = []
    Condition = ""
    if (1 == EventPerms[selectedOptionEvent])
    {
      Condition = document.getElementById("ActionEventArg"+Command).value
    }
    for (var i = 1; i != ArgNumMap[selectedOption] + 1; i++)
    {
      ActionArgs.push(document.getElementById("ActionArg2|"+Command+"|"+i).value)
    }
    Config.events.push({"name": selectedOptionEvent, "condition": Condition, "action": {"name": selectedOption, "args":ActionArgs}})
  })


  download ("config.json", JSON.stringify(Config))
}





// doc = document was aufgerufen wird
// args = Argument -> in der Array Form: ["Argument=Wert", ""]
function loadData(doc, args=[])
{
	OArgs = doc + args.join("&");

	var request = new XMLHttpRequest();
    request.open('POST', doc , false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(OArgs)
	return request.responseText;
}



function download(filename, text) 
{
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


defineAll()

