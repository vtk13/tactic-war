define(['game-entities/code.js'], function(Code) {
    function Editor(codeSelect, nameInput, textarea, cohort, tactics, strategies)
    {
        this.codeSelect = codeSelect;
        this.nameInput = nameInput;
        this.cohort = cohort;
        this.code = null;
        this.lastSrc = null;
        this.currentUnit = null;
        this.codeMirror = CodeMirror.fromTextArea(textarea.get(0), {
            mode: 'javascript'
        });

        codeSelect.append('<optgroup type="strategy" label="Strategies"/>');
        var group = codeSelect.find('optgroup[label=Strategies]');
        for (var i in strategies) {
            group.append('<option type="strategy" value="' + strategies[i].id + '">' + strategies[i].name + '</option>');
        }
        group.append('<option type="strategy" value="new">Create new strategy...</option>');

        codeSelect.append('<optgroup type="tactic" label="Tactics"/>');
        var group = codeSelect.find('optgroup[label=Tactics]');
        for (var i in tactics) {
            group.append('<option type="tactic" value="' + tactics[i].id + '">' + tactics[i].name + '</option>');
        }
        group.append('<option type="tactic" value="new">Create new tactic...</option>');

        var self = this;
        nameInput.change(function() {
            var codeId = codeSelect.val();
            if (tactics[codeId]) {
                tactics[codeId].name = this.value;
            } else {
                strategies[codeId].name = this.value;
            }
            codeSelect.find('option[value='+codeId+']').text(this.value);
            self.push();
        });

        codeSelect.change(function() {
            var type = $(this).find('*[value=' + this.value + ']').attr('type');
            if (this.value == 'new') {
                var code = new Code(null, 'new code...', '');
                $.post('/code/create', {
                    type: type,
                    name: code.name,
                    src: code.src
                }, function(id) {
                    code.id = id;
                    type == 'tactic' ? tactics[id] = code : strategies[id] = code;
                    codeSelect.find('optgroup[type=' + type + '] option[value=new]').before('<option type="' + type + '" value="'+id+'">' + code.name + '</option>');
                    codeSelect.val(id);
                    self.setCode(code, type);
                });
            } else {
                self.setCode(type == 'tactic' ? tactics[this.value] : strategies[this.value], type);
            }
        }).change();
    };

    Editor.prototype.load = function(code)
    {
        this.push();
        this.code = code;
        this.codeMirror.setValue(code.src);
    };

    Editor.prototype.push = function()
    {
        if (this.code && this.code.src != this.lastSrc) {
            var code = this.code;
            code.src = this.codeMirror.getValue();
            $.post('/code/' + code.id + '/edit', {
                name: code.name,
                src: code.src
            });
        }
    };

    Editor.prototype.close = function()
    {
        this.push();
    };

    Editor.prototype.setCode = function(code, type)
    {
        this.nameInput.val(code.name);
        this.codeSelect.val(code.id);
        this.load(code);

        if (type == 'strategy') {
            this.setUnit(null);
            if (this.cohort.strategy != code) {
                $.post('/cohort/' + this.cohort.id + '/edit', {
                    strategy_id: code.id
                });
                this.cohort.strategy = code;
            }
        } else {
            if (this.currentUnit && this.currentUnit.tactic != code) {
                $.post('/unit/' + this.currentUnit.id + '/edit', {
                    tactic_id: code.id
                });
                this.currentUnit.tactic = code;
            }
        }

        this.lastSrc = code.src;
    };

    Editor.prototype.setUnit = function(unit)
    {
        if (this.currentUnit != unit) {
            if (this.currentUnit) {
                this.currentUnit._set('selected', false);
            }
            this.currentUnit = unit;
            if (unit) {
                unit._set('selected', true);
                if (unit.tactic && unit.tactic.id) {
                    this.setCode(unit.tactic);
                }
            }
        }
    };

    return Editor;
});