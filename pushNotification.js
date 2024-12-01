const amqp = require("amqplib");

async function pushNotification(){
 try{
  
        //creating a connection
        const connection = await amqp.connect("amqp://localhost");
        //creating a channel
        const channel = await connection.createChannel();
        //creating an exchange name
        const exchange = "new_product_launch";
        //creating an exchange type name
        const exchangeType = "fanout"; 
        

        //creating a exchange 
        await channel.assertExchange(exchange, exchangeType, {durable: true})
        //creating a queue
        const queue = await channel.assertQueue("", {exclusive: true}); // create a temporary queue, also generate a name for queue
        //bind exchange with queue
        await channel.bindQueue(queue.queue, exchange, ""); //routing key is empty

        //consuming message
        console.log("Waiting for messages", queue)
        channel.consume(queue.queue, (message)=>{
            if(message !== null){
                console.log("Message Received for push notification   :", JSON.parse(message.content));

                //acknowledge the message
                channel.ack(message);
            }
        })
 }catch(err){
    console.log("[Error] received : ", err);
 }
}

pushNotification();
