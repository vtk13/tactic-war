requirejs(['game-entities/code.js',
    'public/editor.js',
    'public/field-controls.js'], function(Code, Editor, FieldControls) {

    var tactics = [];
    var strategies = [];

    $.getJSON('/code/load', function(code) {
        var codeSelect = $('select[name=tactic]');
        var nameInput = $('input[name=name]');

        for (var i in code.tactic) {
            tactics[code.tactic[i].id] = new Code(code.tactic[i].id,
                code.tactic[i].name,
                code.tactic[i].src);
        }

        for (var i in code.strategy) {
            strategies[code.strategy[i].id] = new Code(code.strategy[i].id,
                code.strategy[i].name,
                code.strategy[i].src);
        };

        var editor = new Editor(codeSelect, nameInput, $('#code-src'),
            $('button#save'), tactics, strategies);

        $('button.step').add('button.restart').add('button.all').add('button.pause').click(function() {
            editor.push();
        });

        var fieldControls = new FieldControls(tactics, strategies);
        editor.setFieldControls(fieldControls);
    });
});
