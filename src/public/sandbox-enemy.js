define(function() {
    function SandboxEnemy(enemySelect, newGameFunc)
    {
        enemySelect.change(function() {
            newGameFunc(this.value);
        }).change();
    };

    return SandboxEnemy;
});