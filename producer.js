  const amqp = require("amqplib");

  async function setup(message){
    try{

        //creating a connection
        const connection = await amqp.connect("amqp://localhost");

        //creating a channel
        const channel = await connection.createChannel();

        //creating an exchange name
        const exchange = "notificaion_exchange";
        const queueName ="lazy_notification_queue";
        //creating a routing_key
        const routingKey  ="notification.key";
        
         //creating an exchange
        await channel.assertExchange(exchange, "direct", {durable:true});
        //creating a queue
        await channel.assertQueue(queueName, {durable: true, arguments:{"x-queue-mode":"lazy"}}); // to define it is a lazy queue

        //binding exchange with a queue
        await channel.bindQueue(queueName, exchange, routingKey);

        //sending message to queue using exchange and routing key
        channel.publish(exchange, routingKey, Buffer.from(message), {persistent : true});
        console.log("Mail data was sent", message);

        await channel.close();
        await connection.close();

    }catch(err){
      console.log("Error", err);
    }
  }

  setup('hello i am anix');