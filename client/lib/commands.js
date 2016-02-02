// All commands available to players at the input prompt are defined here.
Command = {
    'north': function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.north) {
            Meteor.call("move", currentRoom._id, currentRoom.north);
            setCurrentRoom(currentRoom.north);
        }
    },
    'south': function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.south) {
            Meteor.call("move", currentRoom._id, currentRoom.south);
            setCurrentRoom(currentRoom.south);
        }
    },
    'east': function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.east) {
            Meteor.call("move", currentRoom._id, currentRoom.east);
            setCurrentRoom(currentRoom.east);
        }
    },
    'west': function() {
        var currentRoom = getCurrentRoom();
        if (currentRoom.west) {
            Meteor.call("move", currentRoom._id, currentRoom.west);
            setCurrentRoom(currentRoom.west);
        }
    },
    'say': function(args) {
        Meteor.call("say", Session.get("currentRoomId"), args.join(' '));
    },
    'kill': function(args) {
        Meteor.call("kill", Session.get("currentRoomId"), args[0]);
    },
    'repop': function(args) {
        Meteor.call('repop');
        var currentRoom = getCurrentRoom();
    },
    'add': function(args) {
        var direction = _.first(args)
        var roomName = _.rest(args).join(' ');
        var currentRoom = getCurrentRoom();
        if (_.has(currentRoom, direction)) {
            alert('There is already a room to the ' + direction);
        } else {
            Meteor.call('addRoom', currentRoom, direction, roomName);
        }
    }
};

// This is the main function for running commands.
Command.run = function(command, args) {
    Meteor.call('showPlayer', currentPlayerId(), '(cmd) '+command+' '+(args ? args.join(' ') : ''));

    if (command === 'N') {
        command = 'north';
    } else if (command === 'S') {
        command = 'south';
    } else if (command === 'E') {
        command = 'east';
    } else if (command === "W") {
        command = 'west';
    }
    
    if (_.has(Command, command)) {
        Command[command](args);
    } else {
        alert('Unknown command!');
    }
};
