define(function() {
    function CohortInterface(cohort)
    {
        this.test = function(l) {
            cohort.test(l);
        };

        this.log = function(str)
        {
            console.log(str);
        };
    }

    return CohortInterface;
});