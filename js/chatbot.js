/* =========================================================
   CHATBOT (#19)
   ========================================================= */
(function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const win = document.getElementById('chatbotWindow');
  const close = document.getElementById('chatbotClose');
  const input = document.getElementById('chatbotInput');
  const send = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  if (!toggle || !win) return;

  const knowledge = [
    { keys: ['program', 'programs', 'offer', 'do you do'], reply: 'We run 6 programs: School Mentorship, Mama Angaza (tech), Nuggets with Wisdom podcast, Psycho-Social Support & Caregivers Summit, Agriculture & Economic Empowerment, and Media Advocacy.' },
    { keys: ['mama angaza', 'tech', 'cisco', 'huawei', 'coding'], reply: 'Mama Angaza equips young mothers with Cisco & Huawei certifications in cybersecurity, web design, and AI. We also sponsor brilliant students. 👉 Scroll to Programs for details.' },
    { keys: ['mentorship', 'school', 'student'], reply: 'Our School Mentorship Project guides students through career development, life skills, self-esteem, and decision-making. Reach out via the contact form to enroll your school.' },
    { keys: ['podcast', 'nuggets', 'wisdom'], reply: 'Nuggets with Wisdom with Mutendwah is our community podcast on menstrual health, nutrition, mental health, and engaging boys as allies.' },
    { keys: ['caregiver', 'summit', 'neurodivergent', 'autism'], reply: 'Our annual Caregivers Summit supports 200 caregivers and adolescent girls (13–25) with mental health resources and stigma-breaking sessions.' },
    { keys: ['donate', 'donation', 'give', 'pay', 'mpesa', 'm-pesa', 'bank'], reply: "You can donate via M-Pesa Paybill 522533 (Account: 7766759) or KCB Bank Lang'ata Branch (Acc: 1322072221, SWIFT: KCBLKENX). Click any 'Donate' button for full details." },
    { keys: ['volunteer', 'help', 'join'], reply: "We'd love your help! Click 'Volunteer' in the navbar to fill our quick 3-step application." },
    { keys: ['location', 'where', 'office', 'address'], reply: "We're based in Lang'ata, Nairobi, Kenya. Reach us at info@talktotmutendwah.org or +254 717 369 540." },
    { keys: ['contact', 'email', 'phone', 'call'], reply: 'Email: info@talktotmutendwah.org · Phone: +254 717 369 540 / +254 714 491 403' },
    { keys: ['pad', 'menstrual', 'period'], reply: 'We advocate for menstrual health, provide non-plastic eco-friendly pads, and run Menstrual Health Sundays. Goal: reach 1,000+ girls.' },
    { keys: ['partner', 'sponsor', 'corporate'], reply: 'We partner with companies, foundations, and individuals. Our biggest need: laptops, internet connectivity, mentorship, and scholarships.' },
    { keys: ['hello', 'hi', 'hey', 'habari'], reply: 'Hello! 👋 Welcome to Talk To Mutendwah Foundation. How can I help you today?' },
    { keys: ['thanks', 'thank you', 'asante'], reply: "You're welcome! Feel free to ask anything else. 💛" },
    { keys: ['vision', 'mission'], reply: 'Our vision: a resilient society where young women are mentally whole, economically self-reliant, and equipped to thrive.' }
  ];
  const fallback = "I'm not sure about that one — but our team would love to answer! Reach us at info@talktotmutendwah.org or use the contact form below. 💬";

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function respond(query) {
    const q = query.toLowerCase();
    const hit = knowledge.find(k => k.keys.some(key => q.includes(key)));
    setTimeout(() => addMsg(hit ? hit.reply : fallback, 'bot'), 500);
  }
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    respond(text);
  }
  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    if (win.classList.contains('open') && !messages.children.length) {
      addMsg("Hi there! 👋 I'm the Mutendwah Assistant. Ask me about our programs, donations, volunteering, or anything else!", 'bot');
    }
  });
  close.addEventListener('click', () => win.classList.remove('open'));
  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  document.querySelectorAll('.chatbot-quick button').forEach(b => {
    b.addEventListener('click', () => { addMsg(b.dataset.q, 'user'); respond(b.dataset.q); });
  });
})();