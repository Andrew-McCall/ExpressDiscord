global.config = {...require("./.config.json"), ...process.env}
const {Client, GatewayIntentBits} = require("discord.js")
const express = require("express");
const app = express();

app.use(express.json())

app.post("/message/:guild/:channel", (req, res)=> {
    if (req.body.embeds || req.body.content){
        global.client.guilds.fetch(req.params.guild).then(guild => {
            guild.channels.fetch(req.params.channel).then(channel => {
                channel.send(req.body).then((msg)=>{
                    res.status(200).json(msg)
                })
            })
        })
    }else{
        res.status(400).send("Invaild Body Format")
    }
})

global.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

global.client.on('ready', () => {
	console.log(`Logged in as ${global.client.user.tag}!`)
    app.listen(7777, ()=>{ // Express Started Here (AFTER discord)
        console.log("Express started listening on 7777")
    }) 
});

global.client.login(global.config.TOKEN);