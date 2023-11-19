const { ActivityType } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: `มอสองทับแปดบวกเก้า`, type: ActivityType.Listening }] });

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);

        setInterval(async () => {
            await axios.get('https://api.hewkawar.xyz/app/m2bot/voicechat')
                .then(async response => {
                    if (response.data) {
                        response.data.forEach(async Channel => {
                            const voiceChannel = client.channels.cache.get(Channel.Channel.ID)

                            if (voiceChannel && voiceChannel.type === 'voice' && voiceChannel.members.size === 0) {
                                await voiceChannel.delete();
                                await axios.delete('https://api.hewkawar.xyz/app/m2bot/voicechat', {
                                    ChannelID: Channel.Channel.ID,
                                }).then(response => {
                                    console.log(response.data);
                                });
                            }
                        });
                    }
                });
        }, 1000);
    },
};