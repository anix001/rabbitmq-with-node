const amqp = require("amqplib");

async function receiveMail(){
 try{
  
        //creating a connection
        const connection = await amqp.connect("amqp://localhost");

        //creating a channel
        const channel = await connection.createChannel();

        //creating a queue
        await channel.assertQueue("mail_queue", {durable: false});

        //consuming message
        channel.consume("mail_queue", (message)=>{
            if(message !== null){
                console.log("Message Received :", JSON.parse(message.content));

                //acknowledge the message
                channel.ack(message);
            }
        })
 }catch(err){
    console.log("[Error] received : ", err);
 }
}

receiveMail();
