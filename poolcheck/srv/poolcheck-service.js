const cds = require("@sap/cds");

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.0.208");

const WebSocketServer = require('ws').Server;
const ws = new WebSocketServer({
    port: process.env.PORT || 8080
});

module.exports = cds.service.impl(function () {
  // Get the CSN definition for Reviews from the db schema for sub-sequent queries
  // ( Note: we explicitly specify the namespace to support embedded reuse )
  const { OrpValues,OrpLive, ChlorinePump , RunValues } = this.entities;

  client.on("connect", function () {
    client.subscribe("/PoolMonitor/OrpLive", function (err) {});
    client.subscribe("/PoolMonitor/Orp", function (err) {});
    client.subscribe("/PoolMonitor/onoff", function (err) {});
  });

  var msg =
  {
  OrpValue : 0,
  OrpLive : 0,
  onoff : "off"
  };
  var onoff = 0;
  client.on("message", function (topic, message) {
    // message is Buffer

    switch (topic) {
      case "/PoolMonitor/Orp":
    
        cds.run(INSERT.into(OrpValues).columns("orp").values(message));
        
        msg.OrpValue = message.toString();
        cds.run(INSERT.into(RunValues).columns("orp","onoff").values(msg.OrpValue,onoff));

        break;
        case "/PoolMonitor/OrpLive":
        
        //cds.run(INSERT.into(OrpLive).columns("orp").values(message));
        msg.OrpLive = message.toString();
        //REMOVE THIS!!!!!!!!!!!
       // cds.run(INSERT.into(RunValues).columns("orp","onoff").values(msg.OrpLive,onoff));

        break;
      case "/PoolMonitor/onoff":
        cds.run(INSERT.into(ChlorinePump).columns("onoff").values(message.toString()));
        msg.onoff = message.toString();
        if(msg.onoff === "on") {
onoff = 100;
        } else {
onoff = 0;
        }
        cds.run(INSERT.into(RunValues).columns("orp","onoff").values(msg.OrpValue,onoff));
        break;

      default:
        break;
    }
    for (const client of ws.clients) {
      client.send(JSON.stringify(msg));
  }
    
  });

  //   this.before (['CREATE','UPDATE'], 'Orp', req => {
  //     if (!req.data.rating) req.data.rating = Math.round(Math.random()*4)+1
  //   })

  //   // Emit an event to inform subscribers about new avg ratings for reviewed subjects
  //   this.after (['CREATE','UPDATE','DELETE'], 'Reviews', async function(_,req) {
  //     const {subject} = req.data
  //     const { count, rating } = await cds.tx(req) .run (
  //       SELECT.one `round(avg(rating),2) as rating, count(*) as count` .from (Reviews) .where ({subject})
  //     )
  //     global.it || console.log ('< emitting:', 'reviewed', { subject, count, rating })
  //     await this.emit ('reviewed', { subject, count, rating })
  //   })
});
