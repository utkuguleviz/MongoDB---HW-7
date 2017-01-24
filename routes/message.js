var express = require('express');
var mongo = require("mongoskin");
const crypto = require("crypto");
var router = express.Router();

const decipher = crypto.createDecipher('aes256', 'asaadsaad');
var db = mongo.db("mongodb://localhost:27017/testDB", { native_parser: true })
db.bind('homework7');

var decrypted = '';
decipher.on('readable', () => {
    var data = decipher.read();
    if (data) decrypted += data.toString('utf8');
})

decipher.on('end', () => {
    console.log("decrypted: " + decrypted);
})

router.get('/', function (req, res, next) {
    db.homework7.find().toArray(function (err, items) {
        if (err) throw err;
        var encrypted = items[0].message;
        console.log("encrypted: " + encrypted);
        decipher.write(encrypted, 'hex');
        decipher.end();
        res.send(decrypted);
        db.close();
    })

});

module.exports = router;