define(['game-entities/footman.js', 'game-entities/archer.js',
        'game-entities/ballista.js'], function(Footman, Archer, Ballista) {

    return {
        create: function(type, id, tactic, rules) {
            switch (type) {
                case 'footman':
                    return new Footman(id, tactic, rules);
                case 'archer':
                    return new Archer(id, tactic, rules);
                case 'ballista':
                    return new Ballista(id, tactic, rules);
                default:
                    throw new Error('Unknown type "' + type + '"');
            }
        }
    };
});