var dgram = require('dgram');

/* 
   This method establishes the UDP connection to
   the ioquake3 server that will be communicated with
*/
exports.connect = function(host, port) {
  var sock = dgram.createSocket('udp4');

/*  sock.bind(port, function() {
    sock.addMembership(host);
  });*/

  sock.on('close', function() {
    // TODO emit a server close 
  });

  sock.on('message', function(message, rinfo) {
    //chop off header
    message = message.slice(4).toString();
    console.log("Received message: " + message);
    //check what type it is
    if(message.indexOf("challengeResponse" === 0)) {
      //TODO Send clientinfo
    }
  });

  //send getchallenge
  var msg = format("getchallenge");
  console.log("Sending... " + msg);
  sock.send(msg, 0, msg.length, port, host, function(err, bytes) {
    console.log("Sent " + bytes + " bytes. Err: " + err);
  });
}

/*
   Convenience method. Accepts a string message to send,
   then turns it into a buffer and supplies the header.
*/
format = function(message) {
  var msg = "xxxx" + message
  msg = new Buffer(msg);
  msg[0] = 0xFF;
  msg[1] = 0xFF;
  msg[2] = 0xFF;
  msg[3] = 0xFF;
  return msg;
}
