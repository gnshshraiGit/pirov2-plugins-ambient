var BME280 = require('bme280-sensor');
var mergeJSON = require("merge-json");

var options = {
    ambientEvent: 'ambientdata',
    i2cBusNo   : 1, 
    i2cAddress : 0x76
};



module.exports = function(config){
    //Module initialization
    config = config || {};
    var cfg = mergeJSON.merge(options, config);
    var bme280 = new BME280(options);
    bme280.init(); //init bme280 module

    ambient = function(socket){
        console.log("ambient connected to " + socket.conn.id);
        setInterval(function(){
            bme280.readSensorData()
            .then(function(pthdata) {
                //calculate some unit conversions
                pthdata.temperature_F = BME280.convertCelciusToFahrenheit(pthdata.temperature_C);
                pthdata.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(pthdata.pressure_hPa);
                socket.emit(cfg.ambientEvent, {pthdata: pthdata});
            })
            .catch((err) => {
                console.log(`BME280 read error: ${err}`);
            });
        },2000);
    }
    return ambient;
}