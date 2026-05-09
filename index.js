const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");

const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

//////////////////////////////
// CONFIG
//////////////////////////////

const TOKEN = "PUT_BOT_TOKEN";
const GUILD_ID = "PUT_SERVER_ID";

const STAFF_ROLE_ID = "PUT_STAFF_ROLE_ID";
const CLOSE_ROLE_ID = "PUT_CLOSE_ROLE_ID";
const MENTION_ROLE_ID = "PUT_MENTION_ROLE_ID";

const SUPPORT_CATEGORY_ID = "PUT_SUPPORT_CATEGORY_ID";
const APPEAL_CATEGORY_ID = "PUT_APPEAL_CATEGORY_ID";
const REPORT_CATEGORY_ID = "PUT_REPORT_CATEGORY_ID";
const SUGGESTION_CATEGORY_ID = "PUT_SUGGESTION_CATEGORY_ID";

const RATING_CHANNEL_ID = "PUT_RATING_CHANNEL_ID";

const PANEL_IMAGE = "PUT_SERVER_IMAGE_LINK";

//////////////////////////////

const ratingsFile = "./ratings.json";

if (!fs.existsSync(ratingsFile)) {
    fs.writeFileSync(ratingsFile, "{}");
}

function loadRatings() {
    return JSON.parse(fs.readFileSync(ratingsFile));
}

function saveRatings(data) {
    fs.writeFileSync(ratingsFile, JSON.stringify(data, null, 2));
}

const ticketTypes = {
    support: {
        name: "الدعم الفني",
        emoji: "🛠️",
        category: SUPPORT_CATEGORY_ID,
        message: "اتفضل اشرح مشكلتك بالكامل بالتفاصيل."
    },

    appeal: {
        name: "استئناف",
        emoji: "📨",
        category: APPEAL_CATEGORY_ID,
        message: "اتفضل اكتب سبب الاستئناف بالكامل."
    },

    report: {
        name: "شكوى لاعب",
        emoji: "🚨",
        category: REPORT_CATEGORY_ID,
        message: "اتفضل اشرح الشكوى واكتب اسم اللاعب والدليل."
    },

    suggestion: {
        name: "اقتراح",
        emoji: "💡",
        category: SUGGESTION_CATEGORY_ID,
        message: "اتفضل اكتب اقتراحك بالكامل."
    }
};

client.once("ready", async () => {

    console.log(`${client.user.tag} جاهز`);

    const commands = [
        new SlashCommandBuilder()
            .setName("panel")
            .setDescription("ارسال بانل التذاكر")
            .toJSON()
    ];

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
        Routes.applicationGuildCommands(client.user.id, GUILD_ID),
        { body: commands }
    );
});

client.on("interactionCreate", async (interaction) => {

    //////////////////////////////
    // PANEL
    //////////////////////////////

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "panel") {

            const embed = new EmbedBuilder()
                .setTitle("🎫 نظام التذاكر")
                .setDescription("اختار نوع التذكرة من الأزرار تحت")
                .setColor("Red")
                .setImage(PANEL_IMAGE);

            const row = new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId("support")
                        .setLabel("الدعم الفني")
                        .setEmoji("🛠️")
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId("appeal")
                        .setLabel("استئناف")
                        .setEmoji("📨")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("report")
                        .setLabel("شكوى لاعب")
                        .setEmoji("🚨")
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId("suggestion")
                        .setLabel("اقتراح")
                        .setEmoji("💡")
                        .setStyle(ButtonStyle.Success)
                );

            return interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }

    //////////////////////////////
    // OPEN TICKET
    //////////////////////////////

    if (interaction.isButton()) {

        if (ticketTypes[interaction.customId]) {

            const type = ticketTypes[interaction.customId];

            const already = interaction.guild.channels.cache.find(c =>
                c.topic &&
                c.topic.includes(`OWNER_${interaction.user.id}`)
            );

            if (already) {
                return interaction.reply({
                    content: `❌ عندك تذكرة مفتوحة بالفعل ${already}`,
                    ephemeral: true
                });
            }

            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: type.category,

                topic: `OWNER_${interaction.user.id}_TYPE_${interaction.customId}_CLAIM_none`,

                permissionOverwrites: [

                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },

                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.ReadMessageHistory
                        ],

                        deny: [
                            PermissionFlagsBits.SendMessages
                        ]
                    },

                    {
                        id: STAFF_ROLE_ID,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages
                        ]
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setTitle(`${type.emoji} ${type.name}`)
                .setDescription(`
${interaction.user}

${type.message}

⚠️ لا يمكنك الكتابة حتى يتم استلام التذكرة
`)
                .setColor("Red");

            const buttons = new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId("claim_ticket")
                        .setLabel("استلام التذكرة")
                        .setEmoji("✅")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId("close_ticket")
                        .setLabel("إغلاق التذكرة")
                        .setEmoji("🔒")
                        .setStyle(ButtonStyle.Danger)
                );

            await channel.send({
                content: `<@&${MENTION_ROLE_ID}>`,
                embeds: [embed],
                components: [buttons]
            });

            return interaction.reply({
                content: `✅ تم فتح التذكرة ${channel}`,
                ephemeral: true
            });
        }

        //////////////////////////////
        // CLAIM
        //////////////////////////////

        if (interaction.customId === "claim_ticket") {

            if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {

                return interaction.reply({
                    content: "❌ ليس لديك صلاحية",
                    ephemeral: true
                });
            }

            const ownerId = interaction.channel.topic.split("_")[1];

            await interaction.channel.permissionOverwrites.edit(ownerId, {
                SendMessages: true
            });

            const newTopic = interaction.channel.topic.replace(
                "CLAIM_none",
                `CLAIM_${interaction.user.id}`
            );

            await interaction.channel.setTopic(newTopic);

            const embed = new EmbedBuilder()
                .setTitle("✅ تم استلام التذكرة")
                .setDescription(`
المستلم: ${interaction.user}
`)
                .setColor("Green");

            return interaction.reply({
                embeds: [embed]
            });
        }

        //////////////////////////////
        // CLOSE BUTTON
        //////////////////////////////

        if (interaction.customId === "close_ticket") {

            if (!interaction.member.roles.cache.has(CLOSE_ROLE_ID)) {

                return interaction.reply({
                    content: "❌ ليس لديك صلاحية",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId("close_modal")
                .setTitle("إغلاق التذكرة");

            const reason = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("سبب الإغلاق")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reason)
            );

            return interaction.showModal(modal);
        }

        //////////////////////////////
        // RATING BUTTONS
        //////////////////////////////

        if (interaction.customId.startsWith("rate_")) {

            const data = interaction.customId.split("_");

            const ticketId = data[1];
            const stars = data[2];

            const ratings = loadRatings();

            if (ratings[`${interaction.user.id}_${ticketId}`]) {

                return interaction.reply({
                    content: "❌ قمت بالتقييم بالفعل",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()
                .setCustomId(`ratingmodal_${ticketId}_${stars}`)
                .setTitle(`تقييم ${stars} نجوم`);

            const input = new TextInputBuilder()
                .setCustomId("ratingreason")
                .setLabel("سبب التقييم")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(input)
            );

            return interaction.showModal(modal);
        }
    }

    //////////////////////////////
    // CLOSE MODAL
    //////////////////////////////

    if (interaction.isModalSubmit()) {

        if (interaction.customId === "close_modal") {

            const reason = interaction.fields.getTextInputValue("reason");

            const topic = interaction.channel.topic;

            const ownerId = topic.split("_")[1];
            const type = topic.split("_")[3];
            const claimed = topic.split("_")[5];

            const user = await client.users.fetch(ownerId);

            const closeEmbed = new EmbedBuilder()
                .setTitle("🔒 تم إغلاق تذكرتك")
                .setColor("Red")
                .addFields(

                    {
                        name: "نوع التذكرة",
                        value: ticketTypes[type].name
                    },

                    {
                        name: "صاحب التذكرة",
                        value: `<@${ownerId}>`
                    },

                    {
                        name: "المستلم",
                        value: claimed === "none"
                            ? "لم يتم الاستلام"
                            : `<@${claimed}>`
                    },

                    {
                        name: "تم الإغلاق بواسطة",
                        value: `${interaction.user}`
                    },

                    {
                        name: "سبب الإغلاق",
                        value: reason
                    }
                );

            const ratingButtons = new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(`rate_${interaction.channel.id}_1`)
                        .setLabel("⭐")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`rate_${interaction.channel.id}_2`)
                        .setLabel("⭐⭐")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`rate_${interaction.channel.id}_3`)
                        .setLabel("⭐⭐⭐")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`rate_${interaction.channel.id}_4`)
                        .setLabel("⭐⭐⭐⭐")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId(`rate_${interaction.channel.id}_5`)
                        .setLabel("⭐⭐⭐⭐⭐")
                        .setStyle(ButtonStyle.Success)
                );

            await user.send({
                embeds: [closeEmbed]
            }).catch(() => { });

            await user.send({
                content: "⭐ قيم التذكرة",
                components: [ratingButtons]
            }).catch(() => { });

            await interaction.reply({
                content: "✅ سيتم حذف التذكرة خلال 5 ثواني",
                ephemeral: true
            });

            setTimeout(() => {
                interaction.channel.delete().catch(() => { });
            }, 5000);
        }

        //////////////////////////////
        // RATING MODAL
        //////////////////////////////

        if (interaction.customId.startsWith("ratingmodal_")) {

            const data = interaction.customId.split("_");

            const ticketId = data[1];
            const stars = data[2];

            const reason = interaction.fields.getTextInputValue("ratingreason");

            const ratings = loadRatings();

            ratings[`${interaction.user.id}_${ticketId}`] = true;

            saveRatings(ratings);

            const channel = await client.channels.fetch(RATING_CHANNEL_ID);

            const embed = new EmbedBuilder()
                .setTitle("⭐ تقييم جديد")
                .setColor("Gold")
                .addFields(

                    {
                        name: "الشخص",
                        value: `${interaction.user}`
                    },

                    {
                        name: "عدد النجوم",
                        value: `${stars} ⭐`
                    },

                    {
                        name: "سبب التقييم",
                        value: reason
                    }
                );

            await channel.send({
                embeds: [embed]
            });

            return interaction.reply({
                content: "✅ شكرا على تقييمك",
                ephemeral: true
            });
        }
    }
});

client.login(TOKEN);
