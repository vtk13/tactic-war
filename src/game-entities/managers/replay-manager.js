define(['db.js'], function(db) {
    return {
        list: function(publishId, cb) {
            var sql = 'SELECT b.*, p1.publish_name publish1_name, p1.publish_rate publish1_rate,' +
                            ' p2.publish_name publish2_name, p2.publish_rate publish2_rate ' +
                'FROM tw_battles b ' +
                    ' JOIN tw_publishes p1 ON b.publish1_id=p1.publish_id ' +
                    ' JOIN tw_publishes p2 ON b.publish2_id=p2.publish_id ' +
  (publishId ? 'WHERE ? IN (b.publish1_id, b.publish2_id)' : '') +
            'ORDER BY battle_time DESC ' +
               'LIMIT 10'; // todo
            db.query(sql, publishId ? [publishId] : [], function(err, result) {
                var replays = [];
                for (var i in result) {
                    replays.push({
                        id: result[i].battle_id,
                        time: result[i].battle_time,
                        result: result[i].battle_result,
                        publish1Name: result[i].publish1_name,
                        publish2Name: result[i].publish2_name,
                        publish1Rate: result[i].publish1_rate,
                        publish2Rate: result[i].publish2_rate
                    });
                }
                cb(replays);
            });
        }
    }
});