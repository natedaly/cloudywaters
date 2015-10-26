Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
                                 {fields: {'inCombat': 1}});
    } else {
        this.ready();
    }
});

Meteor.publish("rooms", function() {
    return Rooms.find();
});

Meteor.publish("mobs", function() {
    return Mobs.find();
});

Meteor.publish("messages", function() {
    return Messages.find({playerId: this.userId});
});
