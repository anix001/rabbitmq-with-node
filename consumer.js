const amqp = require("amqplib");

async function consumeMessage(){
 try{
  
        //creating a connection
        const connection = await amqp.connect("amqp://localhost");

        //creating a channel
        const channel = await connection.createChannel();

        //creating a queue
        await channel.assertQueue("lazy_notification_queue", {durable: true, arguments:{"x-queue-mode":"lazy"}});
        console.log("waiting for message")

        //consuming message
        channel.consume("lazy_notification_queue", (message)=>{
            if(message !== null){
                console.log("Message Received :", message.content.toString());

                //acknowledge the message
                channel.ack(message);
            }
        })
 }catch(err){
    console.log("[Error] received : ", err);
 }
}

consumeMessage();
