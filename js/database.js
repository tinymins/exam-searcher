// Wait for PhoneGap to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM topics', [], querySuccess, errorCB);alert(1);
    }

    function querySuccess(tx, results) {
        // this will be empty since no rows were inserted.
        alert("Insert ID = " + results.insertId);
        // this will be 0 since it is a select statement
        alert("Rows Affected = " + results.rowAffected);
        // the number of rows returned by the select statement
        alert("Insert ID = " + results.rows.length);
    }

    function errorCB(err) {
        alert("Error processing SQL: "+err.code);
    }
    
    function populateDB(tx) {
        // tx.executeSql('DROP TABLE IF EXISTS topics');
        tx.executeSql('CREATE TABLE IF NOT EXISTS topics (id unique, name, version, data)');
        tx.executeSql('INSERT INTO topics (id, name, version, data) VALUES (1, "测试题库", 0, \'[window.data = [{"type":"r","title":"\u8425\u4e1a\u7ec8\u4e86\uff0c\u67dc\u5458\u5bf9\u5f53\u65e5\u65e0\u6cd5\u6838\u9500\u7684\u8fc7\u6e21\u8d26\u9879\uff0c\u7ecf\u8fd0\u8425\u4e3b\u7ba1\u5ba1\u6279\uff0c\u767b\u8bb0\uff08 \uff09\u540e\uff0c\u4f5c\u6302\u8d26\u5904\u7406\u3002","keyword":"\u65e5\u7ec8\u5904\u7406","ans":["\u8fd0\u8425\u4e3b\u7ba1\u5de5\u4f5c\u65e5\u5fd7"]}]\'')');
    }

    function successCB() {
        alert("success!");
    }
    var db = window.openDatabase("topic", "1.0", "topic_database", 1000000);
    db.transaction(populateDB, errorCB, successCB);
    db.transaction(queryDB, errorCB);
}