  const amqp = require("amqplib");

  async function sendMessage(){
    try{

        //creating a connection
        const connection = await amqp.connect("amqp://localhost");
        //creating a channel
        const channel = await connection.createChannel();

        //creating an exchange name
        const exchange = "delayed_exchange";     
        const routingKey ="delayed_key";  
         //creating an exchange
        await channel.assertExchange(exchange, "x-delayed-message", {durable:true, arguments:{'x-delayed-type':'direct'}});

        const message = 'Hello, Delayed Queue!';
        const delay = 5000; // Delay in milliseconds (5 seconds)

        //sending message to queue using exchange and routing key
        channel.publish(exchange, routingKey, Buffer.from(message), {
          headers: { 'x-delay': delay },
        });

        console.log(`Message sent: "${message}" with delay: ${delay}ms`);
        await channel.close();
        await connection.close();

    }catch(err){
      console.log("Error", err);
    }
  }

  sendMessage();