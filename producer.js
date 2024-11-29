  const amqp = require("amqplib");

  async function sendMail(){
    try{

        //creating a connection
        const connection = await amqp.connect("amqp://localhost");

        //creating a channel
        const channel = await connection.createChannel();

        //creating an exchange name
        const exchange = "mail_exchange";

        //creating a routing_key
        const routingKey  ="send_mail";

        const message = {
            to:"anishc381@gmail.com",
            from:"barcafan830@gmail.com",
            subject:"Mail Testing",
            body:"Hello from mail server!!"
        }
        
         //creating an exchange
        await channel.assertExchange(exchange, "direct", {durable:false});
        //creating a queue
        await channel.assertQueue("mail_queue", {durable: false});

        //binding exchange with a queue
        await channel.bindQueue("mail_queue", exchange, routingKey);

        //sending message to queue using exchange and routing key
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log("Mail data was sent", message);

        //closing the connection
        setTimeout(()=>{
            connection.close();
        },500)

    }catch(err){
      console.log("Error", err);
    }
  }

  sendMail();