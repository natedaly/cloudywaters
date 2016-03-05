Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Accounts.onLogin(function() {
    if (! Session.get("currentRoomId")) {
        var currentRoom = Rooms.findOne({name: "Market Square"});
        Meteor.call("addPlayerToRoom", currentRoom._id);
        Session.setPersistent("currentRoomId", currentRoom._id);
    }
});

// Custom logout actions.
var _logout = Meteor.logout;
Meteor.logout = function customLogout() {
    Meteor.call("playerLogout");
    Session.clear();
    _logout.apply(Meteor, arguments);
};
