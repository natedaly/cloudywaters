Template.room.helpers({
  hasExits: function () {
    return !! (this.north || this.south || this.east || this.west);
  },

  mobList: function () {
    return Mobs.find({ roomId: this._id });
  },

  playerList: function () {
    return _.without(this.players, Meteor.user().username);

    var currentRoomId = Session.get('currentRoomId');
    if (this._id === currentRoomId) {
      var currentRoom = Rooms.findOne(currentRoomId);
      if (currentRoom) {
        return _.without(currentRoom.players, Meteor.user().username);
      }
    }
    return null;
  }
});
