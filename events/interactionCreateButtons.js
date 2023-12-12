const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { default: axios } = require("axios");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!client.userData[interaction.user.id]) {
            client.userData[interaction.user.id] = {};
        }

        if (!interaction.isButton()) return;

        if (interaction.customId === 'm2bot_login_with_sspua_gateway') {
            const server_status = await axios.get('https://api.hewkawar.xyz/status');

            if (server_status.data.status !== "ok") {
                return await interaction.reply('⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้');
            }

            const url = new URL("https://api.hewkawar.xyz/app/m2bot/verify/check");
            url.searchParams.set("id", interaction.user.id);

            let vcheck;

            await axios.get(url.toString()).then(async response => {
                vcheck = response.data;
            })

            if (vcheck.access) {
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setThumbnail(interaction.user.displayAvatarURL({ extension: "png" }))
                    .setDescription("✅ คุณเป็นสมาชิกอยู่แล้ว")
                    .addFields(
                        { name: "Email", value: `${vcheck.account.email}`, inline: true },
                        { name: "Discord ID", value: `${vcheck.account.discordId}`, inline: true }
                    )
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId('m2bot_login_with_sspua_gateway_form_email')
                .setTitle('ยืนยันตัวตนผ่านอีเมล์');

            const favoriteColorInput = new TextInputBuilder()
                .setCustomId('m2bot_login_with_sspua_gateway_input_email')
                .setLabel("ระบุอีเมลล์ * ต้องใช้อีเมล์ @pua.ac.th")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        } else if (interaction.customId === 'm2bot_login_with_sspua_gateway_button_enter_otp') {
            const storedData = client.userData[interaction.user.id];
            if (storedData && storedData.verifyotp) {
                const { ref } = storedData.verifyotp;
                const modal = new ModalBuilder()
                    .setCustomId('m2bot_login_with_sspua_gateway_form_verify_otp')
                    .setTitle('ยืนยันตัวตนผ่านอีเมล์');

                const favoriteColorInput = new TextInputBuilder()
                    .setCustomId('m2bot_login_with_sspua_gateway_input_otp')
                    .setLabel(`OTP (Ref: ${ref})`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            }
        };
    },
};