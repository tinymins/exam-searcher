// Wait for PhoneGap to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM topic', [], querySuccess, errorCB);alert(1);
    }

    function querySuccess(tx, results) {
        // this will be empty since no rows were inserted.
        console.log("Insert ID = " + results.insertId);
        // this will be 0 since it is a select statement
        console.log("Rows Affected = " + results.rowAffected);
        // the number of rows returned by the select statement
        console.log("Insert ID = " + results.rows.length);
    }

    function errorCB(err) {
        alert("Error processing SQL: "+err.code);
    }
    var db = window.openDatabase("topic", "1.0", "topic_database", 1000000);
    db.transaction(queryDB, errorCB);
}