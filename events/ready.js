const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const api = require('../api.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);

        const presence = setInterval(async () => {
            client.user.setPresence({ activities: [{ name: `มอสองทับแปดบวกเก้า`, type: ActivityType.Playing }] });
        }, 60 * 1000);

        setInterval(async () => {
            try {
                const response = await axios.get(api.m2bot.voicechat).catch(error => { });

                if (response.data) {
                    for (const Channel of response.data) {
                        const voiceChannel = client.channels.cache.get(Channel.Channel.ID);

                        if (voiceChannel && voiceChannel.type === 2 && voiceChannel.members.size === 0) {
                            await axios({
                                method: "delete",
                                url: api.m2bot.voicechat,
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

        const M2SMP_SS2 = setInterval(async () => {
            try {
                const response = await axios.get(api["3rd-party"].mcapi.server.status["m2smp-ss2"]).catch(error => { });

                const message = await client.channels.cache.get('1184105533788135554').messages.fetch('1184827426686107669');

                const mc_icon = new AttachmentBuilder('./images/minecraft.jpg');

                if (response.data.online) {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 M2SMP-SS2 Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "attachment://minecraft.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🟢 Online```", inline: false },
                                    { name: "Player", value: `\`\`\`${response.data.players.now}/${response.data.players.max}\`\`\``, inline: false },
                                    { name: "IP Server", value: "```m2smp.hewkawar.xyz:11433```", inline: false }
                                ])
                        ],
                        files: [mc_icon]
                    });
                } else {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 M2SMP-SS2 Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "attachment://minecraft.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🔴 Offline```", inline: false },
                                    { name: "Player", value: `\`\`\`-\`\`\``, inline: false },
                                    { name: "IP Server", value: "```m2smp.hewkawar.xyz:11433```", inline: false }
                                ])
                        ],
                        files: [mc_icon]
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }, 60 * 1000);

        const MCBhuka = setInterval(async () => {
            try {
                const response = await axios.get(api["3rd-party"].mcapi.server.status.mcbhuka).catch(error => { });

                const message = await client.channels.cache.get('1184105621855932486').messages.fetch('1184827433891938364');

                const mc_icon = new AttachmentBuilder('./images/minecraft.jpg');

                if (response.data.online) {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 MCBhuka Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "attachment://minecraft.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🟢 Online```", inline: false },
                                    { name: "Player", value: `\`\`\`${response.data.players.now}/${response.data.players.max}\`\`\``, inline: false },
                                    { name: "IP Server", value: "```ddns.hewkawar.xyz:11439```", inline: false }
                                ])
                        ],
                        files: [mc_icon]
                    });
                } else {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 MCBhuka Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "attachment://minecraft.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🔴 Offline```", inline: false },
                                    { name: "Player", value: `\`\`\`-\`\`\``, inline: false },
                                    { name: "IP Server", value: "```ddns.hewkawar.xyz:11439```", inline: false }
                                ])
                        ],
                        files: [mc_icon]
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }, 60 * 1000);

        const MCDiscPixelmon = setInterval(async () => {
            try {
                const response = await axios.get(api["3rd-party"].mcapi.server.status.mcdiscpixelmon).catch(error => { });

                const message = await client.channels.cache.get('1185881474994536538').messages.fetch('1185882278094708788');

                const mc_icon = new AttachmentBuilder('./images/minecraft.jpg');

                if (response.data.online) {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 MCDiscPixelmon Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "attachment://minecraft.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🟢 Online```", inline: false },
                                    { name: "Player", value: `\`\`\`${response.data.players.now}/${response.data.players.max}\`\`\``, inline: false },
                                    { name: "IP Server", value: "```ddns.hewkawar.xyz:11432```", inline: false }
                                ])
                        ],
                        files: [mc_icon]
                    });
                } else {
                    await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Blue')
                                .setTitle("🔔 MCDiscPixelmon Status")
                                .setTimestamp(new Date())
                                .setFooter({ text: "Last Update", iconURL: "attachment://minecraft.jpg"})
                                .setFields([
                                    { name: "Status", value: "```🔴 Offline```", inline: false },
                                    { name: "Player", value: `\`\`\`-\`\`\``, inline: false },
                                    { name: "IP Server", value: "```ddns.hewkawar.xyz:11432```", inline: false }
                                ])
                        ],
                        files: [mc_icon]
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }, 60 * 1000);

    },
};