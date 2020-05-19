import discord
import asyncio

client = discord.Client()

players = {}
COR = 0xF7FE2E

@client.event 
async def on_ready():
	print("Bot Online")
	print(client.user.name)
	print(client.user.id)
	print("---------------")

@client.event 
async def on_message(message):
	if message.content.lower().startswith('?!inicio'):
		await client.send_message(message.channel, "Um momento amigo")
	if message.content.lower().startswith('?!oqlevasnestecaixao'):
		await client.send_message(message.channel, "Um monte de bosta")
	if message.content.lower().startswith('?!equemfoiocagao'):
		await client.send_message(message.channel, "Aposto que não foi o cu de sua mãe")
	if message.content.startswith('?!entrar'):
		try:
			channel = message.author.voice.voice_channel
			await client.join_voice_channel(channel)
		except discord.errors.InvalidArgument:
			await client.send_message(message.channel, "O bot ja esta em um canal de voz")
		except Exception as error:
			await client.send_message(message.channel, "Ein Error: ```{error}```".format(error=error))

	if message.content.startswith('?!sair'):
		try:
			mscleave = discord.Embed(
				title="\n",
				color=COR,
				description="Sai do canal de voz e a musica parou!"
			)
			voice_client = client.voice_client_in(message.server)
			await client.send_message(message.channel, embed=mscleave)
			await voice_client.disconnect()
		except AttributeError:
			await client.send_message(message.channel, "O bot não esta em nenhum canal de voz.")
		except Exception as Hugo:
			await client.send_message(message.channel, "Ein Error: ```{haus}```".format(haus=Hugo))

	if message.content.startswith('?!pause'):
		try:
			mscpause = discord.Embed(
				title="\n",
				color=COR,
				description="Musica pausada com sucesso!"
			)
			await client.send_message(message.channel, embed=mscpause)
			players[message.server.id].pause()
		except Exception as error:
			await client.send_message(message.channel, "Error: [{error}]".format(error=error))
			
	if message.content.startswith('!resume'):
		try:
			mscresume = discord.Embed(
				title="\n",
				color=COR,
				description="Musica pausada com sucesso!"
			)
			await client.send_message(message.channel, embed=mscresume)
			players[message.server.id].resume()
		except Exception as error:
			await client.send_message(message.channel, "Error: [{error}]".format(error=error))


client.run('NTA4MzE3MTUyOTUzMjM3NTA2.Dr9lOw.t2it8hnuG3RukbMiPO9LVKqTvUA')