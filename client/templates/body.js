Template.body.helpers({
  isNewPlayer() {
    return Session.get('newPlayer');
  },

  currentRoom() {
    return getCurrentRoom();
  },

  northRoom() {
    return getAdjacentRoom('north');
  },

  southRoom() {
    return getAdjacentRoom('south');
  },

  eastRoom() {
    return getAdjacentRoom('east');
  },

  westRoom() {
    return getAdjacentRoom('west');
  }
});

Template.body.rendered = function () {
  // Make sure the input prompt has the focus to begin with.
  setTimeout(function () { $('#prompt input[name=command]').focus(); }, 1000);

  // Automatically move the focus to the command prompt if the user types
  // something when it's not in focus. Typing anywhere on the screen should
  // always be sent to the command prompt, unless there is a modal dialog
  // open.
  $(document).keydown(function (event) {
    var prompt = $('#prompt input');

    if (! $(event.target).is(prompt) && ! $('body').hasClass('vex-open')) {
      prompt.focus();
      prompt.trigger('keydown', { which: event.keyCode });
    }

    return true;
  });
};

Template.body.events({
  'input #prompt': function (event) {
    var cmd = event.target.value;

    if (_.contains(['N','S','E','W'], cmd)) {
      event.target.value = '';
      Command.run(cmd);
    }

    return false;
  },

  'submit #prompt': function (event) {
    var input = event.target.command.value.split(' ');
    event.target.command.value = '';
    Command.run(_.first(input), _.rest(input));
    return false;
  },

  'click #logout': function (event) {
    Session.set('playerName', null);
    Accounts.logout();
    Command.run('playerLogout');
  },

  'click #repop': function (event) {
    Command.run('repop');
  }
});
