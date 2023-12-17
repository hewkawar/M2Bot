const { ChannelType, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");
const config = require('../config.json')
const api = require('../api.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        config.AutoVoiceChat.forEach(async VoiceChat => {
            if (newState.channelId === VoiceChat.id) {
                let channelName = VoiceChat.title;
                const EveryoneAllowPermission = [];
                const EveryoneDenyPermission = [];

                if (VoiceChat.permission.everyone[0]) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.ViewChannel);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.ViewChannel);
                }

                if (VoiceChat.permission.everyone[1]) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.Connect);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.Connect);
                }

                if (VoiceChat.permission.everyone[2]) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.Speak);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.Speak);
                }

                channelName = channelName.replace("%username%", newState.member.user.username)

                const voiceChannel = await newState.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: VoiceChat.category,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.Speak,
                            ]
                        },
                        {
                            id: newState.guild.roles.everyone,
                            allow: EveryoneAllowPermission,
                            deny: EveryoneDenyPermission,
                        }
                    ]
                });

                await axios.post(api.m2bot.voicechat, {
                    ChannelID: voiceChannel.id,
                    ChannelType: VoiceChat.type,
                    ChannelName: channelName,
                    MemberID: newState.member.id,
                    MemberUsername: newState.member.user.username,
                })

                await newState.member.edit({ channel: voiceChannel });
            }
        })
    },
};