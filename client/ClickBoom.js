Meteor.subscribe("allusers");
// http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor

//$(window).bind('beforeunload', function() {
//  return 'Do you want to leave?';
//});



var randomColor = function () {
    var ColorsList = Colors.find({isAvailable:true}).fetch();
    return ColorsList[Math.floor( Math.random() * ColorsList.length)];
};

var onUserLogin = function () {
    console.log('I just Logged In!');
    var newColor = randomColor();
    var currentUser = Meteor.user();


    Colors.update({_id: newColor._id}, {$set: {isAvailable:false}});
    Meteor.users.update({_id:currentUser._id}, {$set: { 'profile.color': newColor.name}});
    console.dir(currentUser);
};

var destroyUser = function () {
    console.log('Bye Bye!');
    var currentUser = Meteor.user();
    Colors.update({_id: Colors.findOne({name: currentUser.profile['color']})._id}, {$set: {isAvailable:true}});
    currentUser.profile['color'] = null;
    Clicks.remove({_id: Clicks.findOne({owner: currentUser._id})._id});
    Meteor.logout();
};

$(window).bind('unload', function() {
    destroyUser();
});


Template.play.rendered = function () {
    var pointId;
    if(!Clicks.findOne({owner: Meteor.userId()})){
        pointId = Clicks.insert(
            {
                owner: Meteor.userId(),
                cx: 0,
                cy: 0,
                color: Meteor.user().profile['color']
            });
    } else {
        pointId = Clicks.findOne({owner: Meteor.userId()})._id;
    }
    var svg = document.getElementById('playArea');
    svg.addEventListener('click',function(evt){
        gameState.canvasClickHandler(evt, pointId);
    },false);
};

Template.play.helpers({
    shapes: function () {
        return Clicks.find();
    }
});

Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        // code goes here
        destroyUser();
    }
});

Template.dashboard.helpers({
    directory: function () {
        return Meteor.users.find({}, {sort: {'profile.score': -1}});
    },
    curS: function () {
        return Session.get('msg')
    },
    score: function () {
        return Session.get('score');
    },
    hit: function () {
        return Session.get('hit');
    }
});

Template.login.events({
    'submit #login-form': function(event, template){
        event.preventDefault();
        var emailVar = template.find('#login-email').value;
        var passwordVar = template.find('#login-password').value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(err){
            if (err) {
                console.log('Error Logging In!');
                console.dir(err);
            }
            else
                onUserLogin();
        });
    }
});

Template.register.events({
    'submit #register-form': function(event, template){
        event.preventDefault();
        var emailVar = template.find('#register-email').value;
        var passwordVar = template.find('#register-password').value;
        var options = {
            email: emailVar,
            password: passwordVar,
            profile: {
                color: 'orange',
                createdAt: new Date,
                score: 0
            }
        };
        Accounts.createUser( options , function(err){
            if (err) {
                console.log('Error Creating User!');
                console.dir(err);
            }
            else
                onUserLogin();
        });
    }
});