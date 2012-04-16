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
        this.health = this.maxHealth();
        this.target = null;

        this.actionPoints = 1;
        this.sandbox = new UnitInterface(this);
    };

    Unit.prototype._set = function(property, value)
    {
        this[property] = value;
    };

    Unit.prototype.attackDistance   = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.maxHealth        = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.attackPoints     = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.armorPoints      = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.speedPoints      = function() { throw new Error('Subclass responsibility'); };

    Unit.prototype.hit = function(attack)
    {
        this._set('health', this.health - attack - this.armorPoints());
    };

    Unit.prototype.setTarget = function(unit)
    {
        this.target = unit;
    };

    Unit.prototype.setCommand = function(command)
    {
        this.command = command;
    };

    Unit.prototype.step = function()
    {
        this.actionPoints = 1;
        if (this.tactic) {
            this.tactic.execute(this.sandbox);
        }
    };

    Unit.prototype.canAttack = function(target)
    {
        return this.map.distance(this, target) < this.attackDistance();
    };

    Unit.prototype.move = function(distance)
    {
        if (this.actionPoints && distance > 0) {
            distance = Math.min(distance, this.speedPoints());
            this.map.move(this, distance);
            this.actionPoints--;
        }
    };

    Unit.prototype.attack = function(target)
    {
        target = this.map.fetch(target);
        if (this.actionPoints && this.canAttack(target)) {
            this.turn(this.map.direction(this, target));
            target.hit(this.attackPoints());
            this.actionPoints--;
        }
    };

    Unit.prototype.turn = function(direction)
    {
        this._set('direction', direction);
    };

    return Unit;
});