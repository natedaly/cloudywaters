Accounts.onCreateUser(function(options, user) {
  user.username = user.username.toLowerCase();
  return user;
});
