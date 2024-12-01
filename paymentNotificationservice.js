const amqp = require("amqplib");

async function receiveMail(){
 try{
  
        //creating a connection
        const connection = await amqp.connect("amqp://localhost");
        //creating a channel
        const channel = await connection.createChannel();
        //creating an exchange name
        const exchange = "notification_exchange";
        //creating an queue name
        const queue = "payment_queue"; 
        

        //creating a exchange 
        await channel.assertExchange(exchange, "topic", {durable: true})
        //creating a queue
        await channel.assertQueue(queue, {durable: true});
        //bind exchange with queue
        await channel.bindQueue(queue, exchange, "payment.*" )

        //consuming message
        console.log("Waiting for messages")
        channel.consume(queue, (message)=>{
            if(message !== null){
                console.log("Message Received for order :", JSON.parse(message.content));

                //acknowledge the message
                channel.ack(message);
            }
        }, {noAck:false})
 }catch(err){
    console.log("[Error] received : ", err);
 }
}

receiveMail();
