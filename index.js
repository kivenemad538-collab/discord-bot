const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  AttachmentBuilder,
  MessageFlags,
} = require("discord.js");

// ======================================================
// CONFIG
// ======================================================
const TOKEN = process.env.TOKEN || "";
const SERVER_NAME = "Night City RP";

const SERVER_LOGO_URL =
  "https://cdn.discordapp.com/attachments/1466112784587821189/1478302405102931998/ChatGPT_Image_Feb_24_2026_05_21_31_PM.png?ex=69daa9a6&is=69d95826&hm=2eb51daf3a7021a3efe6a80315028f30803f502063be06c0b640af8fe3f5212d&";

const SERVER_RULES_LINK =
  "https://docs.google.com/document/d/1dKZLMztoq_Z1MJfW4JVG3Y-Y8baNOds2VJ3QxJ_LeIE/edit?tab=t.0";

const DISCORD_RULES_LINK =
  "https://docs.google.com/document/d/1dKZLMztoq_Z1MJfW4JVG3Y-Y8baNOds2VJ3QxJ_LeIE/edit?tab=t.1mbusaffy3vv";

// ================= CHANNEL IDS =================
const WELCOME_CHANNEL_ID = "1465609782680621254";
const RULES_CHANNEL_ID = "1465786939755200687";
const FEEDBACK_CHANNEL_ID = "1480098551248715896";
const CONTROL_PANEL_CHANNEL_ID = "1480098674578034698";
const HELP_CHANNEL_ID = "1492307966605394051";
const RP_APPLY_PANEL_CHANNEL_ID = "1465803291714785481";
const SERVICES_PANEL_CHANNEL_ID = "1465757986684403828";
const CREATOR_BOARD_CHANNEL_ID = "1490733587363004566";
const GANGS_PANEL_CHANNEL_ID = "1494093622281244683";
const GANGS_REVIEW_CATEGORY_ID = "1494117375736287242";

// ================= REVIEW CHANNEL IDS =================
const RP_REVIEW_CHANNEL_ID = "1477562618314459001";
const CREATOR_REVIEW_CHANNEL_ID = "1477777545767420116";
const ADMIN_REVIEW_CHANNEL_ID = "1479216695938650263";

// ================= VOICE =================
const VOICE_ROOM_ID = "1465752669564964935";

// ================= TICKET CATEGORIES =================
const SUPPORT_CATEGORY_ID = "1473850568811221194";
const APPEAL_CATEGORY_ID = "1492285484301549618";
const REPORT_CATEGORY_ID = "1492285484301549618";
const SUGGEST_CATEGORY_ID = "1492285484301549618";

// ================= ADMIN ROLES =================
const ADMIN_ROLE_IDS = [
  "1465798793772666941",
  "1465800480474005569",
  "1467593770898948158",
];

// ================= ACCEPT ROLES =================
const CREATOR_ROLE_ID = "1477845260095979552";
const ADMIN_ACCEPT_ROLE_ID = "1467593770898948158";
const RP_PASS_ROLE_ID = "1477569088988512266";
const RP_REJECT1_ROLE_ID = "1477568923208519681";
const RP_REJECT2_ROLE_ID = "1477569051185119332";

// ================= PANEL MARKERS =================
const PANEL_MARKER_RP = "PANEL_RP_APPLY_v40";
const PANEL_MARKER_SERVICES = "PANEL_SERVICES_v40";
const PANEL_MARKER_CONTROL = "PANEL_CONTROL_v40";
const PANEL_MARKER_CREATOR_BOARD = "PANEL_CREATOR_BOARD_v40";
const PANEL_MARKER_RULES = "PANEL_RULES_v40";
const PANEL_MARKER_HELP = "PANEL_HELP_v40";
const PANEL_MARKER_GANGS = "PANEL_GANGS_v40";

// ======================================================
// FILES
// ======================================================
const DATA_DIR = __dirname;
const SETTINGS_FILE = path.join(DATA_DIR, "bot_settings.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback_users.json");
const TICKET_RATINGS_FILE = path.join(DATA_DIR, "ticket_ratings.json");
const CREATORS_FILE = path.join(DATA_DIR, "creators.json");
const GANGS_FILE = path.join(DATA_DIR, "gangs.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");

// ======================================================
// QUESTIONS
// ======================================================
const RP_QUESTIONS = [
  { key: "fullName", q: "📌 ما الاسم الكامل للشخصية؟" },
  { key: "age", q: "🎂 كم عمرك؟" },
  { key: "country", q: "🌍 من أي دولة / مدينة؟" },
  { key: "playHours", q: "⏱️ كم ساعة تتواجد يوميًا؟" },
  { key: "experience", q: "🎮 هل لديك خبرة RP؟ اشرح باختصار." },
  { key: "rpMeaning", q: "📖 ما معنى RP بالنسبة لك؟" },
  { key: "powerGaming", q: "🚫 ما معنى PowerGaming؟ مع مثال." },
  { key: "metaGaming", q: "🚫 ما معنى MetaGaming؟ مع مثال." },
  { key: "fearRP", q: "😨 ما معنى FearRP؟ مع مثال." },
  { key: "rules", q: "📚 هل قرأت القوانين؟ اكتب نعم + أهم 5 نقاط فهمتها." },
  { key: "reportAction", q: "🚨 إذا رأيت لاعبًا يكسر القوانين، ماذا تفعل؟" },
  { key: "story", q: "📝 اكتب قصة للشخصية 150 كلمة على الأقل." },
  { key: "mic", q: "🎙️ هل لديك مايك جيد؟ (نعم/لا) + نوعه لو تعرف." },
  { key: "respectAdmin", q: "👮 هل تلتزم بقرارات الإدارة وتحترمها؟ (نعم/لا)" },
  { key: "whyServer", q: "⭐ لماذا تريد الانضمام إلى السيرفر؟" },
];

const CREATOR_QUESTIONS = [
  { key: "channelLink", q: "🔗 أرسل رابط القناة / الحساب." },
  { key: "followers", q: "👥 كم عدد المتابعين / المشتركين؟" },
  { key: "avgViews", q: "👁️ كم متوسط المشاهدات تقريبًا؟" },
  { key: "contentType", q: "📹 ما نوع المحتوى الذي تقدمه؟" },
  { key: "schedule", q: "📅 ما جدول النشر / البث؟" },
  { key: "rpExperience", q: "🎮 هل لديك خبرة RP؟" },
  { key: "serverPromo", q: "📢 كيف ستفيد السيرفر كمحتوى؟" },
  { key: "quality", q: "🎬 ما جودة المحتوى عندك؟" },
  { key: "activity", q: "⏱️ كم مرة تنشر أسبوعيًا؟" },
  { key: "why", q: "💡 لماذا تريد رتبة صانع محتوى؟" },
  { key: "agree", q: "✅ هل تلتزم بقوانين السيرفر؟ (نعم/لا)" },
];

const ADMIN_QUESTIONS = [
  { key: "discordName", q: "👤 ما اسمك في الديسكورد مع التاغ؟" },
  { key: "age", q: "🎂 كم عمرك؟" },
  { key: "timezone", q: "🕒 ما توقيتك / دولتك؟" },
  { key: "activity", q: "⏱️ كم ساعة تتواجد يوميًا؟" },
  { key: "experience", q: "🛡️ هل لديك خبرة إدارة؟ اشرح." },
  { key: "rules", q: "📚 اذكر 5 قوانين مهمة من وجهة نظرك." },
  { key: "conflict", q: "🤝 لو لاعبين بيتخانقوا كيف تتصرف؟" },
  { key: "powerGaming", q: "🚫 اشرح PowerGaming مع مثال." },
  { key: "metaGaming", q: "🚫 اشرح MetaGaming مع مثال." },
  { key: "reports", q: "🚨 لو جاءك بلاغ ضد صديقك، كيف تتصرف؟" },
  { key: "evidence", q: "📎 ما الأدلة التي تعتمد عليها؟" },
  { key: "pressure", q: "🧠 كيف تتعامل مع الضغط أو الإساءة أثناء المشكلة؟" },
  { key: "commit", q: "✅ هل تتعهد بالحياد وعدم إساءة استخدام الصلاحيات؟ (نعم/لا)" },
];

const GANG_QUESTIONS = [
  { key: "rpName", q: "🧾 ما اسمك داخل الرول بلاي؟" },
  { key: "realAge", q: "🎂 كم عمرك الحقيقي؟" },
  { key: "gangReason", q: "🏴 لماذا تريد تنضم للعصابة؟" },
  { key: "experience", q: "🎮 ما خبرتك في الرول بلاي أو العصابات؟" },
  { key: "activity", q: "⏱️ كم ساعة تقدر تتواجد يوميًا؟" },
  { key: "skills", q: "⚔️ ما الذي ستضيفه للعصابة؟" },
  { key: "loyalty", q: "🤝 ماذا يعني لك الولاء داخل العصابة؟" },
  { key: "story", q: "📝 اكتب نبذة محترمة عن شخصيتك وخلفيتها." },
  { key: "rules", q: "📚 هل قرأت قوانين السيرفر؟ اكتب نعم + أهم 3 نقاط." },
  { key: "agree", q: "✅ هل توافق على الالتزام بأوامر القيادة وقوانين السيرفر؟ (نعم/لا)" },
];

// ======================================================
// CLIENT
// ======================================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// ======================================================
// STORAGE
// ======================================================
const defaultSettings = {
  rpApply: true,
  support: true,
  appeal: true,
  report: true,
  suggest: true,
  creatorApply: true,
  adminApply: true,
  feedback: true,
  creatorRegistry: true,
  gangSystem: true,
  creatorBoardMessageId: null,
  gangsPanelMessageId: null,
};

function readJsonFile(file, fallback) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2), "utf8");
      return fallback;
    }
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.log("writeJsonFile error:", err?.message || err);
  }
}

let settings = { ...defaultSettings, ...readJsonFile(SETTINGS_FILE, defaultSettings) };
const feedbackUsers = new Set(readJsonFile(FEEDBACK_FILE, []));
const ticketRatings = readJsonFile(TICKET_RATINGS_FILE, {});
let creators = readJsonFile(CREATORS_FILE, []);
let gangs = readJsonFile(GANGS_FILE, []);
let sessions = readJsonFile(SESSIONS_FILE, {});
let ticketsStore = readJsonFile(TICKETS_FILE, { lastId: 0 });
const activeApplications = new Set();

function saveSettings() {
  writeJsonFile(SETTINGS_FILE, settings);
}
function saveFeedbackUsers() {
  writeJsonFile(FEEDBACK_FILE, [...feedbackUsers]);
}
function saveTicketRatings() {
  writeJsonFile(TICKET_RATINGS_FILE, ticketRatings);
}
function saveCreators() {
  writeJsonFile(CREATORS_FILE, creators);
}
function saveGangs() {
  writeJsonFile(GANGS_FILE, gangs);
}
function saveSessions() {
  writeJsonFile(SESSIONS_FILE, sessions);
}
function saveTicketsStore() {
  writeJsonFile(TICKETS_FILE, ticketsStore);
}

// ======================================================
// HELPERS
// ======================================================
function isAdmin(member) {
  if (!member) return false;
  if (member.permissions?.has(PermissionsBitField.Flags.Administrator)) return true;
  return ADMIN_ROLE_IDS.some((rid) => member.roles?.cache?.has(rid));
}

function safeTrim(v, max = 1024) {
  if (!v) return "";
  const s = String(v).trim();
  if (!s) return "";
  return s.length > max ? `${s.slice(0, max - 3)}...` : s;
}

function slugifyText(input, max = 60) {
  return (
    String(input || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\u0600-\u06FF -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max) || "item"
  );
}

function wordCount(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

function tooShortAnswer(text) {
  const t = String(text || "").trim();
  if (t.length < 2) return true;
  if (/^[0-9]+$/.test(t)) return true;
  return false;
}

function setSession(userId, data) {
  sessions[String(userId)] = data;
  saveSessions();
}

function getSession(userId) {
  return sessions[String(userId)] || null;
}

function endSession(userId) {
  delete sessions[String(userId)];
  saveSessions();
  activeApplications.delete(String(userId));
}

async function replyEphemeral(interaction, content) {
  if (interaction.replied || interaction.deferred) {
    return interaction.followUp({ content, flags: MessageFlags.Ephemeral }).catch(() => {});
  }
  return interaction.reply({ content, flags: MessageFlags.Ephemeral }).catch(() => {});
}

function getNextTicketId() {
  ticketsStore.lastId = Number(ticketsStore.lastId || 0) + 1;
  saveTicketsStore();
  return ticketsStore.lastId;
}

function ticketCategory(kind) {
  switch (kind) {
    case "support":
      return SUPPORT_CATEGORY_ID;
    case "appeal":
      return APPEAL_CATEGORY_ID;
    case "report":
      return REPORT_CATEGORY_ID;
    case "suggest":
      return SUGGEST_CATEGORY_ID;
    default:
      return SUPPORT_CATEGORY_ID;
  }
}

function ticketLabel(kind) {
  switch (kind) {
    case "support":
      return "🧰 دعم فني";
    case "appeal":
      return "📄 استئناف";
    case "report":
      return "🚨 شكوى عن لاعب";
    case "suggest":
      return "💡 اقتراح";
    default:
      return "🎫 تذكرة";
  }
}

function ticketTopic(ticketId, ownerId, kind, claimedBy = "none") {
  return `ID:${ticketId} | OWNER:${ownerId} | TYPE:${kind} | CLAIMED:${claimedBy}`;
}

function parseTicketTopic(topic) {
  const text = String(topic || "");
  return {
    id: text.match(/ID:([^|]+)/)?.[1]?.trim() || "0",
    owner: text.match(/OWNER:([^|]+)/)?.[1]?.trim() || null,
    type: text.match(/TYPE:([^|]+)/)?.[1]?.trim() || null,
    claimedBy: text.match(/CLAIMED:([^|]+)/)?.[1]?.trim() || "none",
  };
}

async function findMarkerMessage(channel, marker) {
  const msgs = await channel.messages.fetch({ limit: 50 }).catch(() => null);
  if (!msgs) return null;
  for (const [, msg] of msgs) {
    const footer = msg.embeds?.[0]?.footer?.text || "";
    if (footer.includes(marker)) return msg;
  }
  return null;
}

function disableMessageRows(message) {
  if (!message?.components?.length) return [];
  return message.components.map((row) => {
    const newRow = ActionRowBuilder.from(row);
    newRow.components = newRow.components.map((c) => ButtonBuilder.from(c).setDisabled(true));
    return newRow;
  });
}

// ======================================================
// GANG HELPERS
// ======================================================
function normalizeGang(raw) {
  return {
    id: String(raw.id || Date.now()),
    name: safeTrim(raw.name || "Gang", 80),
    reviewRoomId: String(raw.reviewRoomId || ""),
    roleId: raw.roleId ? String(raw.roleId) : "",
    limit: Number(raw.limit || 0),
    open: raw.open !== false,
    members: Array.isArray(raw.members) ? raw.members.map(String) : [],
    questions: Array.isArray(raw.questions) && raw.questions.length ? raw.questions : GANG_QUESTIONS,
    inviteLink: safeTrim(raw.inviteLink || "", 1000),
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

function normalizeAllGangs() {
  gangs = gangs.map(normalizeGang);
  saveGangs();
}

function getGangById(gangId) {
  return gangs.find((g) => String(g.id) === String(gangId)) || null;
}

function currentGangCount(gang) {
  return Array.isArray(gang?.members) ? gang.members.length : 0;
}

function isGangFull(gang) {
  if (!gang) return false;
  if (!gang.limit || gang.limit < 1) return false;
  return currentGangCount(gang) >= gang.limit;
}

function userInAnyGang(userId) {
  return gangs.some((g) => Array.isArray(g.members) && g.members.includes(String(userId)));
}

function getGangOfUser(userId) {
  return gangs.find((g) => Array.isArray(g.members) && g.members.includes(String(userId))) || null;
}

function addGangMember(gangId, userId) {
  const gang = getGangById(gangId);
  if (!gang) return false;
  if (!Array.isArray(gang.members)) gang.members = [];
  if (!gang.members.includes(String(userId))) {
    gang.members.push(String(userId));
    if (isGangFull(gang)) {
      gang.open = false;
    }
    saveGangs();
  }
  return true;
}

function removeGangMember(gangId, userId) {
  const gang = getGangById(gangId);
  if (!gang) return false;
  gang.members = (gang.members || []).filter((id) => String(id) !== String(userId));
  if (gang.limit > 0) gang.open = true;
  saveGangs();
  return true;
}

function chunkButtons(buttons, size = 5) {
  const rows = [];
  for (let i = 0; i < buttons.length; i += size) {
    rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + size)));
  }
  return rows;
}

function buildGangReviewFields(gang, answers) {
  return (gang.questions || GANG_QUESTIONS).map((q) => ({
    name: safeTrim(q.q, 256),
    value: safeTrim(answers[q.key], 1024) || "-",
    inline: false,
  }));
}

function buildGangControlSelectOptions() {
  if (!gangs.length) {
    return [
      {
        label: "لا توجد عصابات",
        value: "gang_none",
        description: "أنشئ عصابة أولًا",
        emoji: "🚫",
      },
    ];
  }

  return gangs.slice(0, 25).map((gang) => ({
    label: safeTrim(gang.name, 100),
    value: `gang_manage_${gang.id}`,
    description: `الأعضاء ${currentGangCount(gang)}/${gang.limit || 0} • ${gang.open ? "مفتوح" : "مغلق"}`,
    emoji: gang.open ? "🟢" : "🔴",
  }));
}

async function createGangReviewChannel(guild, gangName) {
  const category = await guild.channels.fetch(GANGS_REVIEW_CATEGORY_ID).catch(() => null);

  const baseConfig = {
    name: `gang-${slugifyText(gangName, 45)}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      ...ADMIN_ROLE_IDS.map((rid) => ({
        id: rid,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.ManageMessages,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.EmbedLinks,
        ],
      })),
    ],
  };

  if (category && category.type === ChannelType.GuildCategory) {
    const withParent = await guild.channels.create({
      ...baseConfig,
      parent: category.id,
    }).catch(() => null);

    if (withParent) return withParent;
  }

  const fallback = await guild.channels.create(baseConfig).catch((err) => {
    throw new Error(`createGangReviewChannel failed: ${err?.message || err}`);
  });

  return fallback;
}

async function tryDeleteGangReviewChannel(guild, channelId) {
  if (!channelId) return;
  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (channel) await channel.delete().catch(() => {});
}

async function tryRenameGangReviewChannel(guild, channelId, newGangName) {
  if (!channelId) return;
  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel) return;
  await channel.setName(`gang-${slugifyText(newGangName, 45)}`).catch(() => {});
}

// ======================================================
// CREATOR HELPERS
// ======================================================
const PLATFORMS = [
  { name: "Twitch", color: 0x9146ff, regex: /twitch\.tv\/([^/?#]+)/i },
  { name: "Kick", color: 0x53fc18, regex: /kick\.com\/([^/?#]+)/i },
  { name: "YouTube", color: 0xff0000, regex: /youtube\.com\/@([^/?#]+)/i },
  { name: "YouTube", color: 0xff0000, regex: /youtube\.com\/channel\/([^/?#]+)/i },
  { name: "YouTube", color: 0xff0000, regex: /youtube\.com\/c\/([^/?#]+)/i },
  { name: "YouTube", color: 0xff0000, regex: /youtube\.com\/user\/([^/?#]+)/i },
  { name: "TikTok", color: 0x111111, regex: /tiktok\.com\/@([^/?#]+)/i },
];

function parseCreatorLink(link) {
  const clean = String(link || "").trim();
  for (const p of PLATFORMS) {
    const match = clean.match(p.regex);
    if (match) {
      return {
        platform: p.name,
        color: p.color,
        name: match[1],
        link: clean,
      };
    }
  }
  return null;
}

function normalizeCreator(raw) {
  return {
    userId: String(raw.userId),
    name: safeTrim(raw.name || raw.channelName || "Unknown", 100),
    platform: safeTrim(raw.platform || "Unknown", 50),
    link: safeTrim(raw.link || "", 500),
    followers: toNumberLoose(raw.followers),
    avgViews: toNumberLoose(raw.avgViews),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function getCreatorByUserId(userId) {
  return creators.find((c) => String(c.userId) === String(userId));
}

function sortCreators() {
  creators = creators.map(normalizeCreator).sort((a, b) => {
    if ((b.avgViews || 0) !== (a.avgViews || 0)) return (b.avgViews || 0) - (a.avgViews || 0);
    return (b.followers || 0) - (a.followers || 0);
  });
}

function addOrUpdateCreator(data) {
  const next = normalizeCreator(data);
  const existing = getCreatorByUserId(next.userId);

  if (existing) {
    existing.name = next.name;
    existing.platform = next.platform;
    existing.link = next.link;
    existing.followers = next.followers;
    existing.avgViews = next.avgViews;
    existing.updatedAt = new Date().toISOString();
  } else {
    creators.push({ ...next, updatedAt: new Date().toISOString() });
  }

  sortCreators();
  saveCreators();
}

function creatorLeaderboardEmbed(guild) {
  sortCreators();

  const desc =
    creators.length > 0
      ? creators
          .map((c, i) => {
            const member = guild?.members?.cache?.get?.(String(c.userId));
            const mention = member ? `<@${c.userId}>` : `\`${c.userId}\``;
            return (
              `**#${i + 1}** ${mention}\n` +
              `• الاسم: **${safeTrim(c.name, 80)}**\n` +
              `• المنصة: **${safeTrim(c.platform, 40)}**\n` +
              `• المتابعين: **${Number(c.followers || 0).toLocaleString("en-US")}**\n` +
              `• متوسط المشاهدات: **${Number(c.avgViews || 0).toLocaleString("en-US")}**\n` +
              `• الرابط: ${safeTrim(c.link, 250)}`
            );
          })
          .join("\n\n")
      : "لا يوجد صناع محتوى مسجلين حاليًا.";

  return new EmbedBuilder()
    .setColor(0x00c2ff)
    .setTitle("🏆 لوحة صناع المحتوى")
    .setDescription(desc)
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_CREATOR_BOARD}` })
    .setTimestamp();
}

async function updateCreatorBoard(guild) {
  const ch = await guild.channels.fetch(CREATOR_BOARD_CHANNEL_ID).catch(() => null);
  if (!ch?.isTextBased()) return;

  let msg = null;
  if (settings.creatorBoardMessageId) {
    msg = await ch.messages.fetch(settings.creatorBoardMessageId).catch(() => null);
  }
  if (!msg) {
    msg = await findMarkerMessage(ch, PANEL_MARKER_CREATOR_BOARD);
  }

  const payload = { embeds: [creatorLeaderboardEmbed(guild)], components: [] };

  if (!msg) {
    const sent = await ch.send(payload).catch(() => null);
    if (sent) {
      settings.creatorBoardMessageId = sent.id;
      saveSettings();
    }
    return;
  }

  await msg.edit(payload).catch(() => {});
}

// ======================================================
// EMBEDS
// ======================================================
function buildWelcomeEmbed(member) {
  return new EmbedBuilder()
    .setColor(0x2b6cff)
    .setTitle(`👋 Welcome To ${SERVER_NAME}`)
    .setDescription(
      `مرحباً <@${member.id}>\n\n` +
        `أهلاً بك في **${SERVER_NAME}**\n\n` +
        "يرجى قراءة القوانين ثم التقديم على الوايت ليست.\n" +
        "ولو حابب تقدم على عصابة هتلاقي بانل العصابات في روم الخدمات."
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: SERVER_NAME })
    .setTimestamp();
}

function buildRulesEmbed() {
  return new EmbedBuilder()
    .setColor(0xff0000)
    .setAuthor({ name: SERVER_NAME, iconURL: SERVER_LOGO_URL || undefined })
    .setDescription(
      "قوانين ليست للتهاون\n\n" +
        "جميع القوانين قابلة للتغيير في أي وقت.\n" +
        "يرجى الاطلاع عليها من حين لآخر لضمان معرفتك بأحدث التحديثات."
    )
    .setImage(SERVER_LOGO_URL || null)
    .setFooter({ text: SERVER_NAME });
}

function buildHelpEmbed() {
  return new EmbedBuilder()
    .setColor(0xff0000)
    .setAuthor({ name: SERVER_NAME, iconURL: SERVER_LOGO_URL || undefined })
    .setDescription("إذا عندك أي مشكلة في السيرفر أو البوت، استخدم التذاكر أو تواصل مع الإدارة.")
    .setFooter({ text: `${SERVER_NAME} • Help Center` });
}

function rpAcceptEmbed(guildId) {
  const url = `https://discord.com/channels/${guildId}/${VOICE_ROOM_ID}`;
  return {
    embed: new EmbedBuilder()
      .setColor(0x00ff88)
      .setTitle("🏙️ تم قبولك في السيرفر!")
      .setDescription(
        "🎉 مبروك\n\n" +
          `تم قبول طلبك في **${SERVER_NAME}**.\n\n` +
          "الخطوة التالية هي المقابلة الصوتية."
      )
      .setFooter({ text: `${SERVER_NAME} • الإدارة` })
      .setTimestamp(),
    row: new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("🎤 دخول المقابلة الصوتية").setStyle(ButtonStyle.Link).setURL(url)
    ),
  };
}

function creatorAcceptEmbed() {
  return new EmbedBuilder()
    .setColor(0x00ff88)
    .setTitle("🎥 تم قبولك كصانع محتوى!")
    .setDescription(
      "🎉 مبروك\n\n" +
        `تم قبولك في برنامج صناع المحتوى في **${SERVER_NAME}**.\n\n` +
        "وتم تسجيل بياناتك داخل النظام."
    )
    .setFooter({ text: `${SERVER_NAME} • الإدارة` })
    .setTimestamp();
}

function adminAcceptEmbed() {
  return new EmbedBuilder()
    .setColor(0x00ff88)
    .setTitle("🛡️ تم قبولك في الإدارة!")
    .setDescription(
      `تم قبولك في فريق إدارة **${SERVER_NAME}**.\n\n` +
        "تم منحك الرتبة بنجاح."
    )
    .setFooter({ text: `${SERVER_NAME} • الإدارة` })
    .setTimestamp();
}

function rpRejectEmbed(reason, finalReject = false) {
  return new EmbedBuilder()
    .setColor(0xff2d2d)
    .setTitle(finalReject ? "⛔ تم رفض طلبك نهائيًا" : "❌ تم رفض طلبك")
    .setDescription(
      `**سبب الرفض:**\n${safeTrim(reason, 1500)}\n\n` +
        (finalReject
          ? "تم رفضك نهائيًا ولا يمكنك التقديم مرة أخرى."
          : "يمكنك إعادة التقديم لاحقًا بعد تحسين مستواك.")
    )
    .setFooter({ text: `${SERVER_NAME} • الإدارة` })
    .setTimestamp();
}

function creatorRejectEmbed(reason) {
  return new EmbedBuilder()
    .setColor(0xff2d2d)
    .setTitle("❌ تم رفض طلب صانع المحتوى")
    .setDescription(`**سبب الرفض:**\n${safeTrim(reason, 1500)}`)
    .setFooter({ text: `${SERVER_NAME} • الإدارة` })
    .setTimestamp();
}

function adminRejectEmbed(reason) {
  return new EmbedBuilder()
    .setColor(0xff2d2d)
    .setTitle("❌ تم رفض طلب الإدارة")
    .setDescription(`**سبب الرفض:**\n${safeTrim(reason, 1500)}`)
    .setFooter({ text: `${SERVER_NAME} • الإدارة` })
    .setTimestamp();
}

function ticketOpenEmbed(userId, kind, ticketId, claimedBy = "none") {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`🎫 Ticket #${ticketId}`)
    .setDescription(
      `👤 صاحب التذكرة: <@${userId}>\n` +
      `📂 النوع: ${ticketLabel(kind)}\n` +
      `📌 المستلم: ${claimedBy !== "none" ? `<@${claimedBy}>` : "لم يتم الاستلام"}\n\n` +
      "⏳ انتظر حتى يستلم أحد الإدمن التذكرة، وبعدها ستقدر تكتب"
    )
    .setFooter({ text: `${SERVER_NAME} • Support System` })
    .setTimestamp();
}

function ticketClaimedEmbed(ticketId, ownerId, kind, claimedBy) {
  return new EmbedBuilder()
    .setColor(0x00ff88)
    .setTitle(`📌 تم استلام التذكرة #${ticketId}`)
    .setDescription(
      `**صاحب التذكرة:** <@${ownerId}>\n` +
      `**نوع التذكرة:** ${ticketLabel(kind)}\n` +
      `**تم الاستلام بواسطة:** <@${claimedBy}>`
    )
    .setFooter({ text: `${SERVER_NAME} • Tickets` })
    .setTimestamp();
}

function ticketClosedDmEmbed(ticketId, reason, channelName, claimedBy = "none", closedBy = "none") {
  return new EmbedBuilder()
    .setColor(0xff3b30)
    .setTitle(`🔒 تم إغلاق تذكرتك #${ticketId}`)
    .setDescription(
      `**اسم التذكرة:** ${channelName}\n` +
      `**المستلم:** ${claimedBy !== "none" ? `<@${claimedBy}>` : "لم يتم الاستلام"}\n` +
      `**تم الإغلاق بواسطة:** ${closedBy !== "none" ? `<@${closedBy}>` : "غير معروف"}\n\n` +
      `**سبب الإغلاق:**\n${safeTrim(reason, 1800)}`
    )
    .setFooter({ text: `${SERVER_NAME} • Support` })
    .setTimestamp();
}

function buildTicketRatingRow(ticketId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`ticket_rate_${ticketId}_1`).setLabel("⭐").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(`ticket_rate_${ticketId}_2`).setLabel("⭐⭐").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`ticket_rate_${ticketId}_3`).setLabel("⭐⭐⭐").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`ticket_rate_${ticketId}_4`).setLabel("⭐⭐⭐⭐").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`ticket_rate_${ticketId}_5`).setLabel("⭐⭐⭐⭐⭐").setStyle(ButtonStyle.Success)
  );
}

function buildGangPanelEmbed() {
  const list =
    gangs.length > 0
      ? gangs
          .map((g, i) => {
            return (
              `**${i + 1}. ${safeTrim(g.name, 80)}**\n` +
              `• الحالة: ${g.open ? "🟢 مفتوح" : "🔴 مغلق"}\n` +
              `• الأعضاء: ${currentGangCount(g)}/${g.limit || 0}`
            );
          })
          .join("\n\n")
      : "لا توجد عصابات مضافة حاليًا.";

  return new EmbedBuilder()
    .setColor(0x111111)
    .setTitle("🏴 بانل تقديم العصابات")
    .setDescription(
      "اضغط على زر العصابة التي تريد التقديم عليها.\n" +
        "التقديم يتم في الخاص DM سؤال ورا سؤال.\n\n" +
        list
    )
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_GANGS}` })
    .setTimestamp();
}

function buildGangAppliedDmEmbed(gangName) {
  return new EmbedBuilder()
    .setColor(0x00c853)
    .setTitle("✅ بدأ تقديم العصابة")
    .setDescription(
      `تم بدء تقديمك على عصابة **${gangName}**.\n\n` +
        "أجب على الأسئلة بدقة في الخاص."
    )
    .setFooter({ text: `${SERVER_NAME} • Gangs` })
    .setTimestamp();
}

function buildGangAcceptEmbed(gang, link) {
  const parts = [
    `تم قبول تقديمك في عصابة **${gang.name}**.`,
    gang.roleId ? "تم أيضًا منحك رول العصابة داخل الديسكورد." : "",
    link ? `**لينك سيرفر العصابة:**\n${safeTrim(link, 1000)}` : "",
  ].filter(Boolean);

  return new EmbedBuilder()
    .setColor(0x00ff88)
    .setTitle("🏴 تم قبولك في العصابة!")
    .setDescription(parts.join("\n\n"))
    .setFooter({ text: `${SERVER_NAME} • Gangs` })
    .setTimestamp();
}

function buildGangRejectEmbed(gangName, reason) {
  return new EmbedBuilder()
    .setColor(0xff2d2d)
    .setTitle("❌ تم رفض تقديم العصابة")
    .setDescription(
      `تم رفض تقديمك على عصابة **${gangName}**.\n\n` +
        `**سبب الرفض:**\n${safeTrim(reason, 1500)}`
    )
    .setFooter({ text: `${SERVER_NAME} • Gangs` })
    .setTimestamp();
}
// ======================================================
// PANELS
// ======================================================
async function buildRpPanelPayload() {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📝 التقديم على السيرفر")
    .setDescription("اضغط الزر بالأسفل لبدء التقديم في الخاص.")
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_RP}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("start_rp_apply")
      .setLabel(settings.rpApply ? "🚀 تقديم" : "🚫 مغلق")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!settings.rpApply)
  );

  return { embeds: [embed], components: [row] };
}

async function buildServicesPanelPayload() {
  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle("🎫 الخدمات")
    .setDescription("اختار نوع التذكرة أو التقديم")
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_SERVICES}` });

  const options = [];

  if (settings.support) options.push({ label: "دعم", value: "support", emoji: "🧰" });
  if (settings.appeal) options.push({ label: "استئناف", value: "appeal", emoji: "📄" });
  if (settings.report) options.push({ label: "شكوى", value: "report", emoji: "🚨" });
  if (settings.suggest) options.push({ label: "اقتراح", value: "suggest", emoji: "💡" });
  if (settings.creatorApply) options.push({ label: "Creator", value: "creator_apply", emoji: "🎥" });
  if (settings.adminApply) options.push({ label: "Admin", value: "admin_apply", emoji: "🛡️" });

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("ticket_select")
      .setPlaceholder("اختار")
      .addOptions(options)
  );

  return { embeds: [embed], components: [row] };
}

async function buildControlPanelPayload() {
  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle("🎛️ Control Panel")
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_CONTROL}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("create_gang").setLabel("🏴 إنشاء عصابة").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("manage_gangs").setLabel("⚙️ إدارة عصابات").setStyle(ButtonStyle.Secondary)
  );

  return { embeds: [embed], components: [row] };
}

async function buildRulesPanelPayload() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("Server Rules").setStyle(ButtonStyle.Link).setURL(SERVER_RULES_LINK),
    new ButtonBuilder().setLabel("Discord Rules").setStyle(ButtonStyle.Link).setURL(DISCORD_RULES_LINK)
  );

  return {
    embeds: [buildRulesEmbed().setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_RULES}` })],
    components: [row],
  };
}

async function buildHelpPanelPayload() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("help_ar").setLabel("عربي").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("help_en").setLabel("English").setStyle(ButtonStyle.Secondary)
  );

  return {
    embeds: [buildHelpEmbed().setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_HELP}` })],
    components: [row],
  };
}

async function buildGangsPanelPayload() {
  const embed = buildGangPanelEmbed();

  if (!gangs.length) {
    return {
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("gang_none").setLabel("لا يوجد عصابات").setDisabled(true).setStyle(ButtonStyle.Secondary)
        ),
      ],
    };
  }

  const buttons = gangs.map((g) =>
    new ButtonBuilder()
      .setCustomId(`apply_gang_${g.id}`)
      .setLabel(g.name)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!g.open)
  );

  return { embeds: [embed], components: chunkButtons(buttons) };
}

// ======================================================
// UPDATE PANELS
// ======================================================
async function updatePanel(channelId, marker, payload, guild) {
  const ch = await guild.channels.fetch(channelId).catch(() => null);
  if (!ch?.isTextBased()) return;

  let msg = await findMarkerMessage(ch, marker);

  if (!msg) {
    const sent = await ch.send(payload);
    return sent.id;
  } else {
    await msg.edit(payload);
    return msg.id;
  }
}

async function ensurePanels(guild) {
  await updatePanel(RP_APPLY_PANEL_CHANNEL_ID, PANEL_MARKER_RP, await buildRpPanelPayload(), guild);
  await updatePanel(SERVICES_PANEL_CHANNEL_ID, PANEL_MARKER_SERVICES, await buildServicesPanelPayload(), guild);
  await updatePanel(CONTROL_PANEL_CHANNEL_ID, PANEL_MARKER_CONTROL, await buildControlPanelPayload(), guild);
  await updatePanel(RULES_CHANNEL_ID, PANEL_MARKER_RULES, await buildRulesPanelPayload(), guild);
  await updatePanel(HELP_CHANNEL_ID, PANEL_MARKER_HELP, await buildHelpPanelPayload(), guild);
  await updatePanel(GANGS_PANEL_CHANNEL_ID, PANEL_MARKER_GANGS, await buildGangsPanelPayload(), guild);
  await updateCreatorBoard(guild);
}

// ======================================================
// APPLICATION FLOW
// ======================================================
async function startDmFlow(user, guild, type, extra = {}) {
  if (activeApplications.has(user.id)) return { ok: false };

  activeApplications.add(user.id);

  const questions =
    type === "rp"
      ? RP_QUESTIONS
      : type === "creator"
      ? CREATOR_QUESTIONS
      : type === "admin"
      ? ADMIN_QUESTIONS
      : extra.questions || GANG_QUESTIONS;

  setSession(user.id, {
    type,
    guildId: guild.id,
    step: 0,
    answers: {},
    questions,
    ...(type === "gang" ? { gangId: extra.gangId } : {}),
  });

  try {
    await user.send("ابدأ الإجابة:");
    await user.send(questions[0].q);
    return { ok: true };
  } catch {
    endSession(user.id);
    return { ok: false };
  }
}

// ======================================================
// REVIEW SEND
// ======================================================
function reviewFieldsFromQuestions(questions, answers) {
  return questions.map((q) => ({
    name: q.q,
    value: answers[q.key] || "-",
  }));
}

async function submitRpToReview(guild, userId, answers) {
  const ch = await guild.channels.fetch(RP_REVIEW_CHANNEL_ID);
  const embed = new EmbedBuilder()
    .setTitle("RP Apply")
    .addFields(reviewFieldsFromQuestions(RP_QUESTIONS, answers))
    .setFooter({ text: `type:rp|user:${userId}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`approve_rp_${userId}`).setLabel("قبول").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`reject_rp_${userId}`).setLabel("رفض").setStyle(ButtonStyle.Danger)
  );

  await ch.send({ embeds: [embed], components: [row] });
}

async function submitGangToReview(guild, userId, gangId, answers) {
  const gang = getGangById(gangId);
  const ch = await guild.channels.fetch(gang.reviewRoomId);

  const embed = new EmbedBuilder()
    .setTitle(`Gang Apply: ${gang.name}`)
    .addFields(buildGangReviewFields(gang, answers))
    .setFooter({ text: `type:gang|user:${userId}|gang:${gangId}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`accept_gang_${gangId}_${userId}`).setLabel("قبول").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`reject_gang_${gangId}_${userId}`).setLabel("رفض").setStyle(ButtonStyle.Danger)
  );

  await ch.send({ embeds: [embed], components: [row] });
}
// ======================================================
// TICKET SYSTEM (ADVANCED)
// ======================================================
let ticketCounter = 1;

function generateTicketId() {
  return ticketCounter++;
}

function ticketTopic(ownerId, kind, ticketId, claimedBy = "none") {
  return `ID:${ticketId}|OWNER:${ownerId}|TYPE:${kind}|CLAIMED:${claimedBy}`;
}

function parseTicketTopic(topic) {
  const t = String(topic || "");
  return {
    id: t.match(/ID:(\d+)/)?.[1],
    owner: t.match(/OWNER:(\d+)/)?.[1],
    type: t.match(/TYPE:([^|]+)/)?.[1],
    claimedBy: t.match(/CLAIMED:([^|]+)/)?.[1] || "none",
  };
}

// ======================================================
// CREATE TICKET
// ======================================================
async function createTicket(interaction, kind) {
  const guild = interaction.guild;

  const categoryId = ticketCategory(kind);

  const existing = guild.channels.cache.find((c) => {
    const info = parseTicketTopic(c.topic);
    return info.owner === interaction.user.id;
  });

  if (existing) {
    return replyEphemeral(interaction, "❌ عندك تذكرة مفتوحة بالفعل");
  }

  const ticketId = generateTicketId();

  const channel = await guild.channels.create({
    name: `ticket-${ticketId}`,
    type: ChannelType.GuildText,
    parent: categoryId,
    topic: ticketTopic(interaction.user.id, kind, ticketId),
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
        deny: [PermissionsBitField.Flags.SendMessages], // ❌ ممنوع يكتب لحد ما الادمن يستلم
      },
      ...ADMIN_ROLE_IDS.map((rid) => ({
        id: rid,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ManageChannels,
        ],
      })),
    ],
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("ticket_claim").setLabel("📌 استلام").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ticket_close").setLabel("❌ اغلاق").setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    content: `<@${interaction.user.id}>`,
    embeds: [ticketOpenEmbed(interaction.user.id, kind, ticketId)],
    components: [row],
  });

  await interaction.user.send(`✅ تم فتح التذكرة #${ticketId}`);

  return replyEphemeral(interaction, "✅ تم فتح التذكرة");
}

// ======================================================
// CLAIM TICKET
// ======================================================
async function claimTicket(interaction) {
  const info = parseTicketTopic(interaction.channel.topic);

  if (info.claimedBy !== "none") {
    return replyEphemeral(interaction, "❌ التذكرة مستلمة بالفعل");
  }

  // تعديل topic
  const newTopic = ticketTopic(info.owner, info.type, info.id, interaction.user.id);
  await interaction.channel.setTopic(newTopic);

  // السماح لصاحب التذكرة بالكتابة
  await interaction.channel.permissionOverwrites.edit(info.owner, {
    SendMessages: true,
  });

  await interaction.channel.send({
    embeds: [ticketClaimedEmbed(info.id, info.owner, info.type, interaction.user.id)],
  });

  return replyEphemeral(interaction, "✅ تم الاستلام");
}

// ======================================================
// CLOSE TICKET
// ======================================================
async function closeTicketWithReason(interaction, reason) {
  const info = parseTicketTopic(interaction.channel.topic);

  const user = await interaction.client.users.fetch(info.owner).catch(() => null);

  if (user) {
    await user.send({
      embeds: [
        ticketClosedDmEmbed(
          info.id,
          reason,
          interaction.channel.name,
          info.claimedBy,
          interaction.user.id
        ),
      ],
      components: [buildTicketRatingRow(info.id)],
    }).catch(() => {});
  }

  await interaction.channel.delete();
}

// ======================================================
// INTERACTIONS
// ======================================================
client.on("interactionCreate", async (interaction) => {
  try {
    // ================= SELECT =================
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "ticket_select") {
        const val = interaction.values[0];

        if (["support", "appeal", "report", "suggest"].includes(val)) {
          return createTicket(interaction, val);
        }

        if (val === "creator_apply") {
          await startDmFlow(interaction.user, interaction.guild, "creator");
          return replyEphemeral(interaction, "📩 اتبعتلك DM");
        }

        if (val === "admin_apply") {
          await startDmFlow(interaction.user, interaction.guild, "admin");
          return replyEphemeral(interaction, "📩 اتبعتلك DM");
        }
      }
    }

    // ================= BUTTONS =================
    if (interaction.isButton()) {

      // RP APPLY
      if (interaction.customId === "start_rp_apply") {
        await startDmFlow(interaction.user, interaction.guild, "rp");
        return replyEphemeral(interaction, "📩 check DM");
      }

      // GANG APPLY
      if (interaction.customId.startsWith("apply_gang_")) {
        const gangId = interaction.customId.split("_")[2];
        await startDmFlow(interaction.user, interaction.guild, "gang", { gangId });
        return replyEphemeral(interaction, "📩 DM");
      }

      // ================= TICKETS =================
      if (interaction.customId === "ticket_claim") {
        if (!isAdmin(interaction.member)) return;
        return claimTicket(interaction);
      }

      if (interaction.customId === "ticket_close") {
        return interaction.showModal(
          new ModalBuilder()
            .setCustomId("modal_close_ticket")
            .setTitle("Close Ticket")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("reason")
                  .setLabel("reason")
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      // ================= RATING =================
      if (interaction.customId.startsWith("ticket_rate_")) {
        const [_, __, ticketId, stars] = interaction.customId.split("_");

        return interaction.showModal(
          new ModalBuilder()
            .setCustomId(`rate_${ticketId}_${stars}`)
            .setTitle("سبب التقييم")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("reason")
                  .setLabel("قول رأيك")
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }
    }

    // ================= MODALS =================
    if (interaction.isModalSubmit()) {

      if (interaction.customId === "modal_close_ticket") {
        const reason = interaction.fields.getTextInputValue("reason");
        return closeTicketWithReason(interaction, reason);
      }

      if (interaction.customId.startsWith("rate_")) {
        const [_, ticketId, stars] = interaction.customId.split("_");
        const reason = interaction.fields.getTextInputValue("reason");

        const ch = await interaction.guild.channels.fetch(FEEDBACK_CHANNEL_ID);

        await ch.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("⭐ تقييم")
              .setDescription(
                `Ticket #${ticketId}\n` +
                `User: <@${interaction.user.id}>\n` +
                `Stars: ${"⭐".repeat(stars)}\n\n` +
                reason
              ),
          ],
        });

        return replyEphemeral(interaction, "✅ شكرا");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// ======================================================
// DM FLOW
// ======================================================
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (message.guild) return;

    const session = getSession(message.author.id);
    if (!session) return;

    const guild = client.guilds.cache.get(session.guildId);
    if (!guild) {
      endSession(message.author.id);
      return;
    }

    const questions = session.questions || [];
    const current = questions[session.step];
    if (!current) {
      endSession(message.author.id);
      return;
    }

    const answer = safeTrim(message.content, 1800);

    if (tooShortAnswer(answer)) {
      await message.channel.send("❌ الإجابة قصيرة جدًا").catch(() => {});
      return;
    }

    if (session.type === "rp" && current.key === "story" && wordCount(answer) < 150) {
      await message.channel.send("❌ قصة الشخصية لازم 150 كلمة على الأقل").catch(() => {});
      return;
    }

    session.answers[current.key] = answer;
    session.step += 1;
    setSession(message.author.id, session);

    if (session.step < questions.length) {
      await message.channel.send(questions[session.step].q).catch(() => {});
      return;
    }

    if (session.type === "rp") {
      await submitRpToReview(guild, message.author.id, session.answers);
    } else if (session.type === "gang") {
      await submitGangToReview(guild, message.author.id, session.gangId, session.answers);
    } else if (session.type === "creator") {
      const ch = await guild.channels.fetch(CREATOR_REVIEW_CHANNEL_ID).catch(() => null);
      if (ch?.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(0x00c853)
          .setTitle("🎥 Creator Apply")
          .addFields(reviewFieldsFromQuestions(CREATOR_QUESTIONS, session.answers))
          .setFooter({ text: `type:creator|user:${message.author.id}` });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`approve_creator_${message.author.id}`).setLabel("قبول").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`reject_creator_${message.author.id}`).setLabel("رفض").setStyle(ButtonStyle.Danger)
        );

        await ch.send({ embeds: [embed], components: [row] }).catch(() => {});
      }
    } else if (session.type === "admin") {
      const ch = await guild.channels.fetch(ADMIN_REVIEW_CHANNEL_ID).catch(() => null);
      if (ch?.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(0xff9800)
          .setTitle("🛡️ Admin Apply")
          .addFields(reviewFieldsFromQuestions(ADMIN_QUESTIONS, session.answers))
          .setFooter({ text: `type:admin|user:${message.author.id}` });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`approve_admin_${message.author.id}`).setLabel("قبول").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`reject_admin_${message.author.id}`).setLabel("رفض").setStyle(ButtonStyle.Danger)
        );

        await ch.send({ embeds: [embed], components: [row] }).catch(() => {});
      }
    }

    await message.channel.send("✅ تم إرسال التقديم للمراجعة").catch(() => {});
    endSession(message.author.id);
  } catch (err) {
    console.log("DM flow error:", err?.message || err);
  }
});

// ======================================================
// EXTRA INTERACTION ACTIONS
// ======================================================
client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu()) return;

    // ================= GANG ACCEPT/REJECT =================
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("accept_gang_")) {
        if (!isAdmin(interaction.member)) return;

        const [, , gangId, userId] = interaction.customId.split("_");
        const gang = getGangById(gangId);
        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة");
        if (isGangFull(gang)) return replyEphemeral(interaction, "❌ العصابة ممتلئة");

        return interaction.showModal(
          new ModalBuilder()
            .setCustomId(`gang_accept_modal_${gangId}_${userId}`)
            .setTitle("قبول بالعصابة")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("invite")
                  .setLabel("لينك السيرفر")
                  .setRequired(false)
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      if (interaction.customId.startsWith("reject_gang_")) {
        if (!isAdmin(interaction.member)) return;

        const [, , gangId, userId] = interaction.customId.split("_");
        return interaction.showModal(
          new ModalBuilder()
            .setCustomId(`gang_reject_modal_${gangId}_${userId}`)
            .setTitle("رفض تقديم العصابة")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("reason")
                  .setLabel("سبب الرفض")
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      // ================= RP APPROVE/REJECT =================
      if (interaction.customId.startsWith("approve_rp_")) {
        if (!isAdmin(interaction.member)) return;

        const userId = interaction.customId.replace("approve_rp_", "");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.roles.remove([RP_REJECT1_ROLE_ID, RP_REJECT2_ROLE_ID]).catch(() => {});
          await memberTarget.roles.add(RP_PASS_ROLE_ID).catch(() => {});
          const payload = rpAcceptEmbed(interaction.guild.id);
          await memberTarget.send({ embeds: [payload.embed], components: [payload.row] }).catch(() => {});
        }

        await interaction.update({ components: disableMessageRows(interaction.message) }).catch(() => {});
        return;
      }

      if (interaction.customId.startsWith("reject_rp_")) {
        if (!isAdmin(interaction.member)) return;

        const userId = interaction.customId.replace("reject_rp_", "");
        return interaction.showModal(
          new ModalBuilder()
            .setCustomId(`rp_reject_modal_${userId}`)
            .setTitle("رفض RP")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("reason")
                  .setLabel("سبب الرفض")
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      // ================= CREATOR APPROVE/REJECT =================
      if (interaction.customId.startsWith("approve_creator_")) {
        if (!isAdmin(interaction.member)) return;

        const userId = interaction.customId.replace("approve_creator_", "");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.roles.add(CREATOR_ROLE_ID).catch(() => {});
          await memberTarget.send({ embeds: [creatorAcceptEmbed()] }).catch(() => {});
        }

        await interaction.update({ components: disableMessageRows(interaction.message) }).catch(() => {});
        return;
      }

      if (interaction.customId.startsWith("reject_creator_")) {
        if (!isAdmin(interaction.member)) return;

        const userId = interaction.customId.replace("reject_creator_", "");
        return interaction.showModal(
          new ModalBuilder()
            .setCustomId(`creator_reject_modal_${userId}`)
            .setTitle("رفض Creator")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("reason")
                  .setLabel("سبب الرفض")
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      // ================= ADMIN APPROVE/REJECT =================
      if (interaction.customId.startsWith("approve_admin_")) {
        if (!isAdmin(interaction.member)) return;

        const userId = interaction.customId.replace("approve_admin_", "");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.roles.add(ADMIN_ACCEPT_ROLE_ID).catch(() => {});
          await memberTarget.send({ embeds: [adminAcceptEmbed()] }).catch(() => {});
        }

        await interaction.update({ components: disableMessageRows(interaction.message) }).catch(() => {});
        return;
      }

      if (interaction.customId.startsWith("reject_admin_")) {
        if (!isAdmin(interaction.member)) return;

        const userId = interaction.customId.replace("reject_admin_", "");
        return interaction.showModal(
          new ModalBuilder()
            .setCustomId(`admin_reject_modal_${userId}`)
            .setTitle("رفض Admin")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("reason")
                  .setLabel("سبب الرفض")
                  .setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      // ================= CONTROL PANEL BUTTONS =================
      if (interaction.customId === "create_gang") {
        if (!isAdmin(interaction.member)) return;

        return interaction.showModal(
          new ModalBuilder()
            .setCustomId("create_gang_modal")
            .setTitle("إنشاء عصابة")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId("name").setLabel("اسم العصابة").setStyle(TextInputStyle.Short)
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId("limit").setLabel("الحد").setStyle(TextInputStyle.Short)
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId("roleId").setLabel("Role ID اختياري").setRequired(false).setStyle(TextInputStyle.Short)
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId("inviteLink").setLabel("لينك العصابة").setRequired(false).setStyle(TextInputStyle.Paragraph)
              )
            )
        );
      }

      if (interaction.customId === "manage_gangs") {
        if (!isAdmin(interaction.member)) return;

        return interaction.reply({
          content: gangs.length ? gangs.map((g) => `• ${g.name}`).join("\n") : "لا يوجد عصابات",
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // ================= MODALS ACTIONS =================
    if (interaction.isModalSubmit()) {
      // GANG ACCEPT
      if (interaction.customId.startsWith("gang_accept_modal_")) {
        const [, , , gangId, userId] = interaction.customId.split("_");
        const gang = getGangById(gangId);
        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة");

        const manualInvite = safeTrim(interaction.fields.getTextInputValue("invite"), 1000);
        const finalLink = manualInvite || gang.inviteLink || "";

        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);
        if (memberTarget) {
          if (gang.roleId) {
            await memberTarget.roles.add(gang.roleId).catch(() => {});
          }

          addGangMember(gang.id, userId);

          await memberTarget.send({
            embeds: [buildGangAcceptEmbed(gang, finalLink)],
          }).catch(() => {});
        }

        await interaction.reply({ content: "✅ تم قبول العضو", flags: MessageFlags.Ephemeral });
        return;
      }

      // GANG REJECT
      if (interaction.customId.startsWith("gang_reject_modal_")) {
        const [, , , gangId, userId] = interaction.customId.split("_");
        const reason = interaction.fields.getTextInputValue("reason");
        const gang = getGangById(gangId);
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (gang && memberTarget) {
          await memberTarget.send({
            embeds: [buildGangRejectEmbed(gang.name, reason)],
          }).catch(() => {});
        }

        await interaction.reply({ content: "✅ تم الرفض", flags: MessageFlags.Ephemeral });
        return;
      }

      // RP REJECT
      if (interaction.customId.startsWith("rp_reject_modal_")) {
        const userId = interaction.customId.replace("rp_reject_modal_", "");
        const reason = interaction.fields.getTextInputValue("reason");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          const alreadyRejectedOnce = memberTarget.roles.cache.has(RP_REJECT1_ROLE_ID);

          if (alreadyRejectedOnce) {
            await memberTarget.roles.remove(RP_REJECT1_ROLE_ID).catch(() => {});
            await memberTarget.roles.add(RP_REJECT2_ROLE_ID).catch(() => {});
            await memberTarget.send({ embeds: [rpRejectEmbed(reason, true)] }).catch(() => {});
          } else {
            await memberTarget.roles.add(RP_REJECT1_ROLE_ID).catch(() => {});
            await memberTarget.send({ embeds: [rpRejectEmbed(reason, false)] }).catch(() => {});
          }
        }

        await interaction.reply({ content: "✅ تم الرفض", flags: MessageFlags.Ephemeral });
        return;
      }

      // CREATOR REJECT
      if (interaction.customId.startsWith("creator_reject_modal_")) {
        const userId = interaction.customId.replace("creator_reject_modal_", "");
        const reason = interaction.fields.getTextInputValue("reason");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.send({ embeds: [creatorRejectEmbed(reason)] }).catch(() => {});
        }

        await interaction.reply({ content: "✅ تم الرفض", flags: MessageFlags.Ephemeral });
        return;
      }

      // ADMIN REJECT
      if (interaction.customId.startsWith("admin_reject_modal_")) {
        const userId = interaction.customId.replace("admin_reject_modal_", "");
        const reason = interaction.fields.getTextInputValue("reason");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.send({ embeds: [adminRejectEmbed(reason)] }).catch(() => {});
        }

        await interaction.reply({ content: "✅ تم الرفض", flags: MessageFlags.Ephemeral });
        return;
      }

      // CREATE GANG
      if (interaction.customId === "create_gang_modal") {
        const name = safeTrim(interaction.fields.getTextInputValue("name"), 80);
        const limit = Number(interaction.fields.getTextInputValue("limit")) || 0;
        const roleId = safeTrim(interaction.fields.getTextInputValue("roleId"), 50);
        const inviteLink = safeTrim(interaction.fields.getTextInputValue("inviteLink"), 1000);

        if (!name) return replyEphemeral(interaction, "❌ الاسم مطلوب");

        const reviewRoom = await createGangReviewChannel(interaction.guild, name).catch(() => null);
        if (!reviewRoom) return replyEphemeral(interaction, "❌ فشل إنشاء روم المراجعة");

        gangs.push(
          normalizeGang({
            id: String(Date.now()),
            name,
            reviewRoomId: reviewRoom.id,
            roleId,
            limit,
            open: true,
            members: [],
            inviteLink,
          })
        );

        saveGangs();
        await ensurePanels(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, "✅ تم إنشاء العصابة");
      }
    }
  } catch (err) {
    console.log("interaction error:", err?.message || err);
  }
});

// ======================================================
// READY + ADMIN COMMANDS + LOGIN
// ======================================================
client.once("clientReady", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  normalizeAllGangs();
  sortCreators();
  saveCreators();

  activeApplications.clear();
  for (const userId of Object.keys(sessions)) {
    activeApplications.add(String(userId));
  }

  for (const [, guild] of client.guilds.cache) {
    await ensurePanels(guild).catch(() => {});
  }
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!isAdmin(message.member)) return;

    if (message.content === "!panels") {
      await ensurePanels(message.guild);
      await message.reply("✅ panels updated").catch(() => {});
    }

    if (message.content === "!gangs") {
      await message.reply(gangs.length ? gangs.map((g) => g.name).join(", ") : "no gangs").catch(() => {});
    }

    if (message.content === "!creators") {
      await updateCreatorBoard(message.guild);
      await message.reply("✅ creators updated").catch(() => {});
    }
  } catch (err) {
    console.log("admin command error:", err?.message || err);
  }
});

process.on("unhandledRejection", (err) => console.error("Unhandled Rejection:", err));
process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));

if (!TOKEN) {
  console.log("❌ TOKEN missing");
  process.exit(1);
}

client.login(TOKEN);
