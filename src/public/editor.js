define(['game-entities/code.js'], function(Code) {
    var dirty = false;

    window.onbeforeunload = function()
    {
        if (dirty) {
            return 'Код не сохранен!';
        }
    };

    function Editor(codeSelect, nameInput, textarea, saveButton, cohort, tactics, strategies)
    {
        var self = this;

        this.codeSelect = codeSelect;
        this.nameInput = nameInput;
        this.cohort = cohort;
        this.code = null;
        this.currentUnit = null;
        this.codeMirror = CodeMirror.fromTextArea(textarea.get(0), {
            mode: 'javascript',
            onChange: function()
            {
                self.setDirty(true);
            }
        });

        this.setDirty = function(val) {
            if (dirty != val) {
                dirty = val;
                if (val) {
                    saveButton.removeAttr('disabled');
                } else {
                    saveButton.attr('disabled', 'disabled');
                }
            }
        };
        this.setDirty(false);

        codeSelect.append('<optgroup type="strategy" label="Strategies"/>');
        var group = codeSelect.find('optgroup[label=Strategies]');
        for (var i in strategies) {
            group.append('<option type="strategy" value="' + strategies[i].id + '">' + strategies[i].name + '</option>');
        }
        group.append('<option type="strategy" value="newstrategy">Create new strategy...</option>');

        codeSelect.append('<optgroup type="tactic" label="Tactics"/>');
        var group = codeSelect.find('optgroup[label=Tactics]');
        for (var i in tactics) {
            group.append('<option type="tactic" value="' + tactics[i].id + '">' + tactics[i].name + '</option>');
        }
        group.append('<option type="tactic" value="newtactic">Create new tactic...</option>');
        if (cohort.strategy) {
            codeSelect.val(cohort.strategy.id);
        }

        nameInput.change(function() {
            var codeId = codeSelect.val();
            if (parseInt(codeId)) {
                if (tactics[codeId]) {
                    tactics[codeId].name = this.value;
                } else {
                    strategies[codeId].name = this.value;
                }
                codeSelect.find('option[value='+codeId+']').text(this.value);
                self.push();
            }
        });

        codeSelect.change(function() {
            if (this.value == 'none') {
                self.setCode(null);
                self.setDirty(false);
                return;
            }
            var type = $(this).find('*[value=' + this.value + ']').attr('type');
            if ({'newtactic': 1, 'newstrategy': 1}[this.value]) {
                var code = new Code(null, 'new ' + type + '...', '');
                $.post('/code/create', {
                    type: type,
                    name: code.name,
                    src: code.src
                }, function(id) {
                    code.id = id;
                    type == 'tactic' ? tactics[id] = code : strategies[id] = code;
                    codeSelect.find('option[value=new' + type + ']').before('<option type="' + type + '" value="'+id+'">' + code.name + '</option>');
                    codeSelect.val(id);
                    self.setCode(code, type);
                });
            } else {
                self.setCode(type == 'tactic' ? tactics[this.value] : strategies[this.value], type);
            }
        }).change();

        saveButton.click(function(){
            self.push();
        });
    };

    Editor.prototype.load = function(code)
    {
        this.push();
        this.code = code;
        if (code) {
            this.codeMirror.setValue(code.src);
            this.nameInput.val(code.name);
            this.codeSelect.val(code.id);
            this.setDirty(false);
            this.codeMirror.setOption('readOnly', false);
        } else {
            this.codeMirror.setValue('');
            this.nameInput.val('');
            this.codeSelect.val('none');
            this.codeMirror.setOption('readOnly', true);
        }
    };

    Editor.prototype.push = function()
    {
        if (this.code) {
            var code = this.code;
            code.src = this.codeMirror.getValue();
            $.post('/code/' + code.id + '/edit', {
                name: code.name,
                src: code.src
            });
            this.setDirty(false);
        }
    };

    Editor.prototype.close = function()
    {
        this.push();
    };

    Editor.prototype.setCode = function(code, type)
    {
        this.load(code);

        if (type == 'strategy') {
            this.setUnit(null);
            if (this.cohort.strategy != code) {
                $.post('/cohort/' + this.cohort.id + '/edit', {
                    strategy_id: code.id
                });
                this.cohort.strategy = code;
            }
        } else if (code) {
            if (this.currentUnit && this.currentUnit.tactic != code) {
                $.post('/unit/' + this.currentUnit.id + '/edit', {
                    tactic_id: code.id
                });
                this.currentUnit.tactic = code;
            }
        }
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
                } else {
                    this.setCode(null);
                }
            }
        }
    };

    return Editor;
});