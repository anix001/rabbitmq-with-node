  const amqp = require("amqplib");

  async function sendMail(){
    try{

        //creating a connection
        const connection = await amqp.connect("amqp://localhost");
        //creating a channel
        const channel = await connection.createChannel();

        //creating an exchange name
        const exchange = "priority_exchange";
        //queue name
        const queue = "priority_queue";
        //creating a routing_key
        const routingKey  ="priority_key";

        
         //creating an exchange
        await channel.assertExchange(exchange, "direct", {durable:true});
        //creating a queue
        await channel.assertQueue(queue, {durable: true, arguments:{"x-max-priority": 10} });
        //binding exchange with a queue
        await channel.bindQueue(queue, exchange, routingKey);

        //data to send
        const data = [
          {
            msg: "Hello low: 1",
            priority: 1
          },
          {
            msg: "Hello high: 8",
            priority: 8
          },
          {
            msg: "Hello mid: 2",
            priority: 2
          },
        ]

        //sending message to queue using exchange and routing key and different priority
        data.map((msg)=>{
          channel.publish(exchange, routingKey, Buffer.from(msg.msg), {priority:msg.priority});
          console.log("Mail data was sent", msg.msg);
        });
        console.log("All messages are sent !!");

        //closing the connection
        setTimeout(()=>{
            connection.close();
        },500)

    }catch(err){
      console.log("Error", err);
    }
  }

  sendMail();