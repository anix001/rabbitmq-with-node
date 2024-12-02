const amqp = require("amqplib");

async function receiveMail(){
 try{
  
        //creating a connection
        const connection = await amqp.connect("amqp://localhost");
        //creating a channel
        const channel = await connection.createChannel();
        //queue name
        const queue = "priority_queue";

        //creating a queue
        await channel.assertQueue(queue, {durable: true, arguments:{"x-max-priority":10}});


        //consuming message
        channel.consume(queue, (message)=>{
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

receiveMail();
