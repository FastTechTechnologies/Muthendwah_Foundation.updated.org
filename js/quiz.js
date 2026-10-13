/* =========================================================
   PROGRAM QUIZ (#18)
   ========================================================= */
(function initQuiz() {
  const stepEl = document.getElementById('quizStep');
  const backBtn = document.getElementById('quizBack');
  const nextBtn = document.getElementById('quizNext');
  const progressBar = document.getElementById('quizProgressBar');
  const resultEl = document.getElementById('quizResult');
  if (!stepEl) return;

  const questions = [
    {
      q: 'What best describes you right now?',
      options: [
        { text: 'A young mother looking for skills', value: 'mama' },
        { text: 'A high school / college student', value: 'mentorship' },
        { text: 'A caregiver of a neurodivergent child', value: 'psychosocial' },
        { text: 'An advocate or media professional', value: 'media' }
      ]
    },
    {
      q: 'What area excites you most?',
      options: [
        { text: 'Technology & digital skills', value: 'mama' },
        { text: 'Guidance & life skills', value: 'mentorship' },
        { text: 'Mental health & wellness', value: 'psychosocial' },
        { text: 'Farming & handmade crafts', value: 'agriculture' }
      ]
    },
    {
      q: 'How much time can you commit?',
      options: [
        { text: 'A few hours a week (virtual)', value: 'media' },
        { text: 'Weekends on-site', value: 'mentorship' },
        { text: 'Full program (months)', value: 'mama' },
        { text: 'Flexible / as needed', value: 'psychosocial' }
      ]
    },
    {
      q: 'What impact matters most to you?',
      options: [
        { text: 'Helping women earn income', value: 'agriculture' },
        { text: 'Empowering girls through education', value: 'mentorship' },
        { text: 'Breaking mental health stigma', value: 'psychosocial' },
        { text: 'Bridging the digital divide', value: 'mama' }
      ]
    }
  ];

  const results = {
    mama: { title: 'Mama Angaza', desc: 'Digital literacy & tech certifications for young mothers.', cta: 'Join Mama Angaza' },
    mentorship: { title: 'School Mentorship Project', desc: 'Career development & life skills for students.', cta: 'Explore Mentorship' },
    psychosocial: { title: 'Psycho-Social Support', desc: 'Mental health support & Caregivers Summit.', cta: 'Learn More' },
    agriculture: { title: 'Agriculture & Economic Empowerment', desc: 'Vocational and farming skills for income.', cta: 'Get Started' },
    media: { title: 'Media Advocacy', desc: 'Championing mental health on TV & radio.', cta: 'Get Involved' }
  };

  let current = 0;
  const answers = [];

  function render() {
    const q = questions[current];
    progressBar.style.width = ((current + 1) / questions.length) * 100 + '%';
    stepEl.innerHTML = `
      <h4>${q.q}</h4>
      <div class="quiz-options">
        ${q.options.map(o => `
          <button class="quiz-option ${answers[current] === o.value ? 'selected' : ''}" data-value="${o.value}">
            ${o.text}
          </button>`).join('')}
      </div>`;
    stepEl.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        stepEl.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[current] = btn.dataset.value;
        nextBtn.disabled = false;
      });
    });
    nextBtn.disabled = !answers[current];
    nextBtn.textContent = current === questions.length - 1 ? 'See Result' : 'Next';
    backBtn.disabled = current === 0;
  }

  nextBtn.addEventListener('click', () => {
    if (current < questions.length - 1) { current++; render(); }
    else showResult();
  });
  backBtn.addEventListener('click', () => { if (current > 0) { current--; render(); } });

  function showResult() {
    const counts = {};
    answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const r = results[top];
    document.getElementById('quizContainer').classList.add('d-none');
    resultEl.classList.remove('d-none');
    resultEl.innerHTML = `
      <h4>🎉 Your match: ${r.title}</h4>
      <p>${r.desc}</p>
      <button class="btn btn-theme mt-2" data-bs-toggle="modal" data-bs-target="#contact">${r.cta}</button>
      <button class="btn btn-theme-outline mt-2 ms-2" id="quizRestart">Take Again</button>`;
    if (window.unlockBadge) window.unlockBadge('learner');
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; answers.length = 0;
      document.getElementById('quizContainer').classList.remove('d-none');
      resultEl.classList.add('d-none');
      render();
    });
  }
  render();
})();