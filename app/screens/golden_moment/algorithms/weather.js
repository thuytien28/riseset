const http = require("http");

const API_Key = '705c462d22832a9748f2c622bc67fae4';

const getWeather = (lat, lng) => {
  var Req ="http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + API_Key;
  // Request weather data 
//   Req = GetOWM_Request("weather", Location, API_Key);
//   print ("Request: "+ Req);
  http.get(Req, function(res) {
    var contents = "";
    res.on('data', function(data) { contents += data; });
    contents = JSON.parse(contents);
    res.on('close', function() { 
      return {
        Temperature: contents.main.temp-273.15
      }; 
    });
  }); 
}

export default getWeather;
