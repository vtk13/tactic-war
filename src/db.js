define(['mysql'], function(mysql) {
    var client = mysql.createClient({
        user: 'tactic',
        password: 'tactic'
    });

    client.query('USE `tactic-wars`');

    return client;
});