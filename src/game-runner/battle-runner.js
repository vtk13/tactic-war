define(['db.js', 'game-runner/battle.js', 'child_process',
        'game-runner/elo.js'], function(db, Battle, cp, elo) {

    function Runner()
    {
        this.running = false;
    };

    Runner.prototype.getPublishPair = function(cb)
    {
        var sql1 =
            'SELECT publish_id\
               FROM tw_publishes\
              WHERE publish_active=1 AND publish_approved="pending"\
              LIMIT 1';

        var sql2 =
            'SELECT p1.publish_id p1, p2.publish_id p2\
               FROM tw_publishes p1\
                    JOIN tw_publishes p2 ON p1.user_id <> p2.user_id\
                    LEFT JOIN tw_battles b ON b.publish1_id IN (p1.publish_id, p2.publish_id)\
                                          AND b.publish2_id IN (p1.publish_id, p2.publish_id)\
              WHERE b.battle_id IS NULL AND p1.publish_active=1 AND p2.publish_active=1\
                    AND p1.publish_approved="approved" AND p2.publish_approved="approved"\
              LIMIT 1';

        db.query(sql1, function(error, result, fields) {
            if (result.length == 1) {
                // 0 - special case for dummy cohort
                cb(null, result[0].publish_id, 0);
            } else {
                db.query(sql2, function(error, result, fields) {
                    if (result && result.length == 1) {
                        cb(null, result[0].p1, result[0].p2);
                    } else {
                        cb(new Error('No pair to battle'));
                    }
                });
            }
        });
    };

    Runner.prototype.elo = function(publish1, publish2, winner)
    {
        if (winner == publish1) {
            winner = 1;
        } else if (winner == publish2) {
            winner = 2;
        } else {
            winner = 0;
        }

        db.query('SELECT publish_id, publish_rate FROM tw_publishes WHERE publish_id IN (?, ?)',
            [publish1, publish2], function(error, result) {
                var rate1, rate2;
                for (var i in result) {
                    if (result[i].publish_id == publish1) {
                        rate1 = parseFloat(result[i].publish_rate);
                    }
                    if (result[i].publish_id == publish2) {
                        rate2 = parseFloat(result[i].publish_rate);
                    }
                }
                var rates = elo(rate1, rate2, winner);
                db.query('UPDATE tw_publishes SET publish_rate=? WHERE publish_id=?', [rates.rate1, publish1]);
                db.query('UPDATE tw_publishes SET publish_rate=? WHERE publish_id=?', [rates.rate2, publish2]);
            }
        );

        db.query('SELECT publish_id, user_id, user_rate FROM tw_publishes LEFT JOIN tw_users USING(user_id) WHERE publish_id IN (?, ?)',
            [publish1, publish2], function(error, result) {
                var rate1, rate2;
                var user1, user2;
                for (var i in result) {
                    if (result[i].publish_id == publish1) {
                        rate1 = parseFloat(result[i].user_rate);
                        user1 = parseInt(result[i].user_id);
                    }
                    if (result[i].publish_id == publish2) {
                        rate2 = parseFloat(result[i].user_rate);
                        user2 = parseInt(result[i].user_id);
                    }
                }
                var rates = elo(rate1, rate2, winner);
                db.query('UPDATE tw_users SET user_rate=? WHERE user_id=?', [rates.rate1, user1]);
                db.query('UPDATE tw_users SET user_rate=? WHERE user_id=?', [rates.rate2, user2]);
            }
        );
    };

    Runner.prototype.forkApproveBattle = function(p1)
    {
        var time = Date.now(), self = this;
        var n = cp.fork('game-runner/battle-server.js', [], {env: process.env});
        var killTimeout = setTimeout(function() {
            if (n) {
                n.kill('SIGKILL');
                console.log('Timeout');
                db.query('UPDATE tw_publishes \
                             SET publish_approved="rejected"\
                           WHERE publish_id=?', [p1],
                    function() {
                        self.running = false;
                    }
                );
            }
        }, 30000);
        n.on('message', function(result) {
            clearTimeout(killTimeout);
            console.log(result.winner.id == p1 ? 'Approved' : 'Rejected');
            db.query('UPDATE tw_publishes \
                         SET publish_approved=?\
                       WHERE publish_id=?', [result.winner.id == p1 ? 'approved' : 'rejected', p1],
                function(error) {
                    self.running = false;
                }
            );
        });
        n.send({p1: p1, p2: 0});
    };

    Runner.prototype.forkBattle = function(p1, p2, cb)
    {
        var time = Date.now(), self = this;
        var n = cp.fork('game-runner/battle-server.js', [], {env: process.env});
        var killTimeout = setTimeout(function() {
            if (n) {
                n.kill('SIGKILL');
                console.log('Timeout');
                db.query('INSERT INTO tw_battles(publish1_id, publish2_id, winner_id, battle_result, battle_time, battle_replay) ' +
                              'VALUES (?, ?, 0, "timeout", now(), "")',
                    [p1, p2], function() {
                        self.running = false;
                    }
                );
            }
        }, 10000);
        n.on('message', function(result) {
            clearTimeout(killTimeout);
            console.log('Winner ' + result.winner.id);
            db.query('INSERT INTO tw_battles(publish1_id, publish2_id, winner_id, battle_result, battle_time, battle_replay) ' +
                          'VALUES (?, ?, ?, ?, now(), ?)',
                [p1, p2, result.winner.id, 'Done in ' + (Date.now() - time) + 'ms', JSON.stringify(result.gameLog)], function() {
                    self.running = false;
                });
            self.elo(p1, p2, result.winner.id);
        });
        n.send({p1: p1, p2: p2});
    };

    Runner.prototype.run = function()
    {
        if (!this.running) {
            var self = this;
            this.running = true;
            this.getPublishPair(function(error, p1, p2) {
                if (error) {
                    console.log(error);
                    self.running = false;
                } else if (p2 == 0) {
                    console.log('Approve battle for ' + p1);
                    self.forkApproveBattle(p1);
                } else {
                    console.log('Regular battle ' + p1 + ' vs. ' + p2);
                    self.forkBattle(p1, p2);
                }
            });
        }
    };

    return Runner;
});