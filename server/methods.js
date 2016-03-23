Meteor.methods({
  getStartingRoom: function () {
    return Rooms.findOne({ name: 'Market Square' });
  },

  addPlayerToRoom: function (roomId) {
    var room = Rooms.findOne(roomId);
    if (room) {
      var playerName = Meteor.user().username;
      if (! _.contains(room.players, playerName)) {
        Rooms.update(roomId, {
          $set: { players: room.players.concat(playerName) }
        });
      }
    }
  },

  move: function (fromRoomId, toRoomId) {
    var fromRoom = Rooms.findOne(fromRoomId);
    var toRoom = Rooms.findOne(toRoomId);
    var playerName = Meteor.user().username;
    console.log('Move ' + playerName + ' from ' + fromRoom.name + ' to ' + toRoom.name);
    if (_.contains(fromRoom.players, playerName)) {
      Rooms.update(fromRoomId, {
        $set: { players: _.without(fromRoom.players, playerName) }
      });
    }
    if (! _.contains(toRoom.players, playerName)) {
      Rooms.update(toRoomId, {
        $set: { players: toRoom.players.concat(playerName) }
      });
    }
  },

  showPlayer: function (playerId, message) {
    Messages.insert({ playerId: playerId, type: 'show', message: message });
  },

  showRoom: function (roomId, message) {
    var room = Rooms.findOne(roomId);
    if (_.isObject(room)) {
      _.each(room.players, function (player) {
        Messages.insert({
          playerId: Meteor.users.findOne({ username: player })._id,
          type: 'show',
          message: message
        });
      });
    } else {
      alert('show room error: Unknown id: ' + id);
    }
  },

  say: function (roomId, message) {
    var room = Rooms.findOne(roomId);
    var playerName = Meteor.user().username;

    _.each(room.players, function (player) {
      Messages.insert({
        playerId: Meteor.users.findOne({ username: player })._id,
        type: "say",
        message: (playerName === player ? "You say '" : playerName + " says '") + message + "'"
      });
    });
  },

  kill: function (roomId, target) {
    var room = Rooms.findOne(roomId);
    var playerName = Meteor.user().username;
    var playerId = function (player) {
      return Meteor.users.findOne({ username: player })._id;
    };
    var mob = Mobs.findOne({'name': { $regex: new RegExp(target, 'i') } });
    var roll = function (dice, faces, base) {
      var roll = base;
      _.times(dice, function () { roll += _.random(1, faces); });
      return roll;
    };
    console.log(playerName + ' fighting ' + target);

    if (mob && mob.roomId === roomId) {
      var dam;
      var hps = mob.hitpoints;

      // Enter combat
      Meteor.users.update({ username: playerName }, {
        $set: { inCombat: true }
      });

      var fight = Meteor.setInterval(function () {
        dam = roll(10, 10, 9);
        hps = hps - dam;
        Mobs.update(mob._id, { $set: { hitpoints: hps } });
        console.log(playerName + ' does ' + dam + ' hps of damage, leaving ' +
                    target + ' at ' + hps + ' hps.');

        _.each(room.players, function (player) {
          Messages.insert({
            playerId: playerId(player),
            type: 'combat',
            message: (playerName !== player ? playerName + ' hits ' : 'You hit ') + mob.name + ' pretty hard. [' + hps + ']'
          });
        });

        if (hps < 0) {
          Meteor.clearInterval(fight);
          Mobs.remove(mob._id);
          Meteor.users.update({ username: playerName }, {
            $set: { inCombat: false }
          });
        }
      }, 1000);

      _.each(room.players, function (player) {
        Messages.insert({
          playerId: playerId(player),
          type: 'info',
          message: (playerName !== player ? playerName + ' kills ' : 'You kill ') + mob.name + '.'
        });
      });
    }
  },

  repop: function () {
    if (Mobs.find().count() === 0) {
      Mobs.insert({
        name: 'Sauron',
        hitpoints: 1000,
        roomId: Rooms.findOne({ name: 'Market Square' })._id
      });
    }
  },

  playerLogout: function () {
    var playerName = Meteor.user().username;
    console.log('Logging out ' + playerName);
    _.each(Rooms.find({ players: playerName }).fetch(), function (room) {
      if (_.contains(room.players, playerName)) {
        Rooms.update(room._id, {
          $set: {players: _.without(room.players, playerName)}
        });
      }
    });
  },

  addRoom: function (from, direction, name) {
    console. log("Adding room " + direction + " of '" + from.name + "' called '" + name + "'.");

    var newRoom = {
      name: name,
      desc: 'A brand new room. Use the edit command to change the description.',
      players: []
    };
    newRoom[reverseDir(direction)] = from._id;

    var roomId = Rooms.insert(newRoom);

    var update = { $set: {} };
    update.$set[direction] = roomId;
    Rooms.update(from._id, update);
  },

  editRoom: function (roomId, update) {
    Rooms.update(roomId, { $set: update });
  }

});
