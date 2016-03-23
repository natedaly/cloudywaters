Tracker.autorun(function () {
  Meteor.subscribe('userData');
});

Tracker.autorun(function () {
  Meteor.subscribe('mobs');
});

Tracker.autorun(function () {
  Meteor.subscribe('rooms', function () {
    if (! Session.get('currentRoomId')) {
      var currentRoom = Rooms.findOne({ name: 'Market Square' });
      Meteor.call('addPlayerToRoom', currentRoom._id);
      Session.setPersistent('currentRoomId', currentRoom._id);
    }
  });
});

Tracker.autorun(function () {
  Meteor.subscribe('messages', Session.get('currentRoomId'));
});
