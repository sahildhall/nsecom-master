/**
 * Created by Sahil on 6/8/16.
 */


var express = require ('express');
var router = express.Router();
var pg = require('pg');
var mongoClient = require('mongodb').MongoClient;

var http = require('http');
var f1 = false;
var f2 = false;

function availabilityCheck(req, res)
{
    var options = {
        host: 'www.yahoo.com'
    };

    callback = function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {

            f1 = true;
            if(f1 ==true && f2 ==true)
                respForCallout();

        });
    }


    http.request(options, callback).on('error', function (err)
    {
        console.log(err)
    }).end();

    var URL = "postgres://dqlwzcsbobhcci:Lcm2mB5bUamVHB6FiiYWw1Jdkc@ec2-54-221-253-117.compute-1.amazonaws.com:5432/d935m16il25m65";
    pg.defaults.ssl = true;

    //22222222222222222222222222222
    /*pg.connect(URL,function(err,client)
     {
     if(err) throw err;

     console.log("Connected successfully to : "+URL);

     client
     .query('SELECT * FROM emp;')
     .on('row',function(data)
     {
     console.log(JSON.stringify(data));
     })
     .on('end',function()
     {
     client.end();
     respForCallout();
     })
     .on('err', function (err) {
     console.log(err);
     })
     });*/

    var client = new pg.Client(URL);
    client.connect();

    var query = client.query("SELECT * FROM emp;");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        client.end();
        f2 = true;
        if(f1 ==true && f2 ==true)
            respForCallout();
    });
    query.on('err', function (err) {
    });




    function respForCallout() {
        res.render('manyTier_yahoo', {title: 'Hi'});
        f1 = false;
        f2 = false;
    };
}

/* GET home page. */
router.get('/', function(req, res, next)
{

    availabilityCheck(req, res);
});

module.exports = router;