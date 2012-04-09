define(['game-entities/helpers/unit-interface.js'], function(UnitInterface) {
    /**
     *
     * @param tactic Code
     */
    function Unit(id, tactic, rules)
    {
        if (arguments.length == 0) {
            return;
        }
        this.id = id;
        this.tactic = tactic;
        this.rules = rules;
        this.lives = this.maxLives();
        this.target = null;

        this.actionQueue = [];
        this.sandbox = new UnitInterface(this);
    };

    Unit.prototype._set = function(property, value)
    {
        this[property] = value;
    };

    Unit.prototype.attackDistance   = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.maxLives         = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.attackPoints     = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.armorPoints      = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.speedPoints      = function() { throw new Error('Subclass responsibility'); };

    Unit.prototype.hit = function(attack)
    {
        this._set('lives', this.lives - attack - this.armorPoints());
    };

    Unit.prototype.setTarget = function(unit)
    {
        this.target = unit;
    };

    Unit.prototype.step = function()
    {
        if (!this.tactic) return;
        this.tactic.execute(this.sandbox);
        var actions = 1;
        while (actions) {
            var action = this.actionQueue.shift();
            if (action) {
                switch (action.action) {
                    case 'move':
                        this._doMove(action);
                        actions--;
                        break;
                    case 'attack':
                        this._doAttack(action);
                        actions--;
                        break;
                    case 'turn':
                        this._set('direction', action.direction);
                        // costs nothing so no "actions--"
                        break;
                }
            } else {
                break;
            }
        }
    };

    Unit.prototype._doMove = function(action)
    {
        var distance = action.distance;
        var speed = this.speedPoints();
        if (action.distance > speed) {
            action.distance = action.distance - speed;
            this.actionQueue.unshift(action);
            distance = speed;
        }
        this.map.move(this, distance);
    };

    Unit.prototype._doAttack = function(action)
    {
        var target = action.target;
        if (this.canAttack(target)) {
            this._set('direction', this.map.direction(this, action.target));
            target.hit(this.attackPoints());
        }
    };

    Unit.prototype.canAttack = function(target)
    {
        return this.map.distance(this, target) < this.attackDistance();
    };

    Unit.prototype.move = function(distance)
    {
        if (distance > 0) {
            this.actionQueue.push({action: 'move', distance: distance});
        }
    };

    Unit.prototype.attack = function(target)
    {
        this.actionQueue.push({action: 'attack', target: this.map.fetch(target)});
    };

    Unit.prototype.turn = function(direction)
    {
        this.actionQueue.push({action: 'turn', direction: direction});
    };

    return Unit;
});