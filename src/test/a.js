require(['game-entities/map.js'], function(Map) {
    var map = new Map();
    map.add({id: 1}, 4, 4);
    map.add({id: 1}, 4, 5);
    map.add({id: 1}, 5, 4);
    map.add({id: 1}, 4, 6);
    map.add({id: 1}, 6, 4);
    map.add({id: 1}, 5, 6);
    map.add({id: 1}, 6, 5);
    map.add({id: 1}, 6, 6);
    console.profile();
    console.log(map.path({x:0, y: 0}, {x: 5, y: 5}));
    console.profileEnd();
});