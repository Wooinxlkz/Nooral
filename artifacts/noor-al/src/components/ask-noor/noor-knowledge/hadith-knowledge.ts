import type { KnowledgeEntry } from "./types";

export const hadithKnowledge: KnowledgeEntry[] = [
  {
    id: "hadith-intentions",
    title: "Hadith: Actions are by Intentions",
    category: "hadith",
    slashCommand: "/niyyah",
    triggers: ["intentions", "niyyah", "niat", "actions by intentions", "innamal a'mal", "إنما الأعمال بالنيات", "sincerity", "ikhlas hadith"],
    content: `**The Hadith of Intentions — The First Hadith of Bukhari**

*"إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى"*

**"Indeed, actions are only by intentions, and every person will have only what they intended."**
— Narrated by Umar ibn Al-Khattab (رضي الله عنه) | Bukhari & Muslim

**This single hadith is the foundation of Islamic ethics.**

Imam Ash-Shafi'i said: *"This hadith is one-third of all knowledge."*
Imam Ahmad said: *"The foundations of Islam rest on three hadith: this one, the hadith of 'The halal is clear...', and the hadith 'Do not harm and do not be harmed.'"*

**What does it mean?**
Every act of worship and deed is judged by Allah based on what was in your heart when you did it.

- Same physical act, different intentions = completely different rewards
- Praying because people are watching vs. praying for Allah — both look identical externally, but only one earns reward
- Even mundane acts (eating, sleeping, working) become worship if done with the right intention

**Practical application:**
- Before every prayer: renew your intention for Allah
- Before studying the Quran: "I do this seeking Allah's pleasure and to act upon it"
- Before work: "I do this to provide halal sustenance for my family, for Allah's sake"
- Before eating: "I do this to have strength to worship Allah"

*SubhanAllah* — this means an ordinary Muslim who makes sincere intentions can transform their entire day into continuous worship.`,
    tags: ["intention", "niyyah", "sincerity", "foundational"],
  },
  {
    id: "hadith-halal-haram",
    title: "Hadith: The Halal is Clear",
    category: "hadith",
    slashCommand: "/halal",
    triggers: ["halal haram", "clear matters", "doubtful matters", "shubuhaat", "wara", "heart", "halal is clear", "النعمان بن بشير"],
    content: `**The Hadith of Halal and Haram**

*"الحلال بيّن والحرام بيّن، وبينهما أمور مشتبهات"*

**"The halal (permissible) is clear and the haram (forbidden) is clear, and between them are doubtful matters that many people do not know about."**

*"Whoever avoids doubtful matters has protected his religion and his honor. And whoever falls into doubtful matters will fall into the haram, just as a shepherd who grazes near a protected land — he is likely to enter it. Indeed, every king has a protected land, and Allah's protected land is His prohibitions."*

*"Verily, in the body there is a piece of flesh; if it is sound, the whole body is sound, and if it is corrupt, the whole body is corrupt. Verily, it is the heart."*
— Narrated by An-Nu'man ibn Bashir (رضي الله عنه) | Bukhari & Muslim

**Three categories this hadith defines:**
1. ✅ **Clear Halal**: Prayer, honest trade, marriage, eating lawful food — no doubt
2. ❌ **Clear Haram**: Riba (usury), zina (adultery), murder, pork, alcohol — no doubt
3. ⚠️ **Doubtful (Shubuhaat)**: Grey areas where scholars differ or situations are unclear

**The rule:** When in doubt, leave it out — this is called **Wara** (scrupulousness).

The Prophet ﷺ also said: *"Leave what makes you doubt for what does not make you doubt."* (Tirmidhi)

**The heart:**
The famous final line about the heart is one of the most profound statements in all of Islamic literature. Every sin starts with the heart. Every good deed starts with the heart. Guard it.`,
    tags: ["halal", "haram", "fiqh", "heart"],
  },
  {
    id: "hadith-quran-reward",
    title: "Hadith: Rewards for Reading the Quran",
    category: "hadith",
    slashCommand: "/quranreward",
    triggers: ["reward reading quran", "hasanat quran", "ten rewards", "good deeds quran", "reward recitation", "alif lam mim", "من قرأ حرفاً"],
    content: `**Hadith on the Reward of Reciting the Quran**

**"Whoever recites a letter from the Book of Allah will receive one good deed (hasanah), and one good deed is multiplied tenfold. I do not say that Alif Lam Mim is one letter, but Alif is a letter, Lam is a letter, and Mim is a letter."**
— Narrated by Abdullah ibn Masʿud (رضي الله عنه) | Tirmidhi (Hasan Sahih)

🔢 **The math of mercy:**
- Just saying "Alif Lam Mim" = 3 letters × 10 hasanat = **30 good deeds**
- Al-Fatiha (typically ~139 letters) = approximately **1,390 hasanat** per recitation
- Recited in every rakʿah of every prayer — rewards multiply enormously

**Other hadith on Quran recitation:**

🌟 *"The best of you are those who learn the Quran and teach it."* (Bukhari)

🌟 *"Recite the Quran, for it will come as an intercessor for its companions on the Day of Resurrection."* (Muslim)

🌟 *"One who is proficient in the Quran will be with the noble and righteous scribes (angels)."* (Muslim)

🌟 *"The example of the believer who recites the Quran is like that of a citron — its scent is fragrant and its taste is sweet. The believer who does not recite the Quran is like a date — no scent but its taste is sweet."* (Bukhari)

🌟 *"Keep refreshing your knowledge of the Quran, for I swear by the One in Whose hand is my soul, it escapes more quickly than camels from their hobbles."* (Bukhari & Muslim)

**Lesson:** Never underestimate even a single verse recited sincerely. The rewards are beyond imagination.`,
    tags: ["reward", "hasanat", "recitation", "reading"],
  },
  {
    id: "hadith-prayer",
    title: "Key Hadith on Prayer (Salah)",
    category: "hadith",
    slashCommand: "/salah-hadith",
    triggers: ["hadith prayer", "salah importance", "first question", "pillar of religion", "covenant prayer", "عمود الدين", "prayer hadith", "judgment day prayer"],
    content: `**Key Hadith on the Importance of Prayer (Salah)**

🌟 *"The covenant that distinguishes us from them (disbelievers) is the prayer, and whoever abandons it has disbelieved."*
— Narrated by Buraidah (رضي الله عنه) | Tirmidhi, Ibn Majah (Sahih)

🌟 *"The first thing a person will be held accountable for on the Day of Resurrection is his prayer. If it is sound, the rest of his deeds will be sound. If it is corrupt, the rest of his deeds will be corrupt."*
— Narrated by Abu Hurairah (رضي الله عنه) | Tabarani (Sahih)

🌟 *"Prayer is the pillar of religion (عمود الدين). Whoever establishes it has established religion, and whoever destroys it has destroyed religion."*
— Bayhaqi

🌟 *"Between a man and shirk and kufr is the abandonment of prayer."*
— Narrated by Jabir ibn Abdillah (رضي الله عنه) | Muslim

🌟 *"The key to Paradise is prayer, and the key to prayer is purification (wudu)."*
— Narrated by Ali (رضي الله عنه) | Tirmidhi

**The 5 Daily Prayers:**
| Prayer | Arabic | Time |
|--------|--------|------|
| Fajr | الفجر | Dawn to sunrise |
| Dhuhr | الظهر | Midday to mid-afternoon |
| Asr | العصر | Mid-afternoon to sunset |
| Maghrib | المغرب | Sunset to ~90 min after |
| Isha | العشاء | Until midnight (or Fajr) |

**The Prophet ﷺ's last advice:**
On his deathbed, the Prophet ﷺ repeated: *"As-salah, as-salah, wama malakat aymanukum"* — **"The prayer, the prayer, and those whom your right hands possess."** (Abu Dawud)

Guard your prayer above all else.`,
    tags: ["prayer", "salah", "importance", "pillar"],
  },
  {
    id: "hadith-forty",
    title: "Arba'een — Key Hadith Collection",
    category: "hadith",
    slashCommand: "/arbain",
    triggers: ["40 hadith", "forty hadith", "arba'een", "arbain", "nawawi", "imam nawawi", "key hadith", "important hadith"],
    content: `**The 40 Hadith of Imam An-Nawawi — Islam in 40 Statements**

Imam An-Nawawi (رحمه الله) compiled 42 hadith that cover the foundations of Islamic belief and action. Here are some of the most impactful:

**#1 — Actions by Intentions** (Bukhari): *"Indeed, actions are by intentions..."*

**#2 — Islam, Iman, Ihsan** (Muslim):
- Islam: Shahada, prayer, zakat, fasting, Hajj
- Iman: Believe in Allah, His angels, books, messengers, Last Day, divine decree (qadr)
- Ihsan: *"To worship Allah as if you see Him, and if you cannot see Him, know that He sees you"*

**#5 — Innovations** (Muslim): *"Whoever introduces into this affair of ours something that is not part of it, it will be rejected."*

**#6 — Halal and Haram** (Bukhari & Muslim): *"The halal is clear and the haram is clear..."*

**#9 — What is Prohibited** (Bukhari & Muslim): *"What I have forbidden to you, avoid it; and what I have commanded you to do, do as much of it as you can."*

**#12 — Leaving What Doesn't Concern You** (Tirmidhi): *"Part of the perfection of a person's Islam is that he leaves what does not concern him."*

**#13 — Love for Your Brother** (Bukhari & Muslim): *"None of you truly believes until he loves for his brother what he loves for himself."*

**#17 — Righteousness and Sin** (Muslim): *"Righteousness is good character, and sin is what waivers in your soul and you dislike that people find out about it."*

**#19 — Worship Allah and Don't Harm Others** (Muslim): *"Be mindful of Allah and He will protect you..."*

**#35 — Brotherhood** (Muslim): *"Do not envy one another, do not inflate prices against one another, do not hate one another, do not turn away from one another..."*

These 40 hadith are a complete guide to Islamic life. Memorizing and acting on them is a tremendous accomplishment.`,
    tags: ["nawawi", "forty hadith", "foundational", "collection"],
  },
  {
    id: "hadith-seeking-knowledge",
    title: "Hadith on Seeking Knowledge",
    category: "hadith",
    slashCommand: "/knowledge",
    triggers: ["seeking knowledge", "knowledge islam", "obligation knowledge", "طلب العلم", "student of knowledge", "learn", "study", "tawadu al-ilm"],
    content: `**Hadith on the Virtues and Obligation of Seeking Knowledge**

🌟 *"Seeking knowledge is an obligation upon every Muslim."*
— Ibn Majah (Sahih)

This refers primarily to the knowledge of Islam needed to fulfill one's religious duties — knowing how to pray, how to fast, what is halal and haram in one's situation.

🌟 *"Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise."*
— Muslim

🌟 *"When a person dies, all their deeds end except three: ongoing charity (sadaqah jariyah), knowledge that benefits others, and a righteous child who prays for them."*
— Muslim

🌟 *"The scholars are the heirs of the Prophets."*
— Abu Dawud, Tirmidhi (Sahih)

🌟 *"Allah eases the way to Paradise for whoever seeks knowledge."* And: *"The angels lower their wings in approval for the student of knowledge."*
— Abu Dawud

🌟 *"Wisdom is the lost property of the believer — wherever he finds it, he has the most right to it."*
— Tirmidhi

**Ibn Al-Qayyim said:**
*"Knowledge is life. Ignorance is death. The heart that is ignorant of Allah is a dead heart."*

**Types of obligatory knowledge:**
1. Aqeedah (belief) — knowing who Allah is, the pillars of faith
2. Worship — how to pray, fast, purify
3. Dealings — knowing what transactions and interactions are lawful
4. Prophetic biography (Seerah) — knowing the life of the Prophet ﷺ

**Use NoorAl** to grow in all of these — the Quran reader, ahadith browser, and Ask Noor are your tools.`,
    tags: ["knowledge", "seeking", "obligation", "virtue"],
  },
];
