define([], function() {

    if (typeof window == 'undefined') { // is server?
        var vm = require('vm');

        var Code = function Code(src)
        {
            this.script = vm.createScript(src);
        }

        Code.prototype.execute = function(sandbox)
        {
            this.script.runInNewContext(sandbox);
        }
    } else {
        var Code = function Code(src)
        {
            this.src = src;
        }

        Code.prototype.execute = function(sandbox)
        {
            with (sandbox) {
                eval(this.src);
            }
        }
    }

    return Code;
});