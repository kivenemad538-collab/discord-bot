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
  MessageFlags,
  AttachmentBuilder,
} = require("discord.js");

// ======================================================
// CONFIG
// ======================================================
const TOKEN = process.env.TOKEN || "";

// Optional placeholders
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || "";
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || "";

// ================= CUSTOM LINKS / BRANDING =================
const SERVER_LOGO_URL =
  "https://cdn.discordapp.com/attachments/1466112784587821189/1478302405102931998/ChatGPT_Image_Feb_24_2026_05_21_31_PM.png?ex=69daa9a6&is=69d95826&hm=2eb51daf3a7021a3efe6a80315028f30803f502063be06c0b640af8fe3f5212d&";

const SERVER_RULES_LINK =
  "https://docs.google.com/document/d/1dKZLMztoq_Z1MJfW4JVG3Y-Y8baNOds2VJ3QxJ_LeIE/edit?tab=t.0";

const DISCORD_RULES_LINK =
  "https://docs.google.com/document/d/1dKZLMztoq_Z1MJfW4JVG3Y-Y8baNOds2VJ3QxJ_LeIE/edit?tab=t.1mbusaffy3vv";

const SERVER_NAME = "Night City RP";

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
const LIVE_CHANNEL_ID = "1490733602663563275";

// ================= REVIEW CHANNEL IDS =================
const RP_REVIEW_CHANNEL_ID = "1477562618314459001";
const CREATOR_REVIEW_CHANNEL_ID = "1477777545767420116";
const ADMIN_REVIEW_CHANNEL_ID = "1479216695938650263";

// ================= VOICE INTERVIEW ROOM =================
const VOICE_ROOM_ID = "1465752669564964935";

// ================= TICKET CATEGORIES =================
const SUPPORT_CATEGORY_ID = "1473850568811221194";
const APPEAL_CATEGORY_ID = "1492285484301549618";
const REPORT_CATEGORY_ID = "1492285484301549618";
const SUGGEST_CATEGORY_ID = "1492285484301549618";

// ================= ADMIN ROLES (3) =================
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
const PANEL_MARKER_RP = "PANEL_RP_APPLY_v30";
const PANEL_MARKER_SERVICES = "PANEL_SERVICES_v30";
const PANEL_MARKER_CONTROL = "PANEL_CONTROL_v30";
const PANEL_MARKER_CREATOR_BOARD = "PANEL_CREATOR_BOARD_v30";
const PANEL_MARKER_RULES = "PANEL_RULES_v30";
const PANEL_MARKER_HELP = "PANEL_HELP_v30";
const PANEL_MARKER_GANGS = "PANEL_GANGS_v30";

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
// DEFAULTS / STORAGE
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
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
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

// ======================================================
// SAVE
// ======================================================
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

async function findMarkerMessage(channel, marker) {
  const msgs = await channel.messages.fetch({ limit: 50 }).catch(() => null);
  if (!msgs) return null;
  for (const [, msg] of msgs) {
    const footer = msg.embeds?.[0]?.footer?.text || "";
    if (footer.includes(marker)) return msg;
  }
  return null;
}

function reviewFieldsFromQuestions(questions, answers) {
  return questions.map((q) => ({
    name: safeTrim(q.q, 256),
    value: safeTrim(answers[q.key], 1024) || "-",
    inline: false,
  }));
}

function featureButton(customId, label, enabled) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(`${enabled ? "🟢" : "🔴"} ${label}`)
    .setStyle(enabled ? ButtonStyle.Success : ButtonStyle.Danger);
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

function getNextTicketId() {
  ticketsStore.lastId = Number(ticketsStore.lastId || 0) + 1;
  saveTicketsStore();
  return ticketsStore.lastId;
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

function formatNum(n) {
  return Number(n || 0).toLocaleString("en-US");
}

function toNumberLoose(input) {
  const cleaned = String(input || "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "")
    .trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function disableMessageRows(message) {
  if (!message?.components?.length) return [];
  return message.components.map((row) => {
    const newRow = ActionRowBuilder.from(row);
    newRow.components = newRow.components.map((c) => ButtonBuilder.from(c).setDisabled(true));
    return newRow;
  });
}

async function createTranscriptFile(channel) {
  let allMessages = [];
  let lastId = undefined;

  while (true) {
    const fetched = await channel.messages
      .fetch({ limit: 100, ...(lastId ? { before: lastId } : {}) })
      .catch(() => null);

    if (!fetched || !fetched.size) break;
    allMessages.push(...[...fetched.values()]);
    lastId = fetched.last().id;

    if (fetched.size < 100) break;
    if (allMessages.length >= 500) break;
  }

  allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  let content = "";
  content += `${SERVER_NAME} - Ticket Transcript\n`;
  content += `Channel: ${channel.name}\n`;
  content += `Date: ${new Date().toLocaleString("en-GB")}\n`;
  content += "====================================================\n\n";

  for (const m of allMessages) {
    const time = new Date(m.createdTimestamp).toLocaleString("en-GB");
    const author = m.author?.tag || "Unknown User";
    const body = m.content?.trim() || "[No Text]";
    content += `[${time}] ${author}: ${body}\n`;

    if (m.attachments?.size) {
      for (const [, att] of m.attachments) {
        content += `  Attachment: ${att.url}\n`;
      }
    }

    if (m.embeds?.length) {
      for (const emb of m.embeds) {
        if (emb.title) content += `  Embed Title: ${emb.title}\n`;
        if (emb.description) content += `  Embed Desc: ${emb.description}\n`;
      }
    }

    content += "\n";
  }

  const filePath = path.join(DATA_DIR, `transcript-${channel.id}.txt`);
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
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
    saveGangs();
  }
  return true;
}

function removeGangMember(gangId, userId) {
  const gang = getGangById(gangId);
  if (!gang) return false;
  gang.members = (gang.members || []).filter((id) => String(id) !== String(userId));
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
    name: slugifyText(gangName, 60),
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
  await channel.setName(slugifyText(newGangName, 60)).catch(() => {});
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
              `• المتابعين: **${formatNum(c.followers)}**\n` +
              `• متوسط المشاهدات: **${formatNum(c.avgViews)}**\n` +
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
    .setColor(0x2b2d31)
    .setTitle(`🎫 تم فتح التذكرة #${ticketId}`)
    .setDescription(
      `**صاحب التذكرة:** <@${userId}>\n` +
      `**نوع التذكرة:** ${ticketLabel(kind)}\n` +
      `**المستلم:** ${claimedBy !== "none" ? `<@${claimedBy}>` : "لم يتم الاستلام بعد"}\n\n` +
      "اكتب سبب التذكرة أو المشكلة بالتفصيل داخل هذه القناة."
    )
    .setFooter({ text: `${SERVER_NAME} • Tickets` })
    .setTimestamp();
}

function ticketClaimedEmbed(ticketId, ownerId, kind, claimedBy) {
  return new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle(`📌 تم استلام التذكرة #${ticketId}`)
    .setDescription(
      `**صاحب التذكرة:** <@${ownerId}>\n` +
      `**نوع التذكرة:** ${ticketLabel(kind)}\n` +
      `**تم الاستلام بواسطة:** <@${claimedBy}>`
    )
    .setFooter({ text: `${SERVER_NAME} • Tickets` })
    .setTimestamp();
}

function ticketClosedDmEmbed(ticketId, reason, channelName, claimedBy = "none") {
  return new EmbedBuilder()
    .setColor(0xff3b30)
    .setTitle(`🔒 تم إغلاق تذكرتك #${ticketId}`)
    .setDescription(
      `**اسم التذكرة:** ${channelName}\n` +
      `**كان ماسك التذكرة:** ${claimedBy !== "none" ? `<@${claimedBy}>` : "لم يتم الاستلام"}\n\n` +
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
    .setDescription("اضغط الزر بالأسفل لبدء التقديم على الوايت ليست في الخاص DM.")
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_RP}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("start_rp_apply")
      .setLabel(settings.rpApply ? "🚀 بدء تقديم السيرفر" : "🚫 تقديم السيرفر مغلق")
      .setStyle(settings.rpApply ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(!settings.rpApply)
  );

  return { embeds: [embed], components: [row] };
}

async function buildServicesPanelPayload() {
  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle("🎫 الخدمات والتقديمات")
    .setDescription(
      "اختر من القائمة بالأسفل.\n\n" +
        "• الدعم / الاستئناف / الشكوى / الاقتراح = يفتح تذكرة\n" +
        "• تقديم صانع محتوى / تقديم إدارة = يرسل النموذج في الخاص"
    )
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_SERVICES}` });

  const options = [];
  if (settings.support) options.push({ label: "دعم فني", description: "فتح تذكرة دعم فني", value: "support", emoji: "🧰" });
  if (settings.appeal) options.push({ label: "استئناف", description: "فتح تذكرة استئناف", value: "appeal", emoji: "📄" });
  if (settings.report) options.push({ label: "شكوى عن لاعب", description: "فتح تذكرة شكوى", value: "report", emoji: "🚨" });
  if (settings.suggest) options.push({ label: "اقتراح", description: "فتح تذكرة اقتراح", value: "suggest", emoji: "💡" });
  if (settings.creatorApply) options.push({ label: "تقديم صانع محتوى", description: "نموذج صانع المحتوى", value: "creator_apply", emoji: "🎥" });
  if (settings.adminApply) options.push({ label: "تقديم إدارة", description: "نموذج الإدارة", value: "admin_apply", emoji: "🛡️" });

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("ticket_select")
      .setPlaceholder(options.length ? "اختر الخدمة" : "لا توجد خدمات متاحة الآن")
      .setDisabled(options.length === 0)
      .addOptions(options.length ? options : [{ label: "مغلق", description: "جميع الخدمات مغلقة", value: "closed", emoji: "🚫" }])
  );

  return { embeds: [embed], components: [row] };
}

async function buildControlPanelPayload() {
  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle("🎛️ لوحة تحكم الأزرار")
    .setDescription("من هنا تقدر تفتح وتقفل الوظائف وتدير صناع المحتوى والعصابات.")
    .setFooter({ text: `${SERVER_NAME} • ${PANEL_MARKER_CONTROL}` })
    .setTimestamp();

  const row1 = new ActionRowBuilder().addComponents(
    featureButton("toggle_rpApply", "تقديم السيرفر", settings.rpApply),
    featureButton("toggle_support", "الدعم الفني", settings.support),
    featureButton("toggle_appeal", "الاستئناف", settings.appeal)
  );

  const row2 = new ActionRowBuilder().addComponents(
    featureButton("toggle_report", "شكوى عن لاعب", settings.report),
    featureButton("toggle_suggest", "الاقتراحات", settings.suggest),
    featureButton("toggle_feedback", "التقييم", settings.feedback)
  );

  const row3 = new ActionRowBuilder().addComponents(
    featureButton("toggle_adminApply", "تقديم الإدارة", settings.adminApply),
    featureButton("toggle_creatorApply", "تقديم صانع محتوى", settings.creatorApply),
    featureButton("toggle_creatorRegistry", "تسجيل صناع المحتوى", settings.creatorRegistry)
  );

  const row4 = new ActionRowBuilder().addComponents(
    featureButton("toggle_gangSystem", "نظام العصابات", settings.gangSystem),
    new ButtonBuilder().setCustomId("manual_add_creator").setLabel("➕ إضافة / تعديل صانع محتوى").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("create_gang").setLabel("🏴 إنشاء عصابة").setStyle(ButtonStyle.Success)
  );

  const row5 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("manage_gangs").setLabel("⚙️ إدارة العصابات").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("remove_gang_member").setLabel("❌ طرد لاعب من عصابة").setStyle(ButtonStyle.Danger)
  );

  return { embeds: [embed], components: [row1, row2, row3, row4, row5] };
}

async function buildRulesPanelPayload() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("قوانين السيرفر").setStyle(ButtonStyle.Link).setURL(SERVER_RULES_LINK),
    new ButtonBuilder().setLabel("قوانين الديسكورد").setStyle(ButtonStyle.Link).setURL(DISCORD_RULES_LINK)
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

  if (!settings.gangSystem) {
    return {
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("gang_system_disabled")
            .setLabel("🚫 نظام العصابات مغلق")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        ),
      ],
    };
  }

  if (!gangs.length) {
    return {
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("gang_none")
            .setLabel("لا توجد عصابات حاليًا")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        ),
      ],
    };
  }

  const buttons = gangs.slice(0, 25).map((gang) =>
    new ButtonBuilder()
      .setCustomId(`apply_gang_${gang.id}`)
      .setLabel(gang.open ? `🏴 ${safeTrim(gang.name, 70)}` : `🚫 ${safeTrim(gang.name, 70)}`)
      .setStyle(gang.open ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(!gang.open)
  );

  return { embeds: [embed], components: chunkButtons(buttons, 5) };
}

async function updateGangsPanel(guild) {
  const ch = await guild.channels.fetch(GANGS_PANEL_CHANNEL_ID).catch(() => null);
  if (!ch?.isTextBased()) return;

  let msg = null;
  if (settings.gangsPanelMessageId) {
    msg = await ch.messages.fetch(settings.gangsPanelMessageId).catch(() => null);
  }
  if (!msg) {
    msg = await findMarkerMessage(ch, PANEL_MARKER_GANGS);
  }

  const payload = await buildGangsPanelPayload();

  if (!msg) {
    const sent = await ch.send(payload).catch(() => null);
    if (sent) {
      settings.gangsPanelMessageId = sent.id;
      saveSettings();
    }
    return;
  }

  await msg.edit(payload).catch(() => {});
}

async function ensurePanels(guild) {
  const rpChannel = await guild.channels.fetch(RP_APPLY_PANEL_CHANNEL_ID).catch(() => null);
  if (rpChannel?.isTextBased()) {
    const old = await findMarkerMessage(rpChannel, PANEL_MARKER_RP);
    const payload = await buildRpPanelPayload();
    if (!old) await rpChannel.send(payload).catch(() => {});
    else await old.edit(payload).catch(() => {});
  }

  const servicesChannel = await guild.channels.fetch(SERVICES_PANEL_CHANNEL_ID).catch(() => null);
  if (servicesChannel?.isTextBased()) {
    const old = await findMarkerMessage(servicesChannel, PANEL_MARKER_SERVICES);
    const payload = await buildServicesPanelPayload();
    if (!old) await servicesChannel.send(payload).catch(() => {});
    else await old.edit(payload).catch(() => {});
  }

  const controlChannel = await guild.channels.fetch(CONTROL_PANEL_CHANNEL_ID).catch(() => null);
  if (controlChannel?.isTextBased()) {
    const old = await findMarkerMessage(controlChannel, PANEL_MARKER_CONTROL);
    const payload = await buildControlPanelPayload();
    if (!old) await controlChannel.send(payload).catch(() => {});
    else await old.edit(payload).catch(() => {});
  }

  const rulesChannel = await guild.channels.fetch(RULES_CHANNEL_ID).catch(() => null);
  if (rulesChannel?.isTextBased()) {
    const old = await findMarkerMessage(rulesChannel, PANEL_MARKER_RULES);
    const payload = await buildRulesPanelPayload();
    if (!old) await rulesChannel.send(payload).catch(() => {});
    else await old.edit(payload).catch(() => {});
  }

  const helpChannel = await guild.channels.fetch(HELP_CHANNEL_ID).catch(() => null);
  if (helpChannel?.isTextBased()) {
    const old = await findMarkerMessage(helpChannel, PANEL_MARKER_HELP);
    const payload = await buildHelpPanelPayload();
    if (!old) await helpChannel.send(payload).catch(() => {});
    else await old.edit(payload).catch(() => {});
  }

  await updateCreatorBoard(guild).catch(() => {});
  await updateGangsPanel(guild).catch(() => {});
}

// ======================================================
// APPLICATION FLOW
// ======================================================
async function startDmFlow(user, guild, type, extra = {}) {
  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member) return { ok: false, reason: "member" };

  if (activeApplications.has(String(user.id))) {
    return { ok: false, reason: "active" };
  }

  if (type === "rp") {
    if (member.roles.cache.has(RP_REJECT2_ROLE_ID)) return { ok: false, reason: "final_reject" };
    if (member.roles.cache.has(RP_PASS_ROLE_ID)) return { ok: false, reason: "already_accepted" };
  }

  if (type === "gang") {
    if (!settings.gangSystem) return { ok: false, reason: "gangs_off" };
    const gang = getGangById(extra.gangId);
    if (!gang) return { ok: false, reason: "gang_not_found" };
    if (!gang.open) return { ok: false, reason: "gang_closed" };
    if (userInAnyGang(user.id)) return { ok: false, reason: "already_in_any_gang" };
    if (isGangFull(gang)) return { ok: false, reason: "gang_full" };
  }

  activeApplications.add(String(user.id));

  const questions =
    type === "rp"
      ? RP_QUESTIONS
      : type === "creator"
      ? CREATOR_QUESTIONS
      : type === "admin"
      ? ADMIN_QUESTIONS
      : extra.questions || GANG_QUESTIONS;

  const sessionData = {
    type,
    guildId: guild.id,
    step: 0,
    answers: {},
    ...(type === "gang"
      ? {
          gangId: String(extra.gangId),
          questions,
        }
      : { questions }),
  };

  setSession(user.id, sessionData);

  try {
    const intro =
      type === "rp"
        ? "✅ بدأنا تقديم السيرفر في الخاص.\nأجب على الأسئلة بدقة.\n⚠️ قصة الشخصية يجب أن تكون 150 كلمة على الأقل."
        : type === "creator"
        ? "✅ بدأنا تقديم صانع المحتوى في الخاص.\nأجب على الأسئلة بدقة."
        : type === "admin"
        ? "✅ بدأنا تقديم الإدارة في الخاص.\nأجب على الأسئلة بدقة."
        : "";

    if (type === "gang") {
      const gang = getGangById(extra.gangId);
      await user.send({ embeds: [buildGangAppliedDmEmbed(gang.name)] });
      await user.send(questions[0].q);
    } else {
      await user.send(intro);
      await user.send(questions[0].q);
    }

    return { ok: true };
  } catch {
    endSession(user.id);
    return { ok: false, reason: "dm_closed" };
  }
}

// ======================================================
// REVIEW SEND
// ======================================================
function parsedCreatorInfoFromAnswers(answers) {
  const parsed = parseCreatorLink(answers.channelLink || "");
  return {
    parsed,
    platform: parsed?.platform || "Unknown",
    channelName: parsed?.name || "Unknown",
    followers: toNumberLoose(answers.followers),
    avgViews: toNumberLoose(answers.avgViews),
  };
}

async function submitRpToReview(guild, userId, answers) {
  const ch = await guild.channels.fetch(RP_REVIEW_CHANNEL_ID).catch(() => null);
  if (!ch?.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📩 طلب انضمام جديد للسيرفر")
    .addFields(reviewFieldsFromQuestions(RP_QUESTIONS, answers))
    .setFooter({ text: `type:rp | user:${userId}` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`approve_rp_${userId}`).setLabel("✅ قبول").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`reject_rp_${userId}`).setLabel("❌ رفض").setStyle(ButtonStyle.Danger)
  );

  await ch.send({ embeds: [embed], components: [row] }).catch(() => {});
}

async function submitCreatorToReview(guild, userId, answers) {
  const ch = await guild.channels.fetch(CREATOR_REVIEW_CHANNEL_ID).catch(() => null);
  if (!ch?.isTextBased()) return;

  const info = parsedCreatorInfoFromAnswers(answers);

  const embed = new EmbedBuilder()
    .setColor(info.parsed?.color || 0x00c853)
    .setTitle("🎥 طلب صانع محتوى جديد")
    .addFields(
      reviewFieldsFromQuestions(CREATOR_QUESTIONS, answers),
      { name: "المنصة المستخرجة", value: safeTrim(info.platform, 100) || "-", inline: true },
      { name: "اسم القناة المستخرج", value: safeTrim(info.channelName, 100) || "-", inline: true }
    )
    .setFooter({ text: `type:creator | user:${userId}` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`approve_creator_${userId}`).setLabel("✅ قبول").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`reject_creator_${userId}`).setLabel("❌ رفض").setStyle(ButtonStyle.Danger)
  );

  await ch.send({ embeds: [embed], components: [row] }).catch(() => {});
}

async function submitAdminToReview(guild, userId, answers) {
  const ch = await guild.channels.fetch(ADMIN_REVIEW_CHANNEL_ID).catch(() => null);
  if (!ch?.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setColor(0xff9800)
    .setTitle("🛡️ طلب إدارة جديد")
    .addFields(reviewFieldsFromQuestions(ADMIN_QUESTIONS, answers))
    .setFooter({ text: `type:admin | user:${userId}` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`approve_admin_${userId}`).setLabel("✅ قبول").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`reject_admin_${userId}`).setLabel("❌ رفض").setStyle(ButtonStyle.Danger)
  );

  await ch.send({ embeds: [embed], components: [row] }).catch(() => {});
}

async function submitGangToReview(guild, userId, gangId, answers) {
  const gang = getGangById(gangId);
  if (!gang) return;

  const ch = await guild.channels.fetch(gang.reviewRoomId).catch(() => null);
  if (!ch?.isTextBased()) return;

  const rpName = safeTrim(answers.rpName || "Unknown", 80);

  const embed = new EmbedBuilder()
    .setColor(0x111111)
    .setTitle(`🏴 طلب انضمام جديد لعصابة ${gang.name}`)
    .setDescription(`**المتقدم:** <@${userId}>\n**اسم الرول بلاي:** ${rpName}`)
    .addFields(buildGangReviewFields(gang, answers))
    .setFooter({ text: `type:gang | user:${userId} | gang:${gang.id}` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`accept_gang_${gang.id}_${userId}`).setLabel("✅ قبول").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`reject_gang_${gang.id}_${userId}`).setLabel("❌ رفض").setStyle(ButtonStyle.Danger)
  );

  await ch.send({ embeds: [embed], components: [row] }).catch(() => {});
}

// ======================================================
// TICKETS
// ======================================================
async function createTicket(interaction, kind) {
  const guild = interaction.guild;
  if (!guild) return;

  if (!["support", "appeal", "report", "suggest"].includes(kind)) {
    return replyEphemeral(interaction, "❌ نوع التذكرة غير صحيح.");
  }

  if (kind === "support" && !settings.support) return replyEphemeral(interaction, "⚠️ الدعم الفني مغلق حاليًا.");
  if (kind === "appeal" && !settings.appeal) return replyEphemeral(interaction, "⚠️ الاستئناف مغلق حاليًا.");
  if (kind === "report" && !settings.report) return replyEphemeral(interaction, "⚠️ الشكاوى مغلقة حاليًا.");
  if (kind === "suggest" && !settings.suggest) return replyEphemeral(interaction, "⚠️ الاقتراحات مغلقة حاليًا.");

  const categoryId = ticketCategory(kind);
  const category = await guild.channels.fetch(categoryId).catch(() => null);

  if (!category || category.type !== ChannelType.GuildCategory) {
    return replyEphemeral(interaction, "❌ كاتيجوري التذاكر غير صحيحة أو غير موجودة.");
  }

  const existing = guild.channels.cache.find((c) => {
    if (c.type !== ChannelType.GuildText) return false;
    const info = parseTicketTopic(c.topic);
    return info.owner === interaction.user.id;
  });

  if (existing) {
    return replyEphemeral(interaction, `⚠️ لديك تذكرة مفتوحة بالفعل: ${existing}`);
  }

  const ticketId = getNextTicketId();

  const channel = await guild.channels
    .create({
      name: `ticket-${ticketId}`.slice(0, 95),
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: ticketTopic(ticketId, interaction.user.id, kind, "none"),
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks,
          ],
        },
        ...ADMIN_ROLE_IDS.map((rid) => ({
          id: rid,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks,
          ],
        })),
      ],
    })
    .catch((err) => {
      console.log("ticket create error:", err?.message || err);
      return null;
    });

  if (!channel) {
    return replyEphemeral(interaction, "❌ فشل إنشاء التذكرة.");
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("ticket_claim").setLabel("📌 استلام التذكرة").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ticket_close_reason").setLabel("❌ إغلاق التذكرة").setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    content: `<@${interaction.user.id}>`,
    embeds: [ticketOpenEmbed(interaction.user.id, kind, ticketId, "none")],
    components: [row],
  }).catch(() => {});

  await interaction.user
    .send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x2b2d31)
          .setTitle(`🎫 تم فتح التذكرة #${ticketId}`)
          .setDescription(
            `**نوع التذكرة:** ${ticketLabel(kind)}\n\n` +
            "احتفظ برقم التذكرة للمراجعة."
          )
          .setFooter({ text: `${SERVER_NAME} • Tickets` })
          .setTimestamp(),
      ],
    })
    .catch(() => {});

  return replyEphemeral(interaction, "✅ تم فتح التذكرة بنجاح.");
}

async function closeTicket(channel, closedById, reason) {
  try {
    const info = parseTicketTopic(channel.topic);
    const ownerId = info.owner;
    const claimedBy = info.claimedBy || "none";

    const owner = ownerId ? await channel.client.users.fetch(ownerId).catch(() => null) : null;
    const transcriptPath = await createTranscriptFile(channel).catch(() => null);

    if (owner) {
      const files = [];
      if (transcriptPath && fs.existsSync(transcriptPath)) {
        files.push(new AttachmentBuilder(transcriptPath));
      }

      await owner.send({
        embeds: [ticketClosedDmEmbed(info.id, reason, channel.name, claimedBy)],
        files,
        components: settings.feedback ? [buildTicketRatingRow(info.id)] : [],
      }).catch(() => {});
    }

    await channel.delete(`Closed by ${closedById} | ${reason}`).catch(() => {});
  } catch (err) {
    console.log("closeTicket error:", err?.message || err);
  }
}

// ======================================================
// GANG CRUD
// ======================================================
async function createGangFromModal(interaction, fields) {
  const guild = interaction.guild;
  if (!guild) return;

  const name = safeTrim(fields.getTextInputValue("gang_name"), 80);
  const limit = Number(fields.getTextInputValue("gang_limit")) || 0;
  const roleId = safeTrim(fields.getTextInputValue("gang_role"), 50);
  const inviteLink = safeTrim(fields.getTextInputValue("gang_link"), 1000);

  if (!name) return replyEphemeral(interaction, "❌ اسم العصابة مطلوب.");

  if (gangs.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
    return replyEphemeral(interaction, "❌ توجد عصابة بنفس الاسم.");
  }

  let reviewRoom = null;
  try {
    reviewRoom = await createGangReviewChannel(guild, name);
  } catch (err) {
    console.log("createGangFromModal review room error:", err?.message || err);
    return replyEphemeral(interaction, "❌ فشل إنشاء روم مراجعة العصابة.");
  }

  gangs.push(
    normalizeGang({
      id: String(Date.now()),
      name,
      reviewRoomId: reviewRoom.id,
      roleId: roleId || "",
      limit,
      open: true,
      members: [],
      inviteLink,
    })
  );
  saveGangs();

  await updateGangsPanel(guild).catch(() => {});

  return replyEphemeral(interaction, `✅ تم إنشاء العصابة **${name}** بنجاح.`);
}

// ======================================================
// MODALS
// ======================================================
function buildRejectReasonModal(customId, title = "سبب الرفض") {
  return new ModalBuilder()
    .setCustomId(customId)
    .setTitle(title)
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("reason")
          .setLabel("اكتب السبب")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1800)
      )
    );
}

function buildCloseTicketModal() {
  return new ModalBuilder()
    .setCustomId("modal_close_ticket")
    .setTitle("إغلاق التذكرة")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("reason")
          .setLabel("سبب الإغلاق")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1800)
      )
    );
}

function buildManualCreatorModal() {
  return new ModalBuilder()
    .setCustomId("modal_manual_creator")
    .setTitle("إضافة / تعديل صانع محتوى")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("user_id").setLabel("User ID").setStyle(TextInputStyle.Short).setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("channel_name").setLabel("اسم القناة").setStyle(TextInputStyle.Short).setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("platform").setLabel("المنصة").setStyle(TextInputStyle.Short).setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("followers").setLabel("المتابعين").setStyle(TextInputStyle.Short).setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("avg_views").setLabel("متوسط المشاهدات").setStyle(TextInputStyle.Short).setRequired(true)
      )
    );
}

function buildCreateGangModal() {
  return new ModalBuilder()
    .setCustomId("modal_create_gang")
    .setTitle("إنشاء عصابة")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("gang_name").setLabel("اسم العصابة").setStyle(TextInputStyle.Short).setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("gang_limit").setLabel("الحد الأقصى للأعضاء").setStyle(TextInputStyle.Short).setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("gang_role")
          .setLabel("Role ID (اختياري)")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("gang_link").setLabel("لينك سيرفر العصابة").setStyle(TextInputStyle.Paragraph).setRequired(false)
      )
    );
}

function buildKickGangMemberModal() {
  return new ModalBuilder()
    .setCustomId("modal_remove_gang_member")
    .setTitle("طرد لاعب من عصابة")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("user_id").setLabel("User ID").setStyle(TextInputStyle.Short).setRequired(true)
      )
    );
}

function buildGangAcceptModal(gangId, userId) {
  return new ModalBuilder()
    .setCustomId(`modal_accept_gang_${gangId}_${userId}`)
    .setTitle("قبول في العصابة")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("link")
          .setLabel("لينك السيرفر")
          .setPlaceholder("يمكنك تركه فارغًا لاستخدام اللينك المحفوظ")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(1000)
      )
    );
}

// ======================================================
// READY / RESTORE
// ======================================================
client.once("clientReady", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  sortCreators();
  saveCreators();
  normalizeAllGangs();

  activeApplications.clear();
  for (const userId of Object.keys(sessions)) {
    activeApplications.add(String(userId));
  }

  for (const [, guild] of client.guilds.cache) {
    await ensurePanels(guild).catch(() => {});
  }
});

// ======================================================
// WELCOME
// ======================================================
client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("قوانين السيرفر").setStyle(ButtonStyle.Link).setURL(SERVER_RULES_LINK),
    new ButtonBuilder()
      .setLabel("نموذج التقديم")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/channels/${member.guild.id}/${RP_APPLY_PANEL_CHANNEL_ID}`),
    new ButtonBuilder()
      .setCustomId("open_feedback")
      .setLabel("تقييم السيرفر")
      .setStyle(settings.feedback ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(!settings.feedback)
  );

  await channel
    .send({
      content: `<@${member.id}>`,
      embeds: [buildWelcomeEmbed(member)],
      components: [row],
    })
    .catch(() => {});
});

// ======================================================
// KEEP PANELS ALIVE
// ======================================================
client.on("messageDelete", async (message) => {
  try {
    const footer = message.embeds?.[0]?.footer?.text || "";
    if (
      !footer.includes(PANEL_MARKER_RP) &&
      !footer.includes(PANEL_MARKER_SERVICES) &&
      !footer.includes(PANEL_MARKER_CONTROL) &&
      !footer.includes(PANEL_MARKER_CREATOR_BOARD) &&
      !footer.includes(PANEL_MARKER_RULES) &&
      !footer.includes(PANEL_MARKER_HELP) &&
      !footer.includes(PANEL_MARKER_GANGS)
    ) {
      return;
    }

    if (!message.guildId) return;
    const guild = await client.guilds.fetch(message.guildId).catch(() => null);
    if (!guild) return;

    await ensurePanels(guild).catch(() => {});
  } catch {}
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
    const question = questions[session.step];
    if (!question) {
      endSession(message.author.id);
      return;
    }

    const answer = safeTrim(message.content, 1900);

    if (tooShortAnswer(answer)) {
      await message.channel.send("❌ الإجابة قصيرة جدًا. حاول تكتب بشكل أوضح.").catch(() => {});
      return;
    }

    if (session.type === "rp" && question.key === "story" && wordCount(answer) < 150) {
      await message.channel.send("❌ قصة الشخصية يجب أن تكون 150 كلمة على الأقل.").catch(() => {});
      return;
    }

    session.answers[question.key] = answer;
    session.step += 1;
    setSession(message.author.id, session);

    if (session.step < questions.length) {
      await message.channel.send(questions[session.step].q).catch(() => {});
      return;
    }

    if (session.type === "rp") {
      await submitRpToReview(guild, message.author.id, session.answers);
    } else if (session.type === "creator") {
      await submitCreatorToReview(guild, message.author.id, session.answers);
    } else if (session.type === "admin") {
      await submitAdminToReview(guild, message.author.id, session.answers);
    } else if (session.type === "gang") {
      await submitGangToReview(guild, message.author.id, session.gangId, session.answers);
    }

    await message.channel.send("✅ تم إرسال التقديم للمراجعة بنجاح.").catch(() => {});
    endSession(message.author.id);
  } catch (err) {
    console.log("DM flow error:", err?.message || err);
  }
});

// ======================================================
// INTERACTIONS
// ======================================================
client.on("interactionCreate", async (interaction) => {
  try {
    // ================= SELECT MENUS =================
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "ticket_select") {
        const val = interaction.values[0];

        if (["support", "appeal", "report", "suggest"].includes(val)) {
          return createTicket(interaction, val);
        }

        if (val === "creator_apply") {
          const res = await startDmFlow(interaction.user, interaction.guild, "creator");
          if (!res.ok) {
            if (res.reason === "active") return replyEphemeral(interaction, "⚠️ لديك تقديم جارٍ بالفعل.");
            if (res.reason === "dm_closed") return replyEphemeral(interaction, "❌ الخاص مغلق. افتح الـ DM أولًا.");
            return replyEphemeral(interaction, "❌ تعذر بدء التقديم.");
          }
          return replyEphemeral(interaction, "✅ تم إرسال الأسئلة في الخاص.");
        }

        if (val === "admin_apply") {
          const res = await startDmFlow(interaction.user, interaction.guild, "admin");
          if (!res.ok) {
            if (res.reason === "active") return replyEphemeral(interaction, "⚠️ لديك تقديم جارٍ بالفعل.");
            if (res.reason === "dm_closed") return replyEphemeral(interaction, "❌ الخاص مغلق. افتح الـ DM أولًا.");
            return replyEphemeral(interaction, "❌ تعذر بدء التقديم.");
          }
          return replyEphemeral(interaction, "✅ تم إرسال الأسئلة في الخاص.");
        }
      }

      if (interaction.customId === "gang_manage_select") {
        const value = interaction.values[0];
        if (value === "gang_none") return replyEphemeral(interaction, "لا توجد عصابات.");

        const gangId = value.replace("gang_manage_", "");
        const gang = getGangById(gangId);
        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة.");

        const embed = new EmbedBuilder()
          .setColor(0x111111)
          .setTitle(`⚙️ إدارة عصابة ${gang.name}`)
          .setDescription(
            `• الحالة: ${gang.open ? "🟢 مفتوح" : "🔴 مغلق"}\n` +
            `• الأعضاء: ${currentGangCount(gang)}/${gang.limit || 0}\n` +
            `• Review Room ID: ${gang.reviewRoomId || "-"}\n` +
            `• Role ID: ${gang.roleId || "اختياري / غير محدد"}`
          );

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`gang_toggle_${gang.id}`).setLabel(gang.open ? "🔒 قفل" : "🔓 فتح").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId(`gang_delete_${gang.id}`).setLabel("🗑️ حذف").setStyle(ButtonStyle.Danger)
        );

        return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral }).catch(() => {});
      }
    }

    // ================= BUTTONS =================
    if (interaction.isButton()) {
      const member = interaction.member;

      if (interaction.customId === "start_rp_apply") {
        const res = await startDmFlow(interaction.user, interaction.guild, "rp");
        if (!res.ok) {
          if (res.reason === "active") return replyEphemeral(interaction, "⚠️ لديك تقديم جارٍ بالفعل.");
          if (res.reason === "final_reject") return replyEphemeral(interaction, "⛔ تم رفضك نهائيًا من قبل.");
          if (res.reason === "already_accepted") return replyEphemeral(interaction, "✅ أنت مقبول بالفعل.");
          if (res.reason === "dm_closed") return replyEphemeral(interaction, "❌ الخاص مغلق. افتح الـ DM أولًا.");
          return replyEphemeral(interaction, "❌ تعذر بدء التقديم.");
        }
        return replyEphemeral(interaction, "✅ تم إرسال الأسئلة في الخاص.");
      }

      if (interaction.customId === "open_feedback") {
        return interaction.reply({
          content: "💛 لو حابب ابعت تقييمك في روم التقييمات أو من خلال التذاكر.",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (interaction.customId === "help_ar") {
        return replyEphemeral(interaction, "استخدم التذاكر لو عندك مشكلة.");
      }
      if (interaction.customId === "help_en") {
        return replyEphemeral(interaction, "Use tickets if you have any issue.");
      }

      if (interaction.customId.startsWith("apply_gang_")) {
        const gangId = interaction.customId.replace("apply_gang_", "");
        const res = await startDmFlow(interaction.user, interaction.guild, "gang", { gangId });
        if (!res.ok) {
          if (res.reason === "active") return replyEphemeral(interaction, "⚠️ لديك تقديم جارٍ بالفعل.");
          if (res.reason === "gangs_off") return replyEphemeral(interaction, "❌ نظام العصابات مغلق.");
          if (res.reason === "gang_not_found") return replyEphemeral(interaction, "❌ العصابة غير موجودة.");
          if (res.reason === "gang_closed") return replyEphemeral(interaction, "🔒 العصابة مغلقة.");
          if (res.reason === "already_in_any_gang") return replyEphemeral(interaction, "⚠️ أنت بالفعل في عصابة.");
          if (res.reason === "gang_full") return replyEphemeral(interaction, "⚠️ العصابة ممتلئة.");
          if (res.reason === "dm_closed") return replyEphemeral(interaction, "❌ الخاص مغلق. افتح الـ DM أولًا.");
          return replyEphemeral(interaction, "❌ تعذر بدء التقديم.");
        }
        return replyEphemeral(interaction, "✅ تم إرسال الأسئلة في الخاص.");
      }

      if (
        [
          "ticket_claim",
          "ticket_close_reason",
          "manual_add_creator",
          "create_gang",
          "manage_gangs",
          "remove_gang_member",
        ].includes(interaction.customId) ||
        interaction.customId.startsWith("toggle_") ||
        interaction.customId.startsWith("approve_") ||
        interaction.customId.startsWith("reject_") ||
        interaction.customId.startsWith("accept_gang_") ||
        interaction.customId.startsWith("reject_gang_") ||
        interaction.customId.startsWith("gang_toggle_") ||
        interaction.customId.startsWith("gang_delete_")
      ) {
        if (!isAdmin(member)) {
          return replyEphemeral(interaction, "❌ هذا الزر للإدارة فقط.");
        }
      }

      if (interaction.customId === "ticket_claim") {
        const info = parseTicketTopic(interaction.channel.topic);

        if (!info.owner || !info.type) {
          return replyEphemeral(interaction, "❌ بيانات التذكرة غير صحيحة.");
        }

        if (info.claimedBy && info.claimedBy !== "none") {
          return replyEphemeral(interaction, `⚠️ التذكرة مستلمة بالفعل بواسطة <@${info.claimedBy}>`);
        }

        const nextTopic = ticketTopic(info.id, info.owner, info.type, interaction.user.id);
        await interaction.channel.setTopic(nextTopic).catch(() => {});

        if (!interaction.channel.name.startsWith("claimed-")) {
          await interaction.channel
            .setName(`claimed-${interaction.channel.name}`.slice(0, 95))
            .catch(() => {});
        }

        await interaction.channel.send({
          embeds: [ticketClaimedEmbed(info.id, info.owner, info.type, interaction.user.id)],
        }).catch(() => {});

        return replyEphemeral(interaction, "✅ تم استلام التذكرة بنجاح.");
      }

      if (interaction.customId === "ticket_close_reason") {
        return interaction.showModal(buildCloseTicketModal());
      }

      if (interaction.customId.startsWith("toggle_")) {
        const key = interaction.customId.replace("toggle_", "");
        if (!(key in settings)) return replyEphemeral(interaction, "❌ مفتاح غير صحيح.");

        settings[key] = !settings[key];
        saveSettings();

        await ensurePanels(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, `✅ تم تحديث ${key} إلى ${settings[key] ? "ON" : "OFF"}.`);
      }

      if (interaction.customId === "manual_add_creator") {
        return interaction.showModal(buildManualCreatorModal());
      }

      if (interaction.customId === "create_gang") {
        return interaction.showModal(buildCreateGangModal());
      }

      if (interaction.customId === "manage_gangs") {
        const options = buildGangControlSelectOptions();
        return interaction.reply({
          content: "اختر العصابة التي تريد إدارتها:",
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("gang_manage_select")
                .setPlaceholder("اختر العصابة")
                .addOptions(options)
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (interaction.customId === "remove_gang_member") {
        return interaction.showModal(buildKickGangMemberModal());
      }

      if (interaction.customId.startsWith("gang_toggle_")) {
        const gangId = interaction.customId.replace("gang_toggle_", "");
        const gang = getGangById(gangId);
        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة.");

        gang.open = !gang.open;
        saveGangs();
        await updateGangsPanel(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, `✅ تم ${gang.open ? "فتح" : "قفل"} العصابة.`);
      }

      if (interaction.customId.startsWith("gang_delete_")) {
        const gangId = interaction.customId.replace("gang_delete_", "");
        const gang = getGangById(gangId);
        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة.");

        gangs = gangs.filter((g) => g.id !== gangId);
        saveGangs();
        await tryDeleteGangReviewChannel(interaction.guild, gang.reviewRoomId).catch(() => {});
        await updateGangsPanel(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, `✅ تم حذف عصابة ${gang.name}.`);
      }

      if (interaction.customId.startsWith("approve_rp_")) {
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
        const userId = interaction.customId.replace("reject_rp_", "");
        return interaction.showModal(buildRejectReasonModal(`modal_reject_rp_${userId}`, "رفض طلب السيرفر"));
      }

      if (interaction.customId.startsWith("approve_creator_")) {
        const userId = interaction.customId.replace("approve_creator_", "");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        const embed = interaction.message.embeds?.[0];
        if (memberTarget) {
          await memberTarget.roles.add(CREATOR_ROLE_ID).catch(() => {});
          await memberTarget.send({ embeds: [creatorAcceptEmbed()] }).catch(() => {});
        }

        const parsed = parseCreatorLink(
          embed?.fields?.find((f) => f.name.includes("رابط"))?.value || ""
        );

        addOrUpdateCreator({
          userId,
          name: parsed?.name || "Unknown",
          platform: parsed?.platform || "Unknown",
          link: parsed?.link || "",
          followers: 0,
          avgViews: 0,
        });

        await updateCreatorBoard(interaction.guild).catch(() => {});
        await interaction.update({ components: disableMessageRows(interaction.message) }).catch(() => {});
        return;
      }

      if (interaction.customId.startsWith("reject_creator_")) {
        const userId = interaction.customId.replace("reject_creator_", "");
        return interaction.showModal(buildRejectReasonModal(`modal_reject_creator_${userId}`, "رفض صانع محتوى"));
      }

      if (interaction.customId.startsWith("approve_admin_")) {
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
        const userId = interaction.customId.replace("reject_admin_", "");
        return interaction.showModal(buildRejectReasonModal(`modal_reject_admin_${userId}`, "رفض الإدارة"));
      }

      if (interaction.customId.startsWith("accept_gang_")) {
        const [, , gangId, userId] = interaction.customId.split("_");
        const gang = getGangById(gangId);
        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة.");

        if (isGangFull(gang)) return replyEphemeral(interaction, "⚠️ العصابة ممتلئة.");

        return interaction.showModal(buildGangAcceptModal(gangId, userId));
      }

      if (interaction.customId.startsWith("reject_gang_")) {
        const [, , gangId, userId] = interaction.customId.split("_");
        return interaction.showModal(buildRejectReasonModal(`modal_reject_gang_${gangId}_${userId}`, "رفض تقديم العصابة"));
      }

      if (interaction.customId.startsWith("ticket_rate_")) {
        const [, , ticketId, stars] = interaction.customId.split("_");

        ticketRatings[ticketId] = {
          stars: Number(stars),
          userId: interaction.user.id,
          reason: "",
        };
        saveTicketRatings();

        const modal = new ModalBuilder()
          .setCustomId(`modal_ticket_rate_${ticketId}_${stars}`)
          .setTitle("سبب التقييم")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("اكتب سبب التقييم")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            )
          );

        return interaction.showModal(modal);
      }
    }

    // ================= MODALS =================
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal_close_ticket") {
        const reason = interaction.fields.getTextInputValue("reason");
        await interaction.reply({ content: "🔒 جاري إغلاق التذكرة...", flags: MessageFlags.Ephemeral }).catch(() => {});
        await closeTicket(interaction.channel, interaction.user.id, reason);
        return;
      }

      if (interaction.customId === "modal_manual_creator") {
        const userId = safeTrim(interaction.fields.getTextInputValue("user_id"), 50);
        const channelName = safeTrim(interaction.fields.getTextInputValue("channel_name"), 100);
        const platform = safeTrim(interaction.fields.getTextInputValue("platform"), 50);
        const followers = toNumberLoose(interaction.fields.getTextInputValue("followers"));
        const avgViews = toNumberLoose(interaction.fields.getTextInputValue("avg_views"));

        addOrUpdateCreator({
          userId,
          name: channelName,
          platform,
          link: "",
          followers,
          avgViews,
        });

        await updateCreatorBoard(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, "✅ تم تحديث بيانات صانع المحتوى.");
      }

      if (interaction.customId === "modal_create_gang") {
        return createGangFromModal(interaction, interaction.fields);
      }

      if (interaction.customId === "modal_remove_gang_member") {
        const userId = safeTrim(interaction.fields.getTextInputValue("user_id"), 50);
        const gang = getGangOfUser(userId);

        if (!gang) return replyEphemeral(interaction, "❌ هذا المستخدم ليس في أي عصابة.");

        removeGangMember(gang.id, userId);

        if (gang.roleId) {
          const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);
          if (memberTarget) {
            await memberTarget.roles.remove(gang.roleId).catch(() => {});
          }
        }

        await updateGangsPanel(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, `✅ تم طرد المستخدم من عصابة ${gang.name}.`);
      }

      if (interaction.customId.startsWith("modal_accept_gang_")) {
        const parts = interaction.customId.split("_");
        const gangId = parts[3];
        const userId = parts[4];
        const gang = getGangById(gangId);

        if (!gang) return replyEphemeral(interaction, "❌ العصابة غير موجودة.");
        if (isGangFull(gang)) return replyEphemeral(interaction, "⚠️ العصابة ممتلئة.");

        const manualLink = safeTrim(interaction.fields.getTextInputValue("link"), 1000);
        const finalLink = manualLink || gang.inviteLink || "";

        const target = await interaction.guild.members.fetch(userId).catch(() => null);

        if (target) {
          if (gang.roleId) {
            await target.roles.add(gang.roleId).catch(() => {});
          }

          addGangMember(gang.id, userId);

          await target.send({
            embeds: [buildGangAcceptEmbed(gang, finalLink)],
          }).catch(() => {});
        }

        await updateGangsPanel(interaction.guild).catch(() => {});
        return replyEphemeral(interaction, "✅ تم قبول العضو في العصابة.");
      }

      if (interaction.customId.startsWith("modal_reject_rp_")) {
        const userId = interaction.customId.replace("modal_reject_rp_", "");
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

        const disabledRows = disableMessageRows(interaction.message);
        if (disabledRows.length) {
          await interaction.update({ components: disabledRows }).catch(async () => {
            await replyEphemeral(interaction, "✅ تم إرسال الرفض.");
          });
          return;
        }

        return replyEphemeral(interaction, "✅ تم إرسال الرفض.");
      }

      if (interaction.customId.startsWith("modal_reject_creator_")) {
        const userId = interaction.customId.replace("modal_reject_creator_", "");
        const reason = interaction.fields.getTextInputValue("reason");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.send({ embeds: [creatorRejectEmbed(reason)] }).catch(() => {});
        }

        const disabledRows = disableMessageRows(interaction.message);
        if (disabledRows.length) {
          await interaction.update({ components: disabledRows }).catch(async () => {
            await replyEphemeral(interaction, "✅ تم إرسال الرفض.");
          });
          return;
        }

        return replyEphemeral(interaction, "✅ تم إرسال الرفض.");
      }

      if (interaction.customId.startsWith("modal_reject_admin_")) {
        const userId = interaction.customId.replace("modal_reject_admin_", "");
        const reason = interaction.fields.getTextInputValue("reason");
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget) {
          await memberTarget.send({ embeds: [adminRejectEmbed(reason)] }).catch(() => {});
        }

        const disabledRows = disableMessageRows(interaction.message);
        if (disabledRows.length) {
          await interaction.update({ components: disabledRows }).catch(async () => {
            await replyEphemeral(interaction, "✅ تم إرسال الرفض.");
          });
          return;
        }

        return replyEphemeral(interaction, "✅ تم إرسال الرفض.");
      }

      if (interaction.customId.startsWith("modal_reject_gang_")) {
        const parts = interaction.customId.split("_");
        const gangId = parts[3];
        const userId = parts[4];
        const reason = interaction.fields.getTextInputValue("reason");
        const gang = getGangById(gangId);
        const memberTarget = await interaction.guild.members.fetch(userId).catch(() => null);

        if (memberTarget && gang) {
          await memberTarget.send({ embeds: [buildGangRejectEmbed(gang.name, reason)] }).catch(() => {});
        }

        const disabledRows = disableMessageRows(interaction.message);
        if (disabledRows.length) {
          await interaction.update({ components: disabledRows }).catch(async () => {
            await replyEphemeral(interaction, "✅ تم إرسال الرفض.");
          });
          return;
        }

        return replyEphemeral(interaction, "✅ تم إرسال الرفض.");
      }

      if (interaction.customId.startsWith("modal_ticket_rate_")) {
        const [, , , ticketId, stars] = interaction.customId.split("_");
        const reason = interaction.fields.getTextInputValue("reason");

        ticketRatings[ticketId] = {
          stars: Number(stars),
          userId: interaction.user.id,
          reason,
        };
        saveTicketRatings();

        const feedbackChannel = await interaction.guild.channels.fetch(FEEDBACK_CHANNEL_ID).catch(() => null);
        if (feedbackChannel?.isTextBased()) {
          const embed = new EmbedBuilder()
            .setColor(0xffd54f)
            .setTitle(`⭐ تقييم جديد للتذكرة #${ticketId}`)
            .setDescription(
              `**المستخدم:** <@${interaction.user.id}>\n` +
                `**النجوم:** ${"⭐".repeat(Number(stars))}\n\n` +
                `**السبب:**\n${safeTrim(reason, 1800)}`
            )
            .setTimestamp();

          await feedbackChannel.send({ embeds: [embed] }).catch(() => {});
        }

        return replyEphemeral(interaction, "✅ شكرًا على تقييمك.");
      }
    }
  } catch (err) {
    console.log("interactionCreate error:", err?.message || err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ حصل خطأ غير متوقع.", flags: MessageFlags.Ephemeral }).catch(() => {});
    }
  }
});

// ======================================================
// ADMIN MESSAGE COMMANDS
// ======================================================
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!isAdmin(message.member)) return;

    if (message.content === "!panels") {
      await ensurePanels(message.guild);
      await message.reply("✅ تم تحديث البانلز.").catch(() => {});
      return;
    }

    if (message.content === "!gangs") {
      await updateGangsPanel(message.guild);
      await message.reply("✅ تم تحديث بانل العصابات.").catch(() => {});
      return;
    }

    if (message.content === "!creators") {
      await updateCreatorBoard(message.guild);
      await message.reply("✅ تم تحديث لوحة صناع المحتوى.").catch(() => {});
      return;
    }
  } catch (err) {
    console.log("admin command error:", err?.message || err);
  }
});

// ======================================================
// ERROR SAFE
// ======================================================
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// ======================================================
// LOGIN
// ======================================================
if (!TOKEN) {
  console.log("❌ TOKEN missing");
  process.exit(1);
}

client.login(TOKEN);
