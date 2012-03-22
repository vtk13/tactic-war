define(['game-entities/helpers/unit-interface.js'], function(UnitInterface) {
    /**
     *
     * @param tactic Code
     */
    function Footman(tactic)
    {
        this.tactic = tactic;
        this.actionQueue = [];
        this.stepPoints = 10; // action points per step
        this.sandbox = new UnitInterface(this);
    }

    Footman.prototype.step = function()
    {
        this.tactic.execute(this.sandbox);
        var action = this.actionQueue.shift();
        // todo
//        console.log(action);
    }

    Footman.prototype.move = function()
    {
        this.actionQueue.push({action: 'move', 'point': 10});
    }

    return Footman;
});