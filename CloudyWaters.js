
var Rooms = new Mongo.Collection("rooms");
var Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {

    Tracker.autorun(function() {
        Meteor.subscribe("rooms", function() {
            var currentRoom = Rooms.findOne({name: "Market Square"});
            Session.set("currentRoomId", currentRoom._id);
        });
    });
    
    Tracker.autorun(function() {
        Meteor.subscribe("messages", Session.get("currentRoomId"));
    });

    Template.body.helpers({

        currentRoom: function () {
            return Rooms.findOne(Session.get("currentRoomId"));
        },

        northRoom: function () {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom && currentRoom.north) {
                return Rooms.findOne(currentRoom.north);
            }
            return null;
        },

        southRoom: function () {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom && currentRoom.south) {
                return Rooms.findOne(currentRoom.south);
            }
            return null;
        },

        eastRoom: function () {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom && currentRoom.east) {
                return Rooms.findOne(currentRoom.east);
            }
            return null;
        },

        westRoom: function () {
            var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
            if (currentRoom && currentRoom.west) {
                return Rooms.findOne(currentRoom.west);
            }
            return null;
        }

    });
    
    Template.body.events({

        "input #prompt": function (event) {
            var value = event.target.value;

            if (_.contains(['N','S','E','W'], value)) {
                event.target.value = "";
            }

            if (value === "N") {
                var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
                if (currentRoom.north) {
                    Meteor.call("move", currentRoom._id, currentRoom.north);
                    Session.set("currentRoomId", currentRoom.north);
                }
            }

            if (value === "S") {
                var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
                if (currentRoom.south) {
                    Meteor.call("move", currentRoom._id, currentRoom.south);
                    Session.set("currentRoomId", currentRoom.south);
                }
            }

            if (value === "E") {
                var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
                if (currentRoom.east) {
                    Meteor.call("move", currentRoom._id, currentRoom.east);
                    Session.set("currentRoomId", currentRoom.east);
                }
            }

            if (value === "W") {
                var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
                if (currentRoom.west) {
                    Meteor.call("move", currentRoom._id, currentRoom.west);
                    Session.set("currentRoomId", currentRoom.west);
                }
            }
        },

        "submit #prompt": function (event) {
            var input = event.target.command.value.split(' ')
            event.target.command.value = '';
            var command = _.first(input);
            var args = _.rest(input);
            console.log("command = '" + command + "'");
            console.log("args = '" + args.join(' ') + "'");

            if (command === "say") {
                Meteor.call("say", Session.get("currentRoomId"), args.join(' '));
            }
            return false;
        }

    });
    
    Template.room.helpers({

        hasExits: function () {
            return this.north || this.south || this.east || this.west;
        },

        playerList: function () {
            var currentRoomId = Session.get("currentRoomId");
            if (this._id === currentRoomId) {
                var currentRoom = Rooms.findOne(currentRoomId);
                if (currentRoom) {
                    return _.without(currentRoom.players, Meteor.user().username);
                }
            }
            return null;
        }

    });
    
    Template.message.rendered = function() {
        $msgDiv = $("#messages");
        $msgDiv.scrollTop($msgDiv[0].scrollHeight);
    };

    Template.messageBox.helpers({
        messages: function () {
            return Messages.find();
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Accounts.onLogin(function () {
        Meteor.call("addPlayerToRoom", Session.get("currentRoomId"));
    });
}


if (Meteor.isServer) {
    
    Meteor.publish("rooms", function () {
        return Rooms.find();
    });

    Meteor.publish("messages", function (roomId) {
        return Messages.find({roomId: roomId});
    });
    
    Meteor.startup(function () {
        // Reset the messages collection.
        Messages.remove({});

        // If there are no rooms, create an initial map for testing.
        if (Rooms.find().count() === 0) {
            var desc = "You are standing in a room. There's not much here, but there are a few things worth noting. First, the room seems to be slowly filling with smoke. Second, it stinks in here. Third, there is a road leading to the north. And fourth, there is another road leading to the south.";
            
            var mainId = Rooms.insert({
                name: "Market Square",
                desc: desc,
                players: []
            });
            
            var northId = Rooms.insert({
                name: "Northern Road",
                desc: desc,
                players: []
            });
            
            var southId = Rooms.insert({
                name: "Southern Road",
                desc: desc,
                players: []
            });

            var eastId = Rooms.insert({
                name: "Eastern Road",
                desc: desc,
                players: []
            });

            var westId = Rooms.insert({
                name: "Western Road",
                desc: desc,
                players: []
            });

            Rooms.update(mainId, {$set: {north: northId}});
            Rooms.update(mainId, {$set: {south: southId}});
            Rooms.update(mainId, {$set: {east: eastId}});
            Rooms.update(mainId, {$set: {west: westId}});
        
            Rooms.update(northId, {$set: {south: mainId}});
            Rooms.update(southId, {$set: {north: mainId}});
            Rooms.update(eastId, {$set: {west: mainId}});
            Rooms.update(westId, {$set: {east: mainId}});
        }
    });
    
}


Meteor.methods({

    getStartingRoom: function () {
        var room = Rooms.findOne({name: "Market Square"});
        return room;
    },

    addPlayerToRoom: function (roomId) {
        var room = Rooms.findOne(roomId);
        if (room) {
            var playerName = Meteor.user().username;
            if (! _.contains(room.players, playerName)) {
                Rooms.update(roomId, {$set: {players: room.players.concat(playerName)}});
            }
        }
    },

    move: function (fromRoomId, toRoomId) {
        var fromRoom = Rooms.findOne(fromRoomId);
        var toRoom = Rooms.findOne(toRoomId);
        var playerName = Meteor.user().username;
        console.log("Move " + playerName + " from " + fromRoom.name + " to " + toRoom.name);
        if (_.contains(fromRoom.players, playerName)) {
            Rooms.update(fromRoomId, {$set: {players: _.without(fromRoom.players, playerName)}});
        }
        if (! _.contains(toRoom.players, playerName)) {
            Rooms.update(toRoomId, {$set: {players: toRoom.players.concat(playerName)}});
        }
    },

    say: function (roomId, message) {
        Messages.insert({
            roomId: roomId,
            playerName: Meteor.user().username,
            message: message
        });
    }

});
