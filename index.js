require("dotenv").config();

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
    TextInputStyle
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

const TOKEN = process.env.TOKEN;

const GUILD_ID = "1492895005725954159";

const PANEL_CHANNEL_ID = "1517176981001605331";
const INTERVIEW_PANEL_CHANNEL_ID = "1517157396407914686";

const CONTROL_CHANNEL_ID = "1517218130768957510";

//////////////////////////////
// ADMIN ROLES
//////////////////////////////

const ADMIN_ROLE_IDS = [
    "1516976173559713792",
    "1516976537998590055",
    "1516978479315423282",
    "1516978869339553945",
    "1516980160472154173",
    "1516984047824277524",
    "1516985590422310962"
];

//////////////////////////////
// REOPEN TICKET ROLES
//////////////////////////////

const REOPEN_TICKET_ROLE_IDS = [
    "1516976173559713792",
    "1516976537998590055",
    "1516978479315423282",
    "1516978869339553945",
    "1516980160472154173",
    "1516984047824277524",
    "1516985590422310962"
];

//////////////////////////////
// DELETE TICKET ROLES
//////////////////////////////

const DELETE_TICKET_ROLE_IDS = [
    "1516976173559713792",
    "1516976537998590055",
    "1516978479315423282",
    "1516978869339553945",
    "1516980160472154173",
    "1516984047824277524",
    "1516985590422310962"
];

//////////////////////////////
// CLAIM TICKET ROLES
//////////////////////////////

const CLAIM_TICKET_ROLE_IDS = [
    "1516976173559713792",
    "1516976537998590055",
    "1516978479315423282",
    "1516978869339553945",
    "1516980160472154173",
    "1516984047824277524",
    "1516985590422310962",
    "1516985590422310962"
];

//////////////////////////////
// CATEGORIES
//////////////////////////////

const SUPPORT_CATEGORY_ID = "1517180092235645028";
const APPEAL_CATEGORY_ID = "1517217141718384680";
const REPORT_CATEGORY_ID = "1517215977413152768";
const SUGGESTION_CATEGORY_ID = "1517217658775273482";
const INTERVIEW_CATEGORY_ID = "1517168535372042341";

//////////////////////////////
// BUG REPORT CATEGORY
//////////////////////////////

const BUG_REPORT_CATEGORY_ID = "1517352274282807447";

//////////////////////////////

const RATING_CHANNEL_ID = "1517189944383246396";

//////////////////////////////
// PANEL IMAGES
//////////////////////////////

const PANEL_IMAGE = "https://cdn.discordapp.com/attachments/1466116277650325652/1507865687299719361/E35CCF57-B7A0-45EE-954F-42D066CD2359.png?ex=6a1374da&is=6a12235a&hm=1fe5829b8b1b7f4fd95c28904209f174e8e8bf9821dcd76375539fb85855f56f&";

const INTERVIEW_PANEL_IMAGE = "https://cdn.discordapp.com/attachments/1466116277650325652/1507100179361300632/A64899C3-A339-4DEB-AD42-E867A54438F3.png?ex=6a10abeb&is=6a0f5a6b&hm=b63b7667c51e9121fc4605cae2a092ab60f88876a9b57bfb3067a2b65104a0f6&";

//////////////////////////////
// OPEN IMAGES
//////////////////////////////

const TICKET_IMAGES = {
    support: "https://cdn.discordapp.com/attachments/1466116277650325652/1507100177154965514/084F09C3-43D1-4BAA-BA81-07046757519F.png?ex=6a10abea&is=6a0f5a6a&hm=4ab839b2da8bfe994a043a56b710d40eb48fd72cabfdac81e81ba3c86d7a2de8&",

    appeal: "https://cdn.discordapp.com/attachments/1466116277650325652/1507100177947693206/03DF0538-D989-45D8-BD8D-B2A02895AEAA.png?ex=6a10abea&is=6a0f5a6a&hm=9fb1c629407b5365a301a28e4b7ffceb47f671192b246752bbe07a9663c575dd&",

    report: "https://cdn.discordapp.com/attachments/1475033418336174141/1506740667072643153/FE2EE4A5-17C9-478E-8DAC-3F5C818777E2.png?ex=6a0f5d18&is=6a0e0b98&hm=c68a47a49812d7f6fa788026593fda6a4400d44de6535bb42dac01d608617050&",

    suggestion: "https://cdn.discordapp.com/attachments/1466116277650325652/1507100178446811197/DBE5E889-4799-4DC5-B28A-B54CE6A5017F.png?ex=6a10abeb&is=6a0f5a6b&hm=21f037c019af6d0088dc53f18f0b686adca8ae19d8436dc6a079d7618530250b&",

    interview: "https://cdn.discordapp.com/attachments/1466116277650325652/1507100178874896415/38DDBB12-3A2C-427E-93C8-8E9DBF929AB7.png?ex=6a10abeb&is=6a0f5a6b&hm=566d653149e2ef4bf7e0743d662d7f8006e2720a75b69890f4ce65914061d3b2&",

    bugreport: "https://cdn.discordapp.com/attachments/1466116277650325652/1507871804117745825/0113FE87-D193-42CF-925F-36D3EF5760EA.png?ex=6a137a8d&is=6a12290d&hm=4096ecda90f1954b53b6cefb93ae59075c4113dd66df389d880d13f34c793ec9&"
};

//////////////////////////////
// CLOSE IMAGES
//////////////////////////////

const TICKET_CLOSE_IMAGES = {
    support: "https://cdn.discordapp.com/attachments/1466116277650325652/1507864007002947755/2D903D4E-ABCC-4119-A8AD-9BFCE70B571E.png?ex=6a13734a&is=6a1221ca&hm=2789ef943b3187ad727da1ea38806b75fe259c6349df220c8c8e1eb1c483b404&",
    appeal: "https://cdn.discordapp.com/attachments/1466116277650325652/1507865237242642574/FE45CBA3-B896-4CED-8E57-0EFD9E968D88.png?ex=6a13746f&is=6a1222ef&hm=52c9b387c480f1c0220956d51732f3a74c74d9f2abe3b8af5d90f84b809ba240&",
    report: "https://cdn.discordapp.com/attachments/1466116277650325652/1507865236894650629/B1EFE041-925D-410C-91AA-87482FC41497.png?ex=6a13746f&is=6a1222ef&hm=07e2c47c83a118c4e6f832b186dbbb0146013a677ed2f89f9bcb0083a480863c&",
    suggestion: "https://cdn.discordapp.com/attachments/1466116277650325652/1507865236567363636/2AD96C0A-18CF-4CC5-89AE-A6FB1CC10290.png?ex=6a13746f&is=6a1222ef&hm=25c99fb0a38bb4731809ce067faaaa5261a386d8812ab9aba9cb3be72e8cc0b3&",
    interview: "https://cdn.discordapp.com/attachments/1466116277650325652/1507873384774766703/173D5CEF-D221-4455-B9DA-FB98B1FE945E.png?ex=6a137c05&is=6a122a85&hm=ac92c63eb7864af2f002fc1fe89718e0e9248a4e0ae076ea4620e1bcf8bd0f86&",
    bugreport: "https://cdn.discordapp.com/attachments/1466116277650325652/1507864006633717983/9D62DAE9-EB23-4030-9B51-8565E4E41707.png?ex=6a137349&is=6a1221c9&hm=cd2555599af6626898d0128c53740f42230c7ca246ae3c68ff140e136ec8c39a&"
};

//////////////////////////////

const ratingsFile = "./ratings.json";
const controlFile = "./control.json";
const counterFile = "./ticketCounter.json";
const activityFile = "./ticketActivity.json";

if (!fs.existsSync(ratingsFile)) fs.writeFileSync(ratingsFile, "{}");

if (!fs.existsSync(counterFile)) {
    fs.writeFileSync(counterFile, JSON.stringify({ count: 0 }, null, 2));
}

if (!fs.existsSync(activityFile)) {
    fs.writeFileSync(activityFile, "{}");
}

if (!fs.existsSync(controlFile)) {
    fs.writeFileSync(controlFile, JSON.stringify({
        support: false,
        appeal: false,
        report: false,
        suggestion: false,
        interview: false,
        bugreport: false
    }, null, 2));
}

function loadRatings() {
    return JSON.parse(fs.readFileSync(ratingsFile));
}

function saveRatings(data) {
    fs.writeFileSync(ratingsFile, JSON.stringify(data, null, 2));
}

function loadControl() {
    return JSON.parse(fs.readFileSync(controlFile));
}

function saveControl(data) {
    fs.writeFileSync(controlFile, JSON.stringify(data, null, 2));
}

function loadCounter() {
    return JSON.parse(fs.readFileSync(counterFile));
}

function saveCounter(data) {
    fs.writeFileSync(counterFile, JSON.stringify(data, null, 2));
}

function loadActivity() {
    return JSON.parse(fs.readFileSync(activityFile));
}

function saveActivity(data) {
    fs.writeFileSync(activityFile, JSON.stringify(data, null, 2));
}

function hasAdminRole(member) {
    return ADMIN_ROLE_IDS.some(role => member.roles.cache.has(role));
}

function canClaim(member) {
    return CLAIM_TICKET_ROLE_IDS.some(role => member.roles.cache.has(role));
}

function canReopen(member) {
    return REOPEN_TICKET_ROLE_IDS.some(role => member.roles.cache.has(role));
}

function canDelete(member) {
    return DELETE_TICKET_ROLE_IDS.some(role => member.roles.cache.has(role));
}

function getTicketNumber() {
    const counter = loadCounter();

    counter.count += 1;

    saveCounter(counter);

    return String(counter.count).padStart(3, "0");
}

//////////////////////////////
// TICKET TYPES
//////////////////////////////

const ticketTypes = {

    support: {
        name: "الدعم الفني",
        emoji: "🛠️",
        category: SUPPORT_CATEGORY_ID,
        image: TICKET_IMAGES.support,
        closeImage: TICKET_CLOSE_IMAGES.support,
        message: "يرجى شرح المشكلة بالكامل مع إرسال الصور أو المقاطع إن وجدت حتى يتمكن فريق الدعم من مساعدتك بأسرع وقت ممكن."
    },

    appeal: {
        name: "استئناف",
        emoji: "📨",
        category: APPEAL_CATEGORY_ID,
        image: TICKET_IMAGES.appeal,
        closeImage: TICKET_CLOSE_IMAGES.appeal,
        message: "يرجى كتابة سبب الاستئناف بالكامل مع توضيح جميع التفاصيل الخاصة بالحالة الخاصة بك."
    },

    report: {
        name: "شكوى لاعب",
        emoji: "🚨",
        category: REPORT_CATEGORY_ID,
        image: TICKET_IMAGES.report,
        closeImage: TICKET_CLOSE_IMAGES.report,
        message: "يرجى كتابة اسم اللاعب وشرح الشكوى بالكامل مع إرسال الأدلة المتوفرة."
    },

    suggestion: {
        name: "اقتراح",
        emoji: "💡",
        category: SUGGESTION_CATEGORY_ID,
        image: TICKET_IMAGES.suggestion,
        closeImage: TICKET_CLOSE_IMAGES.suggestion,
        message: "يرجى كتابة اقتراحك بالكامل مع توضيح الفكرة وطريقة تنفيذها داخل السيرفر."
    },

    interview: {
        name: "مقابلة فورية",
        emoji: "🎤",
        category: INTERVIEW_CATEGORY_ID,
        image: TICKET_IMAGES.interview,
        closeImage: TICKET_CLOSE_IMAGES.interview,
        message: "يرجى انتظار الإدارة، وسيتم استلام التذكرة لبدء المقابلة الفورية معك."
    },

    bugreport: {
        name: "ابلاغ عن الاخطأ",
        emoji: "🐞",
        category: BUG_REPORT_CATEGORY_ID,
        image: TICKET_IMAGES.bugreport,
        closeImage: TICKET_CLOSE_IMAGES.bugreport,
        message: "يرجى شرح الخطأ بالكامل."
    }
};

function statusText(key) {

    const control = loadControl();

    return control[key]
        ? "🔴 مقفولة"
        : "🟢 مفتوحة";
}

//////////////////////////////////////////////////
// MAIN PANEL
//////////////////////////////////////////////////

function mainPanelEmbed() {

    return new EmbedBuilder()

        .setTitle("🎫 نظام التذاكر")

        .setDescription(`

مرحبا بك في نظام التذاكر الخاص بسيرفر Nova CFW.

━━━━━━━━━━━━━━━━━━

🛠️ الدعم الفني: ${statusText("support")}
📨 الاستئناف: ${statusText("appeal")}
🚨 شكوى لاعب: ${statusText("report")}
💡 اقتراح: ${statusText("suggestion")}
🐞 ابلاغ عن خطأ: ${statusText("bugreport")}

━━━━━━━━━━━━━━━━━━

⚠️ الرجاء عدم فتح تذاكر بدون سبب.

⚠️ يتم إغلاق التذكرة تلقائيا بعد 24 ساعة إذا لم يحدث أي تفاعل داخلها.

`)

        .setColor("Red")

        .setImage(PANEL_IMAGE);
}

function mainPanelRow() {

    const control = loadControl();

    return new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()
                .setCustomId("support")
                .setLabel(control.support ? "الدعم الفني مقفول" : "الدعم الفني")
                .setEmoji("🛠️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("appeal")
                .setLabel(control.appeal ? "الاستئناف مقفول" : "استئناف")
                .setEmoji("📨")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("report")
                .setLabel(control.report ? "شكوى لاعب مقفولة" : "شكوى لاعب")
                .setEmoji("🚨")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("suggestion")
                .setLabel(control.suggestion ? "الاقتراح مقفول" : "اقتراح")
                .setEmoji("💡")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("bugreport")
                .setLabel(control.bugreport ? "الابلاغ مقفول" : "ابلاغ عن خطأ")
                .setEmoji("🐞")
                .setStyle(ButtonStyle.Secondary)
        );
}

//////////////////////////////////////////////////
// SEND PANELS
//////////////////////////////////////////////////

async function sendPanels() {

    const panelChannel = await client.channels.fetch(PANEL_CHANNEL_ID)
        .catch(() => null);

    if (!panelChannel) {
        console.log("Main Panel Channel Not Found");
        return;
    }

    const interviewChannel = await client.channels.fetch(INTERVIEW_PANEL_CHANNEL_ID)
        .catch(() => null);

    const oldMessages = await panelChannel.messages.fetch({
        limit: 20
    });

    const oldPanel = oldMessages.find(msg =>
        msg.author.id === client.user.id &&
        msg.embeds.length > 0 &&
        msg.embeds[0]?.title === "🎫 نظام التذاكر"
    );

    if (oldPanel) {
        await oldPanel.delete().catch(() => {});
    }

    await panelChannel.send({
        embeds: [mainPanelEmbed()],
        components: [mainPanelRow()]
    });

    console.log("Main Panel Sent");

    if (interviewChannel) {

        const oldInterviewMessages = await interviewChannel.messages.fetch({
            limit: 20
        });

        const oldInterviewPanel = oldInterviewMessages.find(msg =>
            msg.author.id === client.user.id &&
            msg.embeds.length > 0 &&
            msg.embeds[0]?.title === "🎤 المقابلة الفورية"
        );

        if (oldInterviewPanel) {
            await oldInterviewPanel.delete().catch(() => {});
        }

        const interviewEmbed = new EmbedBuilder()

            .setTitle("🎤 المقابلة الفورية")

            .setDescription(`

مرحبا بك في نظام المقابلة الفورية.

━━━━━━━━━━━━━━━━━━

🎤 افتح تذكرتك وابدأ المقابلة مباشرة مع الإدارة.

━━━━━━━━━━━━━━━━━━

⚠️ يرجى التأكد من جاهزيتك قبل فتح التذكرة.

⚠️ يتم إغلاق التذكرة تلقائيا بعد 24 ساعة إذا لم يحدث أي تفاعل.

`)

            .setColor("Red")

            .setImage(INTERVIEW_PANEL_IMAGE);

        const interviewRow = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("interview")
                    .setLabel("فتح مقابلة فورية")
                    .setEmoji("🎤")
                    .setStyle(ButtonStyle.Danger)
            );

        await interviewChannel.send({
            embeds: [interviewEmbed],
            components: [interviewRow]
        });

        console.log("Interview Panel Sent");
    }
}

//////////////////////////////////////////////////
// CLOSE FUNCTION
//////////////////////////////////////////////////

async function closeTicket(channel, closedBy, reason, isAutoClose = false) {

    const topic = channel.topic;

    if (!topic || !topic.includes("OWNER_")) return;

    const ownerId = topic.split("_")[1];
    const type = topic.split("_")[3];
    const claimed = topic.split("_")[5];

    await channel.permissionOverwrites.edit(ownerId, {
        SendMessages: false
    });

    const closeEmbed = new EmbedBuilder()

        .setTitle("🔒 تم إغلاق التذكرة")

        .setColor("Red")

        .setImage(ticketTypes[type].closeImage)

        .addFields(

            {
                name: "رقم التذكرة",
                value: `${channel.name}`
            },

            {
                name: "صاحب التذكرة",
                value: `<@${ownerId}>`
            },

            {
                name: "مستلم التذكرة",
                value: claimed === "none"
                    ? "لم يتم الاستلام"
                    : `<@${claimed}>`
            },

            {
                name: "تم الإغلاق بواسطة",
                value: isAutoClose
                    ? "النظام التلقائي"
                    : `${closedBy}`
            },

            {
                name: "سبب الإغلاق",
                value: reason
            }
        );

    const row = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()
                .setCustomId("reopen_ticket")
                .setLabel("إعادة فتح التذكرة")
                .setEmoji("🔓")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("delete_ticket")
                .setLabel("حذف التذكرة")
                .setEmoji("🗑️")
                .setStyle(ButtonStyle.Danger)
        );

    await channel.send({
        embeds: [closeEmbed],
        components: [row]
    });

    const user = await client.users.fetch(ownerId).catch(() => null);

    if (user) {

        const dmEmbed = new EmbedBuilder()

            .setTitle("🔒 تم إغلاق تذكرتك")

            .setColor("Red")

            .setImage(ticketTypes[type].closeImage)

            .addFields(

                {
                    name: "رقم التذكرة",
                    value: `${channel.name}`
                },

                {
                    name: "نوع التذكرة",
                    value: ticketTypes[type].name
                },

                {
                    name: "مستلم التذكرة",
                    value: claimed === "none"
                        ? "لم يتم الاستلام"
                        : `<@${claimed}>`
                },

                {
                    name: "سبب الاغلاق",
                    value: reason
                }
            );

        await user.send({
            embeds: [dmEmbed]
        }).catch(() => {});

        const ratingRow = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId(`rate_${channel.id}_1_${claimed}`)
                    .setLabel("⭐")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId(`rate_${channel.id}_2_${claimed}`)
                    .setLabel("⭐⭐")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId(`rate_${channel.id}_3_${claimed}`)
                    .setLabel("⭐⭐⭐")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId(`rate_${channel.id}_4_${claimed}`)
                    .setLabel("⭐⭐⭐⭐")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId(`rate_${channel.id}_5_${claimed}`)
                    .setLabel("⭐⭐⭐⭐⭐")
                    .setStyle(ButtonStyle.Success)
            );

        await user.send({
            content: "⭐ قم بتقييم التذكرة",
            components: [ratingRow]
        }).catch(() => {});
    }
}

//////////////////////////////////////////////////
// READY
//////////////////////////////////////////////////

client.once("ready", async () => {

    console.log(`${client.user.tag} جاهز`);

    await sendPanels();

});

//////////////////////////////////////////////////
// INTERACTIONS
//////////////////////////////////////////////////

client.on("interactionCreate", async (interaction) => {

    if (interaction.isButton()) {

        if (ticketTypes[interaction.customId]) {

            const type = ticketTypes[interaction.customId];

            const ticketNumber = getTicketNumber();

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

                name: `${type.emoji}・ticket-${ticketNumber}`,

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

                    ...ADMIN_ROLE_IDS.map(role => ({
                        id: role,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    }))
                ]
            });

            const embed = new EmbedBuilder()

                .setTitle(`${type.emoji} ${type.name}`)

                .setColor("Red")

                .setImage(type.image)

                .setDescription(`

# مرحبا بك في نظام التذاكر

رقم التذكرة:
#${ticketNumber}

صاحب التذكرة:
${interaction.user}

نوع التذكرة:
${type.name}

${type.message}

━━━━━━━━━━━━━━━━━━

⚠️ لا يمكنك الكتابة حتى تستلم الإدارة التذكرة.

━━━━━━━━━━━━━━━━━━

`);

            const row = new ActionRowBuilder()

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

                content: `
## ${type.emoji} تذكرة جديدة

${interaction.user}
                `,

                embeds: [embed],

                components: [row]
            });

            return interaction.reply({
                content: `✅ تم فتح التذكرة ${channel}`,
                ephemeral: true
            });
        }

        if (interaction.customId === "claim_ticket") {

            if (!canClaim(interaction.member)) {

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

                .setColor("Green")

                .setDescription(`
تم استلام التذكرة بواسطة:

${interaction.user}
`);

            return interaction.reply({
                embeds: [embed]
            });
        }

        if (interaction.customId === "close_ticket") {

            if (!hasAdminRole(interaction.member)) {

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

        if (interaction.customId === "reopen_ticket") {

            if (!canReopen(interaction.member)) {

                return interaction.reply({
                    content: "❌ ليس لديك صلاحية إعادة فتح التذكرة",
                    ephemeral: true
                });
            }

            const ownerId = interaction.channel.topic.split("_")[1];

            await interaction.channel.permissionOverwrites.edit(ownerId, {
                SendMessages: true
            });

            const embed = new EmbedBuilder()

                .setTitle("🔓 تم إعادة فتح التذكرة")

                .setColor("Green")

                .setDescription(`
تم إعادة فتح التذكرة بواسطة:

${interaction.user}
`);

            return interaction.reply({
                embeds: [embed]
            });
        }

        if (interaction.customId === "delete_ticket") {

            if (!canDelete(interaction.member)) {

                return interaction.reply({
                    content: "❌ ليس لديك صلاحية حذف التذكرة",
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: "🗑️ سيتم حذف التذكرة بعد 5 ثواني"
            });

            setTimeout(() => {

                interaction.channel.delete().catch(() => {});

            }, 5000);
        }

        if (interaction.customId.startsWith("rate_")) {

            const data = interaction.customId.split("_");

            const ticketId = data[1];
            const stars = data[2];
            const claimed = data[3];

            const ratings = loadRatings();

            if (ratings[`${interaction.user.id}_${ticketId}`]) {

                return interaction.reply({
                    content: "❌ قمت بالتقييم بالفعل",
                    ephemeral: true
                });
            }

            const modal = new ModalBuilder()

                .setCustomId(`ratingmodal_${ticketId}_${stars}_${claimed}`)

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

    if (interaction.isModalSubmit()) {

        if (interaction.customId === "close_modal") {

            const reason = interaction.fields.getTextInputValue("reason");

            await interaction.reply({
                content: "✅ تم إغلاق التذكرة",
                ephemeral: true
            });

            await closeTicket(
                interaction.channel,
                interaction.user,
                reason,
                false
            );
        }

        if (interaction.customId.startsWith("ratingmodal_")) {

            const data = interaction.customId.split("_");

            const ticketId = data[1];
            const stars = data[2];
            const claimed = data[3];

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
                        name: "الشخص المقيم",
                        value: `${interaction.user}`
                    },

                    {
                        name: "مستلم التذكرة",
                        value: claimed === "none"
                            ? "لم يتم الاستلام"
                            : `<@${claimed}>`
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
