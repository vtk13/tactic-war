$(function() {
    var coins;

    function setCoins(value)
    {
        coins = value;
        $('.coins .value').text(coins);
    };

    $('select.category').change(function() {
        $('.rule-desc').hide();
        $('.rule' + this.value + '-desc').show();
        setCoins(100);
    }).change();

    $('.create-units .footman').click(function() {
        if (coins >= 20) {
            var div = $('<div class="footman"/>');
            div.append($('img', this).clone());
            div.append('<input type="hidden" name="units[]" value="footman"/>');
            $('.create-field').append(div);
            setCoins(coins - 20);
        }
    });
    $('.create-units .archer').click(function() {
        if (coins >= 25) {
            var div = $('<div class="archer"/>');
            div.append($('img', this).clone());
            div.append('<input type="hidden" name="units[]" value="archer"/>');
            $('.create-field').append(div);
            setCoins(coins - 25);
        }
    });

    $('.create-field .footman').live('click', function() {
        $(this).remove();
        setCoins(coins + 20);
    });
    $('.create-field .archer').live('click', function() {
        $(this).remove();
        setCoins(coins + 25);
    });
});