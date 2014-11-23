Meteor.startup(function () {

    Colors.remove({});
    Clicks.remove({});
    Meteor.users.remove({});
    Meteor.users.insert({})

    if(Colors.find().count() === 0) {
        ['red', 'brown', 'green', 'blue', 'orange'].forEach(function (c) {
            Colors.insert({
                name: c,
                isAvailable: true
            })
        });
    }
});

Meteor.publish("allusers", function () {
    return Meteor.users.find({}, {});
});

Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile;
    return user;
});