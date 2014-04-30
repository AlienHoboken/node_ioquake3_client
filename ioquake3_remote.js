var dgram = require('dgram');

/* 
   This method establishes the UDP connection to
   the ioquake3 server that will be communicated with
*/
exports.connect = function(host, port) {
  var sock = dgram.createSocket('udp4');

  sock.bind(port, function() {
    sock.addMembership(host);
  });

  sock.on('close', function() {
    // TODO emit a server close 
  });

  sock.on('message', function() {
    // TODO emit a server message event
  });
}


