var dgram = require('dgram');
var compressjs = require('compressjs');

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

  sock.on('message', function(message_bytes, rinfo) {
    //chop off header
    var message = message_bytes.slice(4).toString();
    console.log("Received message: " + message);

    //check what type it is

    //if it's a challenge response, send clientinfo
    if(message.indexOf("challengeResponse") === 0) {
      var challenge = message_bytes.slice(22).toString();
      var infoString = "\"\\challenge\\" + challenge + "\\qport\\0\\protocol\\69\\cl_voip\\0\\name\\TestName\\rate\\3000\\snaps\\20\\color1\\4\\color2\\5\\handicap\\100\\sex\\male\\cl_guid\\XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\"";
      var msg = format("connect " + infoString);
      console.log("Sending... " + msg);
      sock.send(msg, 0, msg.length, port, host, function(err, bytes) {
        console.log("Sent " + bytes + " bytes. Err: " + err);
      });
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
