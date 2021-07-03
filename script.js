// Initial requirements for the back-end and especially 
// for database connection and CRUD operations
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

var app = express();

//Configuring express server
app.use(bodyparser.json());

// MySQL details
// Here one can connect with the database using their credentials
// Credentials here are empty for the safety reasons
// Moreover, credentials can be obtained using different separate config file
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kush',
    database: 'mydb',
    multipleStatements: true
});

// Establishes the conenction with the database
// Based on given credentials
// Give error if anything wrong while connecting with database
mysqlConnection.connect((err)=> {
    if(!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

// Establish the server connection
// PORT ENVIRONMENT VARIABLE 
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

// Creating GET Router to fetch all the buyers details from the MySQL Database
app.get('/buyers' , (req, res) => {
    mysqlConnection.query('SELECT * FROM buyers', (err, rows, fields) => {
    if (!err)
        res.send(rows);
    else
        console.log(err);
    })
});

// Router to GET specific buyer detail from the MySQL database
app.get('/buyers/:id' , (req, res) => {
    mysqlConnection.query('SELECT * FROM buyers WHERE BuyerID = ?',[req.params.id], (err, rows, fields) => {
    if (!err)
        res.send(rows);
    else
        console.log(err);
    })
});

// Router to INSERT/POST a buyer's detail
// Here we have used 'Procedures' in MySQL which will be there in separate folder (To analyse the Proceduress)
app.post('/buyers', (req, res) => {
    let buyer = req.body;
    var sql = "SET @BuyerID = ?;SET @Name = ?;SET @Address = ?;SET @City = ?; SET @Province = ?; SET @Pincode = ?; SET @MobileNo = ?; SET @Email = ?; CALL BuyersInsertUpdate(@BuyerID,@Name,@Address,@City,@Province,@Pincode,@MobileNo,@Email);";
    mysqlConnection.query(sql, [buyer.BuyerID,buyer.Name,buyer.Address,buyer.City,buyer.Province,buyer.Pincode,buyer.MobileNo,buyer.Email], (err, rows, fields) => {
    if (!err)
        rows.forEach(element => {
        if(element.constructor == Array)
            res.send('New Buyer ID : '+ element[0].BuyerID);
        });
    else
        console.log(err);
    })
});

// Router to UPDATE/PUT a buyer's detail
// Here we have used 'Procedures' in MySQL which will be there in separate folder (To analyse the Proceduress)
app.put('/buyers', (req, res) => {
    let buyer = req.body;
    var sql = "SET @BuyerID = ?;SET @Name = ?;SET @Address = ?;SET @City = ?; SET @Province = ?; SET @Pincode = ?; SET @MobileNo = ?; SET @Email = ?; CALL BuyersInsertUpdate(@BuyerID,@Name,@Address,@City,@Province,@Pincode,@MobileNo,@Email);";
    mysqlConnection.query(sql, [buyer.BuyerID,buyer.Name,buyer.Address,buyer.City,buyer.Province,buyer.Pincode,buyer.MobileNo,buyer.Email], (err, rows, fields) => {
    if (!err)
        rows.forEach(element => {
        if(element.constructor == Array)
            res.send('Buyers Details Updated Successfully');
        });
    else
        console.log(err);
    })
});

// Router to DELETE specific buyer detail from the MySQL database
app.delete('/buyers/:id' , (req, res) => {
    mysqlConnection.query('DELETE FROM buyers where BuyerID = ?',[req.params.id], (err, rows, fields) => {
    if (!err)
    res.send('Data deleted successfully');
    else
        console.log(err);
    })
});