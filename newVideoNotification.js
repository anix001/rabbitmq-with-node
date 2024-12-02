const amqp = require("amqplib");

async function consumeNewVideoNotification(){
  try{

      //creating a connection
      const connection = await amqp.connect("amqp://localhost");
      //creating a channel
      const channel = await connection.createChannel();

      //creating an exchange name
      const exchange = "header_exchange";
       //creating an exchange type
      const exchangeType = "headers"; 

      //creating a exchange 
      await channel.assertExchange(exchange, exchangeType, {durable: true});
      //creating a queue
      const queue = await channel.assertQueue("", {exclusive: true}); // create a temporary queue, also generate a name for queue
       //bind exchange with queue
       await channel.bindQueue(queue.queue, exchange, "",{
        "x-match":"all", "notification-type":"new_video", "content-type": "video" //headers
       }); //routing key is empty

       //consuming message
       console.log("Waiting for new video uploaded messages")
       channel.consume(queue.queue, (message)=>{
           if(message !== null){
               console.log("Message Received for new video uploaded   :", message.content.toString());

               //acknowledge the message
               channel.ack(message);
           }
       })
    }catch(err){
        console.log("Error", err);
      }
    }

    consumeNewVideoNotification();