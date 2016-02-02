// Returns the user object for the current player.
currentPlayer = function() {
    return Meteor.user();
}

// Returns the Id for the current player.
currentPlayerId = function() {
    return Meteor.userId();
}

// Sets the current room given a roomId.
setCurrentRoom = function(roomId) {
    Session.setPersistent("currentRoomId", roomId);
};

// Returns the Id for the room the player is currently in.
getCurrentRoomId = function() {
    return Session.get("currentRoomId");
};

// Returns the room object for the room the player is currently in.
getCurrentRoom = function() {
    return Rooms.findOne(getCurrentRoomId());
};

// Returns an adjacent room in the specified direction from the current
// room, or null if there isn't a room in that direction.
getAdjacentRoom = function(direction) {
    var currentRoom = getCurrentRoom();
    if (currentRoom && _.has(currentRoom, direction)) {
        return Rooms.findOne(currentRoom[direction]);
    }
    return null;
};

// Given a direction string, returns the opposite direction string.
reverseDir = function(direction) {
    if (direction === 'north') return 'south';
    if (direction === 'south') return 'north';
    if (direction === 'west') return 'east';
    if (direction === 'east') return 'west';
    if (direction === 'up') return 'down';
    if (direction === 'down') return 'up';
};
