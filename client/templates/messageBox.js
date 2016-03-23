Template.messageBox.helpers({
  messages: function () {
    return Messages.find();
  }
});

// Keep the messageBox scrolled to the bottom so that new messages are
// always visible.
Template.message.rendered = function () {
  var msgDiv = $('#messages');
  msgDiv.scrollTop(msgDiv[0].scrollHeight);
};
