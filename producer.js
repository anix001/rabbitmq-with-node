  const amqp = require("amqplib");

  async function sendMail(routingKey, message){
    try{

        //creating a connection
        const connection = await amqp.connect("amqp://localhost");

        //creating a channel
        const channel = await connection.createChannel();

        //creating an exchange name
        const exchange = "notification_exchange";

         //creating an exchange type
        const exchangeType = "topic"; 
        
         //creating an exchange
        await channel.assertExchange(exchange, exchangeType, {durable:true});

        //[Note: IN exchange type =topic , we do not make any queue and bind it in producer.js, we handle in consumer.js]

        //sending message to queue using exchange and routing key
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {persistent:true});
        console.log("Mail data was sent", routingKey ,JSON.stringify(message));

        //closing the connection
        setTimeout(()=>{
            connection.close();
        },500)

    }catch(err){
      console.log("Error", err);
    }
  }

  sendMail("order.placed", {orderId: 12345, status:"placed"});
  sendMail("payment.processed", {paymentId: 67890, status:"processed"});