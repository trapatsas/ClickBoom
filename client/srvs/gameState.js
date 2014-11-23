/**
 * Created by belonious on 16/11/2014.
 */
var cursorPoint = function (evt){
    var svg = document.getElementById('playArea');
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
};
var handleBoom = function (id) {

    var wounded = Meteor.users.findOne({_id: Clicks.findOne({_id: id}).owner});
    if (Meteor.userId() === wounded._id) {
        Meteor.users.update({_id: Meteor.userId()}, {$inc : {'profile.score': -1}});
        Session.set('hit', 'HHAHAHAHA YOU HIT YOUR SELF ')
    }
    else {
        Meteor.users.update({_id: Meteor.userId()}, {$inc : {'profile.score': 1}});
        Session.set('hit', 'Your last hit was on ' + wounded.emails[0].address)
    }

};
var drawFuncs = {
    setShip: function(evt, pointId){
        var loc = cursorPoint(evt);
        Clicks.update({_id: pointId}, {$set:{cx:loc.x, cy:loc.y}});
    },
    setBomb: function (evt) {
        if (evt.target.nodeName === 'circle') {
            handleBoom(evt.target.id);
        }
    }
};
var messages = {
    setShip: {msg:'Place your ship', col: 'yellow'},
    setBomb: {msg:'Bomb someone!', col: 'green'}
};

Session.setDefault('gameState', 'setShip');
Session.setDefault('msg', messages.setShip);
Session.setDefault('score', 0);

var handler = function (event, pointId) {
    drawFuncs[Session.get('gameState')](event, pointId);
    var newGS = (Session.get('gameState') === 'setShip' ? 'setBomb' : 'setShip');
    Session.set('gameState', newGS);
    Session.set('msg', messages[newGS]);
};

gameState = {
    getState: function(){
        return Session.get('gameState');
    },
    canvasClickHandler: handler
};