const serialport = require('serialport');
const sleep = require('system-sleep');
const readline = require('@serialport/parser-readline');
const parser = new readline();

let cmds = [ "0001100000110011", "0x1833", [0x18,0x33], "0x1833000000000000", "1833000000000000", "END" ];

serialport.list().then(ports => {
  ports.forEach(function(port) {
    console.log(port.path);
    if(port.path === '/dev/ttyAMA0') {
        setupConnection('/dev/ttyAMA0')
    }
  });
});

function setupConnection(portname) {
    const port = new serialport(portname, {
        baudRate: 9600,
        databits: 8,
        stopBits: 1,
        parity: "none",
        autoOpen: true
    }, function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("Port "+portname+" is open: "+port.isOpen);
    });

    port.pipe(parser)
    parser.on('data', data => {
        console.log(data);
    })
    port.on('data', data => {
        console.log(data);
    })

    port.on('open', data => {
        console.log('isOpen and tryWrite');

        // This is 18 33 00 00 00 00 00 00
        // 00011000 > 18
        // 00110011 > 33
        let cmd = [0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        
        // This Command isn´t working!!

        cmdR = cmd.join('')
        port.write(cmdR, function(err, results) {
            if(err) {
                console.log("err: " + err);
            }
            console.log("results: " + results);
        });

        // The same command but inverse, because of some articles
        cmdI = ""
        for(var b of cmd) { 
            b = 1-b
            cmdI += b
        }
        port.write(cmdR, function(err, results) {
            if(err) {
                console.log("err: " + err);
            }
            console.log("results: " + results);
        });
        
    })
}