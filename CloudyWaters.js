
var Rooms = new Mongo.Collection("rooms");

if (Meteor.isClient) {

    Template.body.helpers({
        mainRoom: function () {
            var mainRoom = Session.get("mainRoom");
            if (mainRoom) {
                return Rooms.findOne(mainRoom._id);
            }
            return null;
        },
        
        northRoom: function () {
            var mainRoom = Session.get("mainRoom");
            if (mainRoom && mainRoom.north) {
                return Rooms.findOne(Session.get("mainRoom").north);
            }
            return null;
        },

        southRoom: function () {
            var mainRoom = Session.get("mainRoom");
            if (mainRoom && mainRoom.south) {
                return Rooms.findOne(Session.get("mainRoom").south);
            }
            return null;
        },

        eastRoom: function () {
            var mainRoom = Session.get("mainRoom");
            if (mainRoom && mainRoom.east) {
                return Rooms.findOne(Session.get("mainRoom").east);
            }
            return null;
        },

        westRoom: function () {
            var mainRoom = Session.get("mainRoom");
            if (mainRoom && mainRoom.west) {
                return Rooms.findOne(Session.get("mainRoom").west);
            }
            return null;
        },

        playerList: function () {
            var mainRoom = Session.get("mainRoom")
            if (mainRoom) {
                return Rooms.findOne(mainRoom._id).players.join();
            }
            return "Oddly enough, you are nowhere!";
        }
    });
    
    Template.body.events({
        "click #mainRoom": function (event) {
            // Do nothing.
        },
        
        "input #prompt": function (event) {
            var value = event.target.value;

            if (_.contains(['N','S','E','W'], value)) {
                event.target.value = "";
            }

            if (value === "N") {
                var northRoom = Rooms.findOne(Session.get("mainRoom").north);
                if (northRoom) {
                    Meteor.call("move", Session.get("mainRoom"), northRoom);
                    Session.set("mainRoom", Rooms.findOne(northRoom._id));
                }
            }

            if (value === "S") {
                var southRoom = Rooms.findOne(Session.get("mainRoom").south);
                if (southRoom) {
                    Meteor.call("move", Session.get("mainRoom"), southRoom);
                    Session.set("mainRoom", Rooms.findOne(southRoom._id));
                }
            }

            if (value === "E") {
                var eastRoom = Rooms.findOne(Session.get("mainRoom").east);
                if (eastRoom) {
                    Meteor.call("move", Session.get("mainRoom"), eastRoom);
                    Session.set("mainRoom", Rooms.findOne(eastRoom._id));
                }
            }

            if (value === "W") {
                var westRoom = Rooms.findOne(Session.get("mainRoom").west);
                if (westRoom) {
                    Meteor.call("move", Session.get("mainRoom"), westRoom);
                    Session.set("mainRoom", Rooms.findOne(westRoom._id));
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
            return false;
        }
    });
    
    Template.room.helpers({
        hasExits: function () {
            return this.north || this.south || this.east || this.west;
        },

        playerList: function () {
            var mainRoom = Session.get("mainRoom")
            if (mainRoom && this._id === mainRoom._id) {
                return _.without(Rooms.findOne(mainRoom._id).players, Meteor.user().username);
            }
            return null;
        }

    });
    
    Template.room.events({
        
    });   

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Accounts.onLogin(function () {
        Meteor.subscribe("rooms", function () {
            var mainRoom = Rooms.findOne({name: "Market Square"});
            Session.set("mainRoom", mainRoom);
            Meteor.call("addPlayerToRoom", mainRoom);
        });
    });
}


if (Meteor.isServer) {
    
    Meteor.publish("rooms", function () {
        return Rooms.find();
    });
    
    Meteor.startup(function () {
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

    addPlayerToRoom: function (room) {
        room = Rooms.findOne(room._id);
        var playerName = Meteor.user().username;
        if (! _.contains(room.players, playerName)) {
            Rooms.update(room._id, {$set: {players: room.players.concat(playerName)}});
        }
    },

    move: function (fromRoom, toRoom) {
        fromRoom = Rooms.findOne(fromRoom._id);
        toRoom = Rooms.findOne(toRoom._id);
        var playerName = Meteor.user().username;
        console.log("Move " + playerName + " from " + fromRoom.name + " to " + toRoom.name);
        if (_.contains(fromRoom.players, playerName)) {
            Rooms.update(fromRoom._id, {$set: {players: _.without(fromRoom.players, playerName)}});
        }
        if (! _.contains(toRoom.players, playerName)) {
            Rooms.update(toRoom._id, {$set: {players: toRoom.players.concat(playerName)}});
        }
    }
});
