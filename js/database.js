function DB(name, version, display_name, size) {
    var me = this ; // 把this保存下来，以后用_this代替this，这样就不会被this弄晕了
    // private var
    var db = window.openDatabase(name, version, display_name, size);
    // public var
    me.version = 1;
    // privte functions
    
    // 类初始化
    me.init = function() {
        // 数据库初始化
        db.transaction(function(tx) {
            // tx.executeSql('DROP TABLE IF EXISTS topics');
            tx.executeSql('CREATE TABLE IF NOT EXISTS topics (id unique, name, version, data, enabled)');
        }, function(err) {
            alert("初始化数据库失败: " + err.code);
        }, function() {
            console.log("数据库初始化连接成功!");
        });
    };
    me.init();
    // 获取题库信息列表
    me.list = function(callback) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id, name, version, enabled FROM topics', [], function(tx, results) {
                var _result = [];
                for (var i = 0; i < results.rows.length; i++) {
                    _result.push(results.rows.item(i));
                };
                callback && callback(_result);
            }, function(err) {
                alert("获取题库信息列表失败: "+err.code);
            });
        }, function(err) {
            console.error(err);
        });
    }
    // 添加题库
    me.insert = function(id, name, version, data) {
        id = parseInt(id); version = parseInt(version);
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO topics (id, name, version, data, enabled) VALUES (?, ?, ?, ?, 1)', [ id, name, version, data ]);
        }, function(err) {
            console.error(err);
        }, function() {
            
        });
    };
    // 更新题库
    me.update = function(id, name, version, data) {
        id = parseInt(id); version = parseInt(version);
        db.transaction(function(tx) {
            tx.executeSql('UPDATE topics SET name = ?, version = ?, data = ? WHERE id = ?', [ name, version, data, id ]);
        }, function(err) {
            console.error(err);
        }, function() {
            
        });
    };
    // 删除题库
    me.delete = function(id) {
        id = parseInt(id);
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM topics WHERE id = ?', [ id ]);
        }, function(err) {
            console.error(err);
        }, function() {
            
        });
    }
    // 启用题库
    me.enable = function(id) {
        id = parseInt(id);
        db.transaction(function(tx) {
            tx.executeSql('UPDATE topics SET enabled = 1 WHERE id = ?', [ id ]);
        }, function(err) {
            console.error(err);
        }, function() {
            
        });
    }
    // 禁用题库
    me.disable = function(id) {
        id = parseInt(id);
        db.transaction(function(tx) {
            tx.executeSql('UPDATE topics SET enabled = 0 WHERE id = ?', [ id ]);
        }, function(err) {
            console.error(err);
        }, function() {
            
        });
    }
    // 查询题库
    me.select = function(id, callback) {
        id = parseInt(id);
        db.transaction(function(tx) {
            tx.executeSql('SELECT data FROM topics WHERE id = ?', [ id ], function(tx, results) {
                if ( results.rows.length > 0 )
                    callback && callback(results.rows.item(0).data);
            }, function(err) {
                alert("获取题库信息列表失败: "+err.code);
            });
        }, function(err) {
            console.error(err);
        });
    }
}
window.db = new DB("topic", "1.0", "topic_database", 1000000);
// Wait for PhoneGap to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    
}