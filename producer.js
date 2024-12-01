const amqp = require("amqplib");

async function announceNewProduct(product){
  try{

      //creating a connection
      const connection = await amqp.connect("amqp://localhost");

      //creating a channel
      const channel = await connection.createChannel();

      //creating an exchange name
      const exchange = "new_product_launch";

       //creating an exchange type
      const exchangeType = "fanout"; 
      
       //creating an exchange
      await channel.assertExchange(exchange, exchangeType, {durable:true});

      //[Note: IN exchange type =fanout , we do not make any queue and bind it in producer.js, we handle in consumer.js and we place " " in place of routingKey]

      //sending message to queue using exchange and routing key
      channel.publish(exchange, "", Buffer.from(JSON.stringify(product)), {persistent:true});
      console.log("Mail data was sent" ,JSON.stringify(product));

      //closing the connection
      setTimeout(()=>{
          connection.close();
      },500)

  }catch(err){
    console.log("Error", err);
  }
}

announceNewProduct({productId:12345, productName:'samsung tv', price: 555});