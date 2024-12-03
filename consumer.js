const amqp = require("amqplib");

async function receiveMessage(){
 try{
  
        //creating a connection
        const connection = await amqp.connect("amqp://localhost");
        //creating a channel
        const channel = await connection.createChannel();

         // Declare an exchange and queue
         const exchange = 'delayed_exchange';
         const queue = 'delayed_queue';

         await channel.assertExchange(exchange, 'x-delayed-message', {
            durable: true,
            arguments: { 'x-delayed-type': 'direct' },
          });
      
          await channel.assertQueue(queue, { durable: true });
      
          // Bind the queue to the exchange with a routing key
          await channel.bindQueue(queue, exchange, 'delayed_key');
      
          console.log('Waiting for messages...');
        //consuming message
        channel.consume(queue, (message)=>{
            if(message !== null){
                console.log("Message Received :", message.content.toString());

                //acknowledge the message
                channel.ack(message);
            }
        },  { noAck: false });
 }catch(err){
    console.log("[Error] received : ", err);
 }
}

receiveMessage();
