Template.body.helpers({
    currentRoom: function() {
        return Rooms.findOne(Session.get("currentRoomId"));
    },

    northRoom: function() {
        var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
        if (currentRoom && currentRoom.north) {
            return Rooms.findOne(currentRoom.north);
        }
        return null;
    },

    southRoom: function() {
        var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
        if (currentRoom && currentRoom.south) {
            return Rooms.findOne(currentRoom.south);
        }
        return null;
    },

    eastRoom: function() {
        var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
        if (currentRoom && currentRoom.east) {
            return Rooms.findOne(currentRoom.east);
        }
        return null;
    },

    westRoom: function() {
        var currentRoom = Rooms.findOne(Session.get("currentRoomId"));
        if (currentRoom && currentRoom.west) {
            return Rooms.findOne(currentRoom.west);
        }
        return null;
    },

    inCombat: function() {
        return Meteor.user().inCombat;
    }
});

Template.room.helpers({
    hasExits: function() {
        return this.north || this.south || this.east || this.west;
    },

    mobList: function() {
        return Mobs.find({roomId: this._id});
    },

    playerList: function() {
        return _.without(this.players, Meteor.user().username);
        
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
    messages: function() {
        return Messages.find({type: {$ne: "combat"}});
    }
});

Template.combatMessage.rendered = function() {
    $msgDiv = $("#combatMsgBox");
    $msgDiv.scrollTop($msgDiv[0].scrollHeight);
};

Template.combatMsgBox.helpers({
    combatMessages: function() {
        return Messages.find({type: "combat"});
    }
});
