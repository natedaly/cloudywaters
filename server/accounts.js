Accounts.onCreateUser(function(options, user) {
    console.log(user);
    console.log(options);
    user.username = user.username.toLowerCase();
    return user;
});
