Template.login.rendered = function () {
  // Make sure the first (only visible) input has the focus to begin with.
  $(document).ready(function () {
    setTimeout(function () {
      $('#login-form input:eq(0)').focus();
    }, 1000);
  });

  // Automatically move the focus to the first input in the login form if
  // the user types something when it's not in focus.
  $(document).keydown(function (event) {
    var input = $('#login-form input:eq(0)');

    if (! $(event.target).is(input) && ! $('body').hasClass('vex-open')) {
      input.focus();
      input.trigger('keydown', { which: event.keyCode });
    }

    return true;
  });
};

Template.login.helpers({
  playerName() {
    return Session.get('playerName');
  }
});

Template.login.events({
  'keydown #player-name': function (event) {
    if (event.which === 13) { // Enter key
      const $target = $(event.target);
      const playerName = $target.val();

      if (playerName.length === 0) return;

      Session.set('playerName', s.capitalize(playerName));
      $target.addClass('hidden');

      // If the player exists, ask for a password, otherwise confirm
      // whether this is a new player or not.
      if (Meteor.users.findOne({ username: playerName })) {
        $('#player-pass').removeClass('hidden').focus();
      } else {
        $('#player-confirm-new').removeClass('hidden').focus();
      }
    }
  },

  'keydown #player-pass': function (event) {
    if (event.which === 13) { // Enter key
      // Log them in.
      Meteor.loginWithPassword(Session.get('playerName'),
                               $(event.target).val(),
                               function (err) {
                                 if (err) {
                                   // The user might not have been found,
                                   // or their password could be
                                   // incorrect. Inform the user that
                                   // their login attempt has failed.
                                 } else {
                                   // The user has been logged in.
                                 }
                               });
    }
  },

  'keydown #player-confirm-new': function (event) {
    const yesKeys = [13, 89];   // 'Enter', 'y'
    const noKeys = [8, 27, 78]; // 'Backspace', 'Escape', 'n'

    if (_.contains(yesKeys, event.which)) {
      event.preventDefault();
      Session.set('newPlayer', true);
    } else if (_.contains(noKeys, event.which)) {
      event.preventDefault();
      Session.clear();
      $('#login-form').trigger('reset');
      $(event.target).addClass('hidden');
      $('#player-name').removeClass('hidden').focus();
    }
  }
});
