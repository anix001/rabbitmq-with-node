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
        const routingKeyForSubUser  ="send_mail_to_subscribed_users";
        const routingKeyForNormalUser = "send_mail_to_users"
        //to check in which queue we want to send message
        const sendMessageToSubUser = true;
 
        const message = {
            to:"anishc381@gmail.com",
            from:"barcafan830@gmail.com",
            subject:"Mail Testing",
            body:"Hello from mail server!!"
        }
        
         //creating an exchange
        await channel.assertExchange(exchange, "direct", {durable:false});

        //creating a queue(for subscribed user)
        await channel.assertQueue("subscribed_users_mail_queue", {durable: false});
        //creating a queue(for normal user)
        await channel.assertQueue("users_mail_queue", {durable: false});

        //binding exchange with a subscribed_users_queue
        await channel.bindQueue("subscribed_users_mail_queue", exchange, routingKeyForSubUser);
        //binding exchange with a normal_users_queue
        await channel.bindQueue("users_mail_queue", exchange, routingKeyForNormalUser );

        //sending message to queue using exchange and routing key
        channel.publish(exchange, 
          sendMessageToSubUser?routingKeyForSubUser :routingKeyForNormalUser, 
          Buffer.from(JSON.stringify(message)));
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