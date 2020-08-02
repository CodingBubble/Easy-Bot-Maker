import ts3.Events

class TextMessageTargetMode:
    CLIENT = 1
    CHANNEL = 2
    SERVER = 3


Events = {
    "TextMessage": ts3.Events.TextMessageEvent,
    "ChannelDescriptionEdited": ts3.Events.ChannelDescriptionEditedEvent,
    "ChannelEdited": ts3.Events.ChannelEditedEvent,
    "ClientBanned": ts3.Events.ClientBannedEvent,
    "ClientEntered": ts3.Events.ClientEnteredEvent,
    "ClientKicked": ts3.Events.ClientKickedEvent,
    "ClientLeft": ts3.Events.ClientLeftEvent,
    "ClientMoved": ts3.Events.ClientMovedEvent,
}



Actions = {

}