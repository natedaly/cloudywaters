// All commands available to players at the input prompt are defined here.
Command = {
    north: function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.north) {
            Meteor.call("move", currentRoom._id, currentRoom.north);
            setCurrentRoom(currentRoom.north);
        }
    },
    south: function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.south) {
            Meteor.call("move", currentRoom._id, currentRoom.south);
            setCurrentRoom(currentRoom.south);
        }
    },
    east: function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.east) {
            Meteor.call("move", currentRoom._id, currentRoom.east);
            setCurrentRoom(currentRoom.east);
        }
    },
    west: function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.west) {
            Meteor.call("move", currentRoom._id, currentRoom.west);
            setCurrentRoom(currentRoom.west);
        }
    },
    say: function(args) {
        Meteor.call("say", Session.get("currentRoomId"), args.join(' '));
    },
    kill: function(args) {
        Meteor.call("kill", Session.get("currentRoomId"), args[0]);
    },
    repop: function(args) {
        Meteor.call('repop');
    },
    add: function(args) {
        var direction = _.first(args)
        var roomName = _.rest(args).join(' ');
        var currentRoom = getCurrentRoom();
        if (_.has(currentRoom, direction)) {
            alert('There is already a room to the ' + direction);
        } else {
            Meteor.call('addRoom', currentRoom, direction, roomName);
        }
    },
    edit: function(args) {
        var room = getCurrentRoom();
        vex.dialog.open({
            message: '',
            input: '<label>Title</label><input name="name" type="text" value="' + room.name +'" required/>'
                 + '<label>Description</label><textarea name="desc" rows="10" cols="50" required>' + room.desc + '</textarea>',
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    text: 'Save'
                }), $.extend({}, vex.dialog.buttons.NO, {
                    text: 'Cancel'
                })
            ],
            callback: function(data) {
                if (data) {
                    Meteor.call('editRoom', room._id, data)
                }
            }
        });
    }
};

// This is the main function for running commands.
Command.run = function(command, args) {
    if (command === 'N' || command === 'n') {
        command = 'north';
    } else if (command === 'S' || command === 's') {
        command = 'south';
    } else if (command === 'E' || command === 'e') {
        command = 'east';
    } else if (command === 'W' || command === 'w') {
        command = 'west';
    }
    
    if (_.has(Command, command)) {
        Command[command](args);
    } else {
        vex.dialog.alert('Unknown command!');
    }
};
