define(['game-entities/helpers/unit-interface.js'], function(UnitInterface) {
    /**
     *
     * @param tactic Code
     */
    function Footman(tactic, rules)
    {
        this.id = Math.round(Math.random() * 1000);
        this.tactic = tactic;
        this.rules = rules;
        this.lives = this.maxLives();

        this.actionQueue = [];
        this.sandbox = new UnitInterface(this);
    };

    Footman.prototype._set = function(property, value)
    {
        this[property] = value;
    };

    Footman.prototype.attackDistance = function()
    {
        return this.rules.footmanAttackDistance();
    };

    Footman.prototype.maxLives = function()
    {
        return this.rules.footmanLives();
    };

    Footman.prototype.hit = function(attack)
    {
        this._set('lives', this.lives - attack - this.rules.footmanArmor());
    };

    Footman.prototype.setTarget = function(unit)
    {
        this.target = unit;
    };

    Footman.prototype.step = function()
    {
        this.tactic.execute(this.sandbox);
        var actions = 1;
        while (actions) {
            var action = this.actionQueue.shift();
            if (action) {
                switch (action.action) {
                    case 'move':
                        var distance = action.distance;
                        var speed = this.rules.footmanSpeed();
                        if (action.distance > speed) {
                            action.distance = action.distance - speed;
                            this.actionQueue.unshift(action);
                            distance = speed;
                        }
                        this.map.move(this, distance);
                        actions--;
                        break;
                    case 'attack':
                        var target = action.target;
                        if (this.canAttack(target)) {
                            target.hit(this.rules.footmanAttack());
                        }
                        actions--;
                        break;
                    case 'turn':
                        this._set('direction', action.direction);
                        // costs nothing so no "actions--"
                        break;
                }
            }
        }
    };

    Footman.prototype.canAttack = function(target)
    {
        return this.map.distance(this, target) < this.rules.footmanAttackDistance();
    };

    Footman.prototype.move = function(distance)
    {
        this.actionQueue.push({action: 'move', distance: distance});
    };

    Footman.prototype.attack = function(target)
    {
        this.actionQueue.push({action: 'attack', target: this.map.fetch(target)});
    };

    Footman.prototype.turn = function(direction)
    {
        this.actionQueue.push({action: 'turn', direction: direction});
    };

    return Footman;
});