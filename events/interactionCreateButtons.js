const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { default: axios } = require("axios");
const api = require('../api.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!client.userData[interaction.user.id]) {
            client.userData[interaction.user.id] = {};
        }

        if (!interaction.isButton()) return;

        if (interaction.customId === 'm2bot_login_with_sspua_gateway') {
            const server_status = await axios.get(api.status);

            if (server_status.data.status !== "ok") {
                return await interaction.reply('⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้');
            }

            const url = new URL(api.m2bot.verify.check);
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
                    );

                const logoutBtn = new ButtonBuilder()
                    .setCustomId('m2bot_logout')
                    .setLabel('Logout')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder()
                    .addComponents(logoutBtn);

                const acmessage = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

                client.userData[interaction.user.id].message = {
                    account_message: acmessage,
                };
            } else {
                const modal = new ModalBuilder()
                    .setCustomId('m2bot_login_with_sspua_gateway_form_email')
                    .setTitle('ยืนยันตัวตนผ่านอีเมล์');

                const emailInput = new TextInputBuilder()
                    .setCustomId('m2bot_login_with_sspua_gateway_input_email')
                    .setLabel("ระบุอีเมลล์")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(emailInput);

                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            }
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
        } else if (interaction.customId === 'm2bot_logout') {
            const storedData = client.userData[interaction.user.id];
            const { account_message } = storedData.message;

            const urlDetail = new URL(api.m2bot.verify.check);
            const urlUpdate = new URL(api.m2bot.inactive);
            urlDetail.searchParams.set("id", interaction.user.id);

            let vcheck;

            await axios.get(urlDetail.toString()).then(async response => {
                vcheck = response.data;
            });

            if (vcheck.account.discordId && vcheck.account.email) {
                await axios.put(urlUpdate.toString(), {
                    discordId: vcheck.account.discordId,
                    email: vcheck.account.email,
                }).then(async response => {
                    const embed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription("✅ ออกจากระบบแล้ว")

                    const puaschoolrole = await interaction.guild.roles.cache.get("1181943769789108255");
                    const ssrole = await interaction.guild.roles.cache.get("1174346998707654796");
                    const m28role = await interaction.guild.roles.cache.get("1137379575979053056");
                    const m29role = await interaction.guild.roles.cache.get("1137379536271573144");
                    const verifiedrole = await interaction.guild.roles.cache.get("1182332304316702841");

                    const hasps = await interaction.member.roles.cache.has(puaschoolrole.id);
                    const hasss = await interaction.member.roles.cache.has(ssrole.id);
                    const has28 = await interaction.member.roles.cache.has(m28role.id);
                    const has29 = await interaction.member.roles.cache.has(m29role.id);
                    const hasvr = await interaction.member.roles.cache.has(verifiedrole.id);

                    if (hasps) await interaction.member.roles.remove(puaschoolrole);
                    if (hasss) await interaction.member.roles.remove(ssrole);
                    if (has28) await interaction.member.roles.remove(m28role);
                    if (has29) await interaction.member.roles.remove(m29role);
                    if (hasvr) await interaction.member.roles.remove(verifiedrole);

                    await account_message.delete();

                    return interaction.reply({ embeds: [embed], ephemeral: true })
                }).catch(error => {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("⚠️ ไม่สามารถดำเนินการตามคำขอได้ มีบางอย่างไม่ถูกต้อง")

                    return interaction.reply({ embeds: [embed], ephemeral: true })
                })
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("⚠️ คุณยังไม่ได้เข้าสู่ระบบ กรุณาลองอีกครั้งหลังจากเข้าสู่ระบบเสร็จเรียบร้อยแล้ว")

                return interaction.reply({ embeds: [embed], ephemeral: true })
            }
        };
    },
};