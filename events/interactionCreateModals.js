const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { default: axios } = require("axios");
const utils = require('../utils');
const api = require('../api.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!client.userData[interaction.user.id]) {
            client.userData[interaction.user.id] = {};
        }

        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'm2bot_login_with_sspua_gateway_form_email') {
            const email = interaction.fields.getTextInputValue('m2bot_login_with_sspua_gateway_input_email');

            if (utils.tools.email(email)) {
                let ref;
                const server_status = await axios.get(api.status);

                if (server_status.data.status !== "ok") {
                    return await interaction.reply({ content: '⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้', ephemeral: true });
                }

                const verifyLink = await axios.post(api.m2bot.verify.link, {
                    email: email,
                    discordId: interaction.user.id,
                });

                if (verifyLink.status === 502) {
                    return await interaction.reply({ content: '⚠️ บอทไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', ephemeral: true });
                }

                if (verifyLink.data.detail.active) {
                    let member;
                    const studentid = email.split('@')[0];

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

                    await axios.get(api.m2bot.member).then(response => {
                        member = response.data;
                    });

                    if (utils.tools.puaEmail(email)) {
                        if (member.M['2']['8'].includes(parseInt(studentid))) {
                            if (!hasps) await interaction.member.roles.add(puaschoolrole);
                            if (!hasss) await interaction.member.roles.add(ssrole);
                            if (!has28) await interaction.member.roles.add(m28role);
                            if (!hasvr) await interaction.member.roles.add(verifiedrole);
                        } else if (member.M['2']['9'].includes(parseInt(studentid))) {
                            if (!hasps) await interaction.member.roles.add(puaschoolrole);
                            if (!hasss) await interaction.member.roles.add(ssrole);
                            if (!has29) await interaction.member.roles.add(m29role);
                            if (!hasvr) await interaction.member.roles.add(verifiedrole);
                        } else {
                            if (!hasps) await interaction.member.roles.add(puaschoolrole);
                            if (!hasvr) await interaction.member.roles.add(verifiedrole);
                        }
                    } else {
                        if (!hasvr) await interaction.member.roles.add(verifiedrole);
                    }

                    const message = await interaction.reply({ content: `✅ ยืนยันตัวตนสำเร็จ\nยินดีต้อนรับกลับ ${email}`, ephemeral: true });
                } else {
                    if (!verifyLink.data.detail.ref) {
                        return await interaction.reply({ content: '⚠️ เกิดข้อผิดพลาดขึ้น โปรดลองอีกครั้งภายหลัง', ephemeral: true });
                    }

                    ref = verifyLink.data.detail.ref;

                    if (!client.userData) {
                        client.userData = {};
                    }

                    if (!client.userData[interaction.user.id]) {
                        client.userData[interaction.user.id] = {};
                    }

                    client.userData[interaction.user.id].verifyotp = {
                        ref: ref,
                    };

                    const enter_otp = new ButtonBuilder()
                        .setCustomId('m2bot_login_with_sspua_gateway_button_enter_otp')
                        .setLabel('Enter OTP')
                        .setStyle(ButtonStyle.Success);

                    const row = new ActionRowBuilder()
                        .addComponents(enter_otp);

                    const message = await interaction.reply({ content: `📨 เราได้ส่งอีเมลล์ไปยัง ${email} แล้ว กรุณาตรวจสอบในกล่องจดหมาย หากไม่พบกรุณาตรวจสอบในจดหมายขยะ (Junk Mail)`, components: [row], ephemeral: true });

                    client.userData[interaction.user.id].message = {
                        otp_message: message,
                    };
                }
            } else {
                await interaction.reply({ content: "⚠️ รูปแบบไม่ถูกต้อง กรุณาลองอีกครั้ง", ephemeral: true })
            }
        } else if (interaction.customId === "m2bot_login_with_sspua_gateway_form_verify_otp") {
            const otp = interaction.fields.getTextInputValue('m2bot_login_with_sspua_gateway_input_otp');
            const storedData = client.userData[interaction.user.id];
            if (storedData && storedData.verifyotp) {
                const { ref } = storedData.verifyotp;
                const { otp_message } = storedData.message;
                let member, userdata;

                await axios.post(api.m2bot.verify.otp, {
                    discordId: interaction.user.id,
                    otp: otp,
                    ref: ref,
                }).then(async response => {
                    if (response.data.verify === "success") {
                        await interaction.reply({ content: "✅ ยืนยันตัวตนสำเร็จ", ephemeral: true });
                    }
                    await otp_message.delete();
                }).catch(async error => {
                    await interaction.reply({ content: "❌ ยืนยันตัวตนไม่สำเร็จ", ephemeral: true });
                    await otp_message.delete();
                });

                await axios.get(api.m2bot.member).then(response => {
                    member = response.data;
                });

                const url = new URL(api.m2bot.verify.check);
                url.searchParams.set("id", interaction.user.id);

                await axios.get(url.toString()).then(async response => {
                    if (response.data.access) {
                        userdata = response.data;
                    }
                });

                if (utils.tools.puaEmail(userdata.account.email)) {
                    if (member && userdata) {
                        const studentid = userdata.account.email.split('@')[0];

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

                        if (member.M['2']['8'].includes(parseInt(studentid))) {
                            if (!hasps) await interaction.member.roles.add(puaschoolrole);
                            if (!hasss) await interaction.member.roles.add(ssrole);
                            if (!has28) await interaction.member.roles.add(m28role);
                            if (!hasvr) await interaction.member.roles.add(verifiedrole);
                        } else if (member.M['2']['9'].includes(parseInt(studentid))) {
                            if (!hasps) await interaction.member.roles.add(puaschoolrole);
                            if (!hasss) await interaction.member.roles.add(ssrole);
                            if (!has29) await interaction.member.roles.add(m29role);
                            if (!hasvr) await interaction.member.roles.add(verifiedrole);
                        } else {
                            if (!hasps) await interaction.member.roles.add(puaschoolrole);
                            if (!hasvr) await interaction.member.roles.add(verifiedrole);
                        }
                    }
                } else {
                    const verifiedrole = await interaction.guild.roles.cache.get("1182332304316702841");
                    const hasvr = await interaction.member.roles.cache.has(verifiedrole.id);
                    if (!hasvr) await interaction.member.roles.add(verifiedrole);
                }
            } else {
                await interaction.reply({ content: "⚠️ ยืนยันตัวตนไม่สำเร็จ มีบางอย่างไม่ถูกต้อง", ephemeral: true })
            }
        };
    },
};