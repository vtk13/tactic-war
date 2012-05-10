define([], function() {

    if (typeof window == 'undefined') { // is server?
        var vm = require('vm');

        var Code = function Code(id, name, src)
        {
            this.id = id;
            this.name = name;
            this.src = src;
            this.script = vm.createScript(src);
        }

        Code.prototype.execute = function(sandbox)
        {
            try {
                this.script.runInNewContext(sandbox);
            } catch (err) {
                console.log(this.src);
                throw err;
            }
        }
    } else {
        var Code = function Code(id, name, src)
        {
            this.id = id;
            this.name = name;
            this.src = src;
        }

        Code.prototype.execute = function(sandbox)
        {
            with (sandbox) {
                try {
                    eval(this.src);
                } catch (err) {
                    console.log(this.src);
                    throw err;
                }
            }
        }
    }

    return Code;
});