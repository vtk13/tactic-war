define(function() {
    function S(player, winner)
    {
        if (winner == 0) {
            return 0.5;
        }
        if (player == winner) {
            return 1;
        } else {
            return 0;
        }
    }

    function K(rate)
    {
        switch (true) {
            case rate > 2400:
                return 10;
            case rate > 1600:
                return 15;
            default:
                return 30;
        }
    }

    /**
     * @param winner 0,1 или 2. 0 - ничья
     */
    return function(rate1, rate2, winner) {
        var e1 = 1 / (1 + Math.pow(10, ((rate2 - rate1) / 400)));
        var e2 = 1 / (1 + Math.pow(10, ((rate1 - rate2) / 400)));

        var newRate1 = rate1 + K(rate1) * (S(1, winner) - e1);
        var newRate2 = rate2 + K(rate2) * (S(2, winner) - e2);

        return {
            rate1: newRate1,
            rate2: newRate2
        };
    };
});