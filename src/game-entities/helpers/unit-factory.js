define(['game-entities/footman.js', 'game-entities/archer.js'], function(Footman, Archer) {

    return {
        create: function(type, id, tactic, rules) {
            switch (type) {
                case 'footman':
                    return new Footman(id, tactic, rules);
                case 'archer':
                    return new Archer(id, tactic, rules);
                default:
                    throw new Error('Unknown type ' + type);
            }
        }
    };
});