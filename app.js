const connection_retry_delay = 10000;
const max_connection_retries = 99999;
const waitUntil = require('wait-until');
const bot_class = require('./bot_class.js')
var jsonFile = require('jsonfile')

const ip = "localhost"
const port = 25565
const username = "username"
const password = "password"

if (process.argv.length != 6){
    console.log("Error de argumentos no valido. Argumentos: ip, port, username, password")
    console.log("Intentando utilizar variables de entorno")
    ip = process.env.IP;
    port = Number(process.env.PORT)
    username = process.env.USERNAME
    password = process.env.PASSWORD
}else{
      
    ip = process.argv.at(2)
    port = Number(process.argv.at(3))
    username = process.argv.at(4)
    password = process.argv.at(5)
}

    console.log("ip " + ip + " port " + port + " username " + username + " password " + password)
    
    try{
        var slave = new bot_class.Bot_(username, ip, port, password).bot

        slave.on('end', function(reason) {
            // Wait 10 seconds between tries, and try 9999 times
            waitUntil(connection_retry_delay, max_connection_retries, function condition() {
            try {
                slave.ataca = false;
                console.log("Bot ended, attempting to reconnect...");
                console.log(`Reason ${reason}`)
                slave = new bot_class.Bot_(username, ip, port, password).bot
                    return true;
            } catch (error) {
                    console.log("Error: " + error);
                    return false;
                }
                // Callback function that is only executed when condition is true or time allotted has elapsed
            }, function done(result) {
                console.log("Connection attempt result was: " + result);
            });
        });
    }catch(e){
        console.log("Error in app: " + e)
    }



// Lee varios bots de un JSON. Mineflayer no es capaz de mantener la conexion
// de varios bots de manera simultanea de manera estable, es preferible desplegar
// cada bot por separado.
/*
jsonFile.readFile("bots.json", function(err, jsonData){
    if (err) throw err;
    
        var ip = jsonData.ip;
        var port= jsonData.port;

        var slave1_username = jsonData.slave1.username;
        var slave1_password = jsonData.slave1.password;
        var slave2_username = jsonData.slave2.username;
        var slave2_password = jsonData.slave2.password;
        var slave3_username = jsonData.slave3.username;
        var slave3_password = jsonData.slave3.password;
        var slave4_username = jsonData.slave4.username;
        var slave4_password = jsonData.slave4.password;

    var slave1 = new bot_class.Bot_(slave1_username, ip, port, slave1_password).bot
    var slave2 = new bot_class.Bot_(slave2_username, ip, port, slave2_password).bot
    var slave3 = new bot_class.Bot_(slave3_username, ip, port, slave3_password).bot
    var slave4 = new bot_class.Bot_(slave4_username, ip, port, slave4_password).bot


    slave1.on('end', function(reason) {
        // Wait 10 seconds between tries, and try 9999 times
        waitUntil(connection_retry_delay, max_connection_retries, function condition() {
          try {
            slave1.ataca = false;
            console.log("Bot ended, attempting to reconnect...");
            console.log(`Reason ${reason}`)
            slave1 = new bot_class.Bot_(slave1_username, ip, port, slave1_password).bot
                return true;
           } catch (error) {
                console.log("Error: " + error);
                return false;
            }
            // Callback function that is only executed when condition is true or time allotted has elapsed
        }, function done(result) {
            console.log("Connection attempt result was: " + result);
        });
    });

    slave2.on('end', function(reason) {
        // Wait 10 seconds between tries, and try 9999 times
        waitUntil(connection_retry_delay, max_connection_retries, function condition() {
          try {
            slave2.ataca = false;
            console.log("Bot ended, attempting to reconnect...");
            console.log(`Reason ${reason}`)
            slave2 = new bot_class.Bot_(slave2_username, ip, port, slave2_password).bot
                return true;
           } catch (error) {
                console.log("Error: " + error);
                return false;
            }
            // Callback function that is only executed when condition is true or time allotted has elapsed
        }, function done(result) {
            console.log("Connection attempt result was: " + result);
        });
    });

    slave3.on('end', function(reason) {
        // Wait 10 seconds between tries, and try 9999 times
        waitUntil(connection_retry_delay, max_connection_retries, function condition() {
          try {
            slave3.ataca = false;
            console.log("Bot ended, attempting to reconnect...");
            console.log(`Reason ${reason}`)
            slave3 = new bot_class.Bot_(slave3_username, ip, port, slave3_password).bot
                return true;
           } catch (error) {
                console.log("Error: " + error);
                return false;
            }
            // Callback function that is only executed when condition is true or time allotted has elapsed
        }, function done(result) {
            console.log("Connection attempt result was: " + result);
        });
    });

    slave4.on('end', function(reason) {
        // Wait 10 seconds between tries, and try 9999 times
        waitUntil(connection_retry_delay, max_connection_retries, function condition() {
          try {
            slave4.ataca = false;
            console.log("Bot ended, attempting to reconnect...");
            console.log(`Reason ${reason}`)
            slave4 = new bot_class.Bot_(slave4_username, ip, port, slave4_password).bot
                return true;
           } catch (error) {
                console.log("Error: " + error);
                return false;
            }
            // Callback function that is only executed when condition is true or time allotted has elapsed
        }, function done(result) {
            console.log("Connection attempt result was: " + result);
        });
    });
})*/

