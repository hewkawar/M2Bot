const { ActivityType } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: `มอสองทับแปดบวกเก้า`, type: ActivityType.Listening }] });

        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);

        setInterval(async () => {
            try {
                const response = await axios.get('https://api.hewkawar.xyz/app/m2bot/voicechat');

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

    },
};