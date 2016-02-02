Template.body.helpers({
    currentRoom: getCurrentRoom,

    northRoom: function() {
        return getAdjacentRoom('north');
    },

    southRoom: function() {
        return getAdjacentRoom('south');
    },

    eastRoom: function() {
        return getAdjacentRoom('east');
    },

    westRoom: function() {
        return getAdjacentRoom('west');
    }
});

Template.body.created = function() {
    // Make sure the input prompt has the focus to begin with.
    setTimeout(1000, function () {
        $('#prompt input[name=command]').focus();
    });

    // Automatically move the focus to the command prompt if the user types
    // something when it's not in focus. Typing anywhere on the screen should
    // always be sent to the command prompt.
    $(document).keydown(function(event) {
        var prompt = $('#prompt input');
        if (! $(event.target).is(prompt)) {
            prompt.focus();
            prompt.trigger('keydown', { which: event.keyCode });
        }
    });
};

Template.body.events({
    "input #prompt": function(event) {
        var cmd = event.target.value;

        if (_.contains(['N','S','E','W'], cmd)) {
            event.target.value = "";
            Command.run(cmd);
        }
    },

    "submit #prompt": function(event) {
        var input = event.target.command.value.split(' ')
        event.target.command.value = '';
        Command.run(_.first(input), _.rest(input));
        return false;
    },

    'click #repop': function(event) {
        Command.run('repop');
    }
});
