var https = require('https');
var keys = require('./keys.json');

var CONFIG = {
  uber_token:      keys.uber.serverToken, // Pull uber server token from keys.json
  product_id:      '55c66225-fbe7-4fd5-9072-eab1ece5e23e', // UberX in BOS
  start_latitude:  keys.wiggs.lat, // Wiggs LatLng
  start_longitude: keys.wiggs.lng,
  end_latitude:    0,
  end_longitude:   0,
};

function callUber(event, context) {
  var data =  {
    product_id:      CONFIG.product_id,
    start_latitude:  CONFIG.start_latitude,
    start_longitude: CONFIG.start_longitude,
    end_latitude:    CONFIG.end_latitude,
    end_longitude:   CONFIG.end_longitude
  };

  data = JSON.stringify(data);

  var headers = {
    'Authorization':  'Bearer ' + CONFIG.uber_token,
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(data)
  };

  var options = {
    host:    'api.uber.com',
    path:    '/v1/requests',
    method:  'POST',
    headers: headers
  };

  var req = https.request(options, function(res) {
    if (res.statusCode == 200) {
      context.succeed(event);
    } else if (context) {
      context.fail(event);
    }

    res.on('data', function (chunk) {
      console.log("" + chunk);
    });
  });

  req.write(data);
  req.end();
}

exports.handler = callUber;
