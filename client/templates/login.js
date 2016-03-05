Template.login.helpers({
    playerName: function() {
        return Session.get('playerName');
    }
});

Template.login.created = function() {
    // Make sure the first (only visible) input has the focus to begin with.
    $(document).ready(function() {
        setTimeout(function () {
            $('#loginForm input:eq(0)').focus();
        }, 1000);
    });

    // Automatically move the focus to the first input in the login form if
    // the user types something when it's not in focus.
    $(document).keydown(function(event) {
        var input = $('#loginForm input:eq(0)');

        if (! $(event.target).is(input) && ! $('body').hasClass('vex-open')) {
            input.focus();
            input.trigger('keydown', { which: event.keyCode });
        }

        return true;
    });
};

Template.login.events({
    'keydown #playerName': function(event) {
        if (event.which === 13) { // Enter key
            event.preventDefault();
            var playerName = $(event.target).val();
            if (playerName.length > 0) {
                Session.set('playerName', s.capitalize(playerName, true));
                setTimeout(function () {
                    $('#playerPass').focus();
                }, 0);
            }
        }
    },

    'keydown #playerPass': function(event) {
        if (event.which === 13) { // Enter key
            event.preventDefault();
            // Log them in.
            Meteor.loginWithPassword(Session.get('playerName'),
                                     $('#playerPass').val(),
                                     function(err) {
                                         if (err) {
                                             // The user might not have been found,
                                             // or their passwword could be
                                             // incorrect. Inform the user that
                                             // their login attempt has failed.
                                         } else {
                                             // The user has been logged in.
                                         }
                                     });
        }
    }
});
