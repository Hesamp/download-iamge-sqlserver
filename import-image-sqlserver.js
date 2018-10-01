const download = require('image-downloader');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const fs = require('fs');
// module.exports = function (config, sqript) {
// Create connection to database
const config = {
    userName: 'sa',
    password: 'password',
    server: 'localhost',
}
const connection = new Connection(config);
const server = 'http://localhost:3000'
const table = 'test';
const query = `SELECT  * FROM ${table} where FilePath LIKE '\\Images%'`

function Read(callback) {

    // Read all rows from table
    request = new Request(
        query,
        function (err, rowCount, rows) {
            if (err) {
                console.log(err);
                // callback(err);
            } else {
                console.log(rowCount + ' row(s) returned');
                // callback(null);
            }
        });

    // Print the rows read
    let result = "";
    let dataRows = [];
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += ':' + column.value //+ " ";
            }
        });
        // console.log(result);
        let item = result.split(':');

        let path = item[2].split('\\');
        const eachRow = {
            id: item[1],
            path: item[2],
            filename: path[3]
        }

        dataRows.push(eachRow);

        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}
// Attempt to connect and execute queries if connection goes through
connection.on('connect', async function (err, df) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
    }
    await Read()
});
// }