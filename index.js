const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const queue = new Map();
const client = new Discord.Client();

client.login(token);

client.once('ready', () => {
    console.log('Ready!');
   });

client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });

client.once('disconnect', () => {
    console.log('Disconnect!');
   });

client.on('message', async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}Du`)) {
        execute(`?!play https://www.youtube.com/watch?v=jCvaocRA2YM`, serverQueue);
        return;
    } else {
        message.channel.send("Comando não existe, seu macaco");
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "MACACO DO MATO COMO EU VOU TOCAR SEM ESTAR NO CANAAL????"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "GORILA MONSTRUSO EU NÃO TENHO PERMISSÃO PRA ISSO!"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } 
    else {
      serverQueue.songs.push(song);
      return message.channel.send(`Essa merda de ${song.title} entrou na fila`);
    }
}
  
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "SEU PRIMATA DE MERDAAAAAAAAA, TEM QUE ESTAR NO CANAL PRA PULAR A MUSICA!!!!!"
      );
    if (!serverQueue)
      return message.channel.send("SEU SIMIO SEM MÃE NÃO TEM MUSICA NESSA PORRAAAAAAAA!!!!!");
    serverQueue.connection.dispatcher.end();
}
  
function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "SEU PRIMATA DE MERDAAAAAAAAA, TEM QUE ESTAR NO CANAL PRA PARAR A MUSICA!!!!!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
  
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Começo a toca: **${song.title}**`);
}

client.login(token);