Meteor.publish('userData', function () {
  return Meteor.users.find({}, { username: 1, inCombat: 1 });
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
