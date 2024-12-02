const amqp = require("amqplib");

async function sendNotification(headers, message){
  try{

      //creating a connection
      const connection = await amqp.connect("amqp://localhost");

      //creating a channel
      const channel = await connection.createChannel();

      //creating an exchange name
      const exchange = "header_exchange";

       //creating an exchange type
      const exchangeType = "headers"; 
      
       //creating an exchange
      await channel.assertExchange(exchange, exchangeType, {durable:true});

      //[Note: IN exchange type =headers , we do not make any queue and bind it in producer.js, we handle in consumer.js and we place " " in place of routingKey]

      //sending message to queue using exchange and routing key
      channel.publish(exchange, "", Buffer.from(message), {persistent:true, headers});
      console.log("Notification data was sent " ,message);

      //closing the connection
      setTimeout(()=>{
          connection.close();
      },500)

  }catch(err){
    console.log("Error", err);
  }
}

sendNotification({"x-match":"all", "notification-type":"new_video", "content-type": "video"}, "New  music video uploaded");
sendNotification({"x-match":"all", "notification-type":"live_stream", "content-type": "gaming"}, "Gaming live stream started");
sendNotification({"x-match":"any", "notification-type-comment":"comment", "content-type": "vlog"}, "New comment on vlog");
sendNotification({"x-match":"any", "notification-type-like":"like", "content-type": "vlog"}, "New like on vlog");

//[x-match = any is or x-match= all is and]