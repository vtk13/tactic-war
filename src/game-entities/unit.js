define(['game-entities/helpers/unit-interface.js',
        'lib/events.js'], function(UnitInterface, EventEmitter) {
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
        this.proxy = new SafeProxy(this);
    };

    for (var i in EventEmitter.prototype) {
        if (EventEmitter.prototype.hasOwnProperty(i)) {
            Unit.prototype[i] = EventEmitter.prototype[i];
        }
    }

    Unit.prototype._set = function(property, value)
    {
        var event = {};
        event[property] = this[property] = value;
        this.emit('change', event);
    };

    Unit.prototype.setPosition = function(x, y)
    {
        this.x = x;
        this.y = y;
        this.emit('change', {
            x: x,
            y: y
        });
    };

    Unit.prototype.attackDistance   = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.maxHealth        = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.attackPoints     = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.armorPoints      = function() { throw new Error('Subclass responsibility'); };
    Unit.prototype.movePoints       = function() { throw new Error('Subclass responsibility'); };

    Unit.prototype.hit = function(attack)
    {
        this._set('health', this.health - attack - this.armorPoints());
        if (this.health <= 0) {
            this.map.hide(this);
        }
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
        this.actionPoints = this.movePoints();
        if (this.health > 0 && this.tactic) {
            this.tactic.execute(this.sandbox);
        }
    };

    Unit.prototype.canAttack = function(target)
    {
        return this.map.distance(this, target) < this.attackDistance();
    };

    Unit.prototype.move = function(path)
    {
        var direction;
        if (Array.isArray(path)) {
            while ((direction = path.shift()) !== undefined) {
                if (!this.move(direction)) {
                    return false;
                }
            }
            return true;
        } else {
            direction = path;
            if (this.actionPoints) {
                this.map.step(this, direction);
                this.turn(direction);
                this.actionPoints--;
                return true;
            } else {
                return false;
            }
        }
    };

    Unit.prototype.attack = function(target)
    {
        target = this.map.fetch(target);
        if (this.actionPoints && this.canAttack(target)) {
            this.turn(this.map.direction(this, target));
            target.hit(this.attackPoints());
            this.actionPoints = 0;
            return true;
        } else {
            return false;
        }
    };

    Unit.prototype.turn = function(direction)
    {
        this._set('direction', direction);
    };

    function SafeProxy(unit)
    {
        this.id = unit.id;

        this.health = function()
        {
            return unit.health;
        };

        this.type = function()
        {
            return unit.contructor.name;
        };

        this.x = function()
        {
            return unit.x;
        };

        this.y = function()
        {
            return unit.y;
        };
    }

    return Unit;
});