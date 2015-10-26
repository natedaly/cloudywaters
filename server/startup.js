Meteor.startup(function() {
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

    // If there are no mobs, create an initial population for testing.
    if (Mobs.find().count() === 0) {
        Mobs.insert({
            name: "Sauron",
            hitpoints: 1000,
            roomId: Rooms.findOne({name: "Market Square"})._id
        });
    }
});

