const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitetoprivatevoicechat')
    .setDescription("Invite some Member to Join Your Voice Channel")
    .setDescriptionLocalizations({
      th: "เชิญใครบางคนเพื่อเข้าร่วมช่องเสียง",
    })
    .addUserOption(option =>
      option.setName('member')
        .setDescription("Select the member to invite")
        .setRequired(true)
        .setDescriptionLocalizations({
          th: "เลือกสมาชิกที่ต้องการเชิญ",
        })),
  async execute(interaction, client) {
    const member = interaction.options.getMember('member');
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

    voiceChannel.permissionOverwrites.edit(member, {
        'ViewChannel': true,
        'Connect': true,
        'Speak': true,
    });
    
    await interaction.reply({
        content: `Invited ${member.user.tag} to the private voice channel.`,
        ephemeral: true,
    });

    await member.send({ embeds: [new EmbedBuilder().setDescription(`**You have invited to join ${voiceChannel}**`).setColor('Green').setTimestamp(Date.now()).setFooter({text: `Invited by ${interaction.member.user.username}`,iconURL: `${interaction.member.displayAvatarURL({ extension: 'png' })}`})]});
},
};
