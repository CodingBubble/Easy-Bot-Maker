

var CommandElement = document.getElementById("commands");


const CommandEntryPrefab ='<div class="Command">                                      \
                    <label for="Command[ID]"> When a User sends the Command: </label> \
                    <input type="text" placeholder="CommandName" id="Command[ID]">    \
                    <br>                                                              \
                                                                                      \
                    <div class="Action">                                              \
                        <label for="CommandAction[ID]"> Then </label>                 \
                        <select id="CommandAction[ID]">                               \
                          [ACTIONS]                                                   \
                        </select><br>                                                 \
                        <div id="CommandActionArgs[ID]">  </div>                         \
                  </div><button class="AddButton" onclick="RemCommandEntry(CommandAction[ID])">-</button>                                                          \
                  </div> \
';



CommandID = 0;




const ActionOptionPrefab = ' <option value="[OPT]">[OPT]</option> '



const ActionDisplayInputPrefab = ' <input id="ActionArg[ACTION]|[ID]"> '



const ExistingCommands = []








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
  ArgsObj.innerHTML = ActionDescMap[selectedOption].replace(/\[ACTION\]/,ID.toString())
}



function RemCommandEntry(El)
{
  ID = El.id.toString().replace(/\D/g,'');
  const ArgsObj = document.getElementById("Command"+ID).parentElement;
  CommandElement.removeChild(ArgsObj)
  const index = ExistingCommands.indexOf(ID);
  if (index > -1) {
    ExistingCommands.splice(index, 1);
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

  HelpData.Actions.forEach(Action=>{
    	ActionOptions.push(ActionOptionPrefab.replace(/\[OPT\]/g, Action.name))
      var ActionDesc = Action.display;
      for (var i = 1; i != Action.ArgNum + 1; i++)
      {
        ActionDesc = ActionDesc.replace(new RegExp("<"+i+">") , ActionDisplayInputPrefab.replace(/\[ID\]/, i.toString()))
      }

      ActionDescMap[Action.name] = ActionDesc
  })

}









// doc = document was aufgerufen wird
// args = Argument -> in der Array Form: ["Argument=Wert", ""]
function loadData(doc, args=[])
{
	OArgs = "";
	for (i=0;i!=args.length;i++)
	{
		OArgs += args[i] + "&";
	}
	OArgs = OArgs.substring(0, OArgs.length - 1);
	var request = new XMLHttpRequest();
    request.open('POST', doc , false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(OArgs)
	return request.responseText;
}



defineAll()
