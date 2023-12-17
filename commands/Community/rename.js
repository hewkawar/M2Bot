const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription("Rename Your Voice Channel")
    .setDescriptionLocalizations({
      th: "เปลี่ยนชื่อช่องเสียง",
    })
    .addStringOption(option =>
      option.setName('name')
        .setDescription("Name")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "ชื่อที่ต้องการเปลี่ยน",
        })),
  async execute(interaction, client) {
    const name = interaction.options.getString('name');
    const user = interaction.member;

    if (!user.voice.channel) {
      return await interaction.reply({
        content: 'You must be in a voice channel to invite someone.',
        ephemeral: true,
      });
    }

    if (!config.AllowCommands.InviteToPrivateVoiceChat.includes(user.voice.channel.parent.id)) {
      return await interaction.reply({
        content: 'Allow to use this command only Auto Voice Chat',
        ephemeral: true,
      });
    }

    const voiceChannel = user.voice.channel;

    voiceChannel.setName(name);

    await interaction.reply({
      content: `Change your voice chat name to ${voiceChannel}`,
      ephemeral: true,
    });
  },
};
