function move(direction) {
    switch direction
}

Template.body.events({
    "input #prompt": function(event) {
        var value = event.target.value;

        if (_.contains(['N','S','E','W'], value)) {
            event.target.value = "";
        }

        if (value === "N") {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom.north) {
                Meteor.call("move", currentRoom._id, currentRoom.north);
                Session.setPersistent("currentRoomId", currentRoom.north);
            }
        }

        if (value === "S") {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom.south) {
                Meteor.call("move", currentRoom._id, currentRoom.south);
                Session.setPersistent("currentRoomId", currentRoom.south);
            }
        }

        if (value === "E") {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom.east) {
                Meteor.call("move", currentRoom._id, currentRoom.east);
                Session.setPersistent("currentRoomId", currentRoom.east);
            }
        }

        if (value === "W") {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom.west) {
                Meteor.call("move", currentRoom._id, currentRoom.west);
                Session.setPersistent("currentRoomId", currentRoom.west);
            }
        }
    },

    "submit #prompt": function(event) {
        var input = event.target.command.value.split(' ')
        event.target.command.value = '';
        var command = _.first(input);
        var args = _.rest(input);
        console.log("command = '" + command + "'");
        console.log("args = '" + args.join(' ') + "'");

        if (command === "say") {
            Meteor.call("say", Session.get("currentRoomId"), args.join(' '));
        }

        if (command === "kill") {
            Meteor.call("kill", Session.get("currentRoomId"), args[0]);
        }

        return false;
    },

    'click #repop': function(event) {
        Meteor.call('repop');
    }
});
