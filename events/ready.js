const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: `มอสองทับแปดบวกเก้า`, type: ActivityType.Playing }] });

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);

        // await client.channels.cache.get('1184105533788135554').send({ embeds: [new EmbedBuilder().setColor('Blue').setTitle("🔔 M2SMP-SS2 Status").setTimestamp(new Date()).setFields([{ name: "Status", value: "```🔴 Offline```", inline: true }, { name: "IP Server", value: "```m2smp.hewkawar.xyz:11433```", inline: true}])]})
        // await client.channels.cache.get('1184105621855932486').send({ embeds: [new EmbedBuilder().setColor('Blue').setTitle("🔔 MCBhuka Status").setTimestamp(new Date()).setFields([{ name: "Status", value: "```🔴 Offline```", inline: true }, { name: "IP Server", value: "```ddns.hewkawar.xyz:11439```", inline: true}])]})

        setInterval(async () => {
            try {
                const response = await axios.get('https://api.hewkawar.xyz/app/m2bot/voicechat').catch(error => { });

                if (response.data) {
                    for (const Channel of response.data) {
                        const voiceChannel = client.channels.cache.get(Channel.Channel.ID);

                        if (voiceChannel && voiceChannel.type === 2 && voiceChannel.members.size === 0) {
                            await axios({
                                method: "delete",
                                url: "https://api.hewkawar.xyz/app/m2bot/voicechat",
                                data: {
                                    ChannelID: Channel.Channel.ID
                                }
                            });

                            await voiceChannel.delete();
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000 * 5);

        setInterval(async () => {
            try {
                const response = await axios.get('https://mcapi.us/server/status?ip=m2smp.hewkawar.xyz&port=11433').catch(error => { });

                const message = await client.channels.cache.get('1184105533788135554').messages.fetch('1184111694025338881');

                if (response.data.online) {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 M2SMP-SS2 Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🟢 Online```", inline: false },
                                    { name: "Player", value: `\`\`\`${response.data.players.now}/${response.data.players.max}\`\`\``, inline: false },
                                    { name: "IP Server", value: "```m2smp.hewkawar.xyz:11433```", inline: false }
                                ])
                        ]
                    });
                } else {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 M2SMP-SS2 Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🔴 Offline```", inline: false },
                                    { name: "Player", value: `\`\`\`-\`\`\``, inline: false },
                                    { name: "IP Server", value: "```m2smp.hewkawar.xyz:11433```", inline: false }
                                ])
                        ]
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }, 60 * 1000);

        setInterval(async () => {
            try {
                const response = await axios.get('https://mcapi.us/server/status?ip=ddns.hewkawar.xyz&port=11439').catch(error => { });

                const message = await client.channels.cache.get('1184105621855932486').messages.fetch('1184111696495771698');

                if (response.data.online) {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 MCBhuka Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🟢 Online```", inline: false },
                                    { name: "Player", value: `\`\`\`${response.data.players.now}/${response.data.players.max}\`\`\``, inline: false },
                                    { name: "IP Server", value: "```ddns.hewkawar.xyz:11439```", inline: false }
                                ])
                        ]
                    });
                } else {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 MCBhuka Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🔴 Offline```", inline: false },
                                    { name: "Player", value: `\`\`\`-\`\`\``, inline: false },
                                    { name: "IP Server", value: "```ddns.hewkawar.xyz:11439```", inline: false }
                                ])
                        ]
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }, 60 * 1000);

    },
};