const questions = [
  {
    words: ["interessante e stimolante", "un", "ho", "lavoro"],
    answers: [["ho", "un", "lavoro", "interessante e stimolante"]],
    sentence: "Ho un lavoro interessante e stimolante.",
    meaning: "我有一份有趣又让人有干劲的工作。",
    hint: "先找表示“我有”的动词，再拼出“一份工作”。"
  },
  {
    words: ["medico", "lui", "un", "è", "cinese", "molto bravo"],
    answers: [
      ["lui", "è", "un", "medico", "cinese", "molto bravo"],
      ["lui", "è", "un", "molto bravo", "medico", "cinese"]
    ],
    sentence: "Lui è un medico cinese molto bravo.",
    meaning: "他是一位很优秀的中国医生。",
    hint: "先找主语“他”和动词“是”，再补充职业与特点。"
  },
  {
    words: ["una gattina", "Haohao", "ha", "molto carina e dolce"],
    answers: [["Haohao", "ha", "una gattina", "molto carina e dolce"]],
    sentence: "Haohao ha una gattina molto carina e dolce.",
    meaning: "好好有一只很可爱、很温顺的小母猫。",
    hint: "先找谁“有”，再接“一只小母猫”和它的特点。"
  },
  {
    words: ["un operaio", "sono", "e", "una fabbrica", "in", "lavoro"],
    answers: [
      ["sono", "un operaio", "e", "lavoro", "in", "una fabbrica"],
      ["lavoro", "in", "una fabbrica", "e", "sono", "un operaio"]
    ],
    sentence: "Sono un operaio e lavoro in una fabbrica.",
    meaning: "我是一名工人，在一家工厂工作。",
    hint: "这里有两个动词，用“e”连接“我是……”和“我工作……”。"
  },
  {
    words: ["subito", "vieni"],
    answers: [["vieni", "subito"]],
    sentence: "Vieni subito!",
    meaning: "马上过来！",
    hint: "先放动作“过来”，再说明什么时候。"
  },
  {
    words: ["una torta", "prepara", "al cioccolato", "Marta"],
    answers: [["Marta", "prepara", "una torta", "al cioccolato"]],
    sentence: "Marta prepara una torta al cioccolato.",
    meaning: "玛尔塔做一个巧克力蛋糕。",
    hint: "先找做动作的人和动词，再补充做什么蛋糕。"
  },
  {
    words: ["il caffè", "Luca", "lentamente", "beve"],
    answers: [
      ["Luca", "beve", "lentamente", "il caffè"],
      ["Luca", "beve", "il caffè", "lentamente"]
    ],
    sentence: "Luca beve lentamente il caffè.",
    meaning: "卢卡慢慢地喝咖啡。",
    hint: "先拼“卢卡喝咖啡”，表示方式的词可以放在动词后或句末。"
  },
  {
    words: ["nero", "un quaderno", "Anna", "ha"],
    answers: [["Anna", "ha", "un quaderno", "nero"]],
    sentence: "Anna ha un quaderno nero.",
    meaning: "安娜有一本黑色的笔记本。",
    hint: "先找“谁有什么”，颜色通常放在名词后。"
  },
  {
    words: ["lavora", "in un ristorante", "è", "Paolo", "e", "cuoco"],
    answers: [["Paolo", "è", "cuoco", "e", "lavora", "in un ristorante"]],
    sentence: "Paolo è cuoco e lavora in un ristorante.",
    meaning: "保罗是一名厨师，在一家餐馆工作。",
    hint: "先说 Paolo 的职业，再用“e”连接他工作的地点。"
  },
  {
    words: ["a casa", "ogni sera", "Giulia", "legge"],
    answers: [
      ["Giulia", "legge", "a casa", "ogni sera"],
      ["ogni sera", "Giulia", "legge", "a casa"],
      ["Giulia", "legge", "ogni sera", "a casa"]
    ],
    sentence: "Giulia legge a casa ogni sera.",
    meaning: "朱莉娅每天晚上都在家看书。",
    hint: "先找“谁在阅读”，地点和时间可以放在句尾；时间也可以放在句首。"
  }
];

const app = document.querySelector("#app");
const exerciseTemplate = document.querySelector("#exercise-template");
const summaryTemplate = document.querySelector("#summary-template");

let currentIndex = 0;
let onSummary = false;
let states = createInitialStates();

function createInitialStates() {
  return questions.map(() => ({ selected: [], solved: false, attempted: false, hintVisible: false, meaningVisible: false }));
}

function renderExercise() {
  onSummary = false;
  app.replaceChildren(exerciseTemplate.content.cloneNode(true));
  const question = questions[currentIndex];
  const state = states[currentIndex];

  const counter = document.querySelector("#counter");
  const progressBar = document.querySelector("#progress-bar");
  const stepNumber = document.querySelector("#step-number");
  const answerZone = document.querySelector("#answer-zone");
  const wordBank = document.querySelector("#word-bank");
  const hintBox = document.querySelector("#hint-box");
  const feedback = document.querySelector("#feedback");
  const checkButton = document.querySelector("#check-button");
  const previousButton = document.querySelector("#previous-button");
  const nextButton = document.querySelector("#next-button");

  counter.textContent = `第 ${currentIndex + 1} / ${questions.length} 题`;
  progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  stepNumber.textContent = String(currentIndex + 1).padStart(2, "0");
  hintBox.textContent = `提示：${question.hint}`;
  hintBox.hidden = !state.hintVisible;

  function renderWords() {
    answerZone.replaceChildren();
    if (state.selected.length === 0) {
      const placeholder = document.createElement("p");
      placeholder.className = "answer-placeholder";
      placeholder.textContent = "从下方选择第一个词块…";
      answerZone.append(placeholder);
    } else {
      state.selected.forEach((wordIndex) => answerZone.append(createWordButton(wordIndex, true)));
    }

    wordBank.replaceChildren();
    question.words.forEach((_, wordIndex) => {
      if (!state.selected.includes(wordIndex)) wordBank.append(createWordButton(wordIndex, false));
    });
  }

  function createWordButton(wordIndex, selected) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "word-chip";
    button.textContent = question.words[wordIndex];
    button.setAttribute("aria-label", selected ? `移回待选区：${button.textContent}` : `选择：${button.textContent}`);
    button.addEventListener("click", () => {
      if (state.solved) return;
      if (selected) state.selected = state.selected.filter((index) => index !== wordIndex);
      else state.selected.push(wordIndex);
      state.attempted = false;
      renderWords();
      renderFeedback();
    });
    return button;
  }

  function renderFeedback() {
    feedback.replaceChildren();
    if (state.solved) {
      const panel = document.createElement("div");
      panel.className = "feedback-message success";
      panel.innerHTML = `<strong class="correct-sentence">${question.sentence}</strong><span>答对啦！试着用中文说出这句话的意思。</span>`;
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "meaning-toggle";
      toggle.textContent = state.meaningVisible ? "收起中文意思" : "查看中文意思";
      toggle.setAttribute("aria-expanded", String(state.meaningVisible));
      toggle.addEventListener("click", () => {
        state.meaningVisible = !state.meaningVisible;
        renderFeedback();
      });
      panel.append(toggle);
      if (state.meaningVisible) {
        const meaning = document.createElement("p");
        meaning.className = "meaning";
        meaning.textContent = question.meaning;
        panel.append(meaning);
      }
      feedback.append(panel);
    } else if (state.attempted) {
      const panel = document.createElement("div");
      panel.className = "feedback-message error";
      panel.textContent = "还差一点，再看看动词和主语的位置，调整后重新检查吧。";
      feedback.append(panel);
    }
  }

  renderWords();
  renderFeedback();

  document.querySelector("#clear-button").addEventListener("click", () => {
    if (state.solved) return;
    state.selected = [];
    state.attempted = false;
    renderWords();
    renderFeedback();
  });

  document.querySelector("#hint-button").addEventListener("click", () => {
    state.hintVisible = !state.hintVisible;
    hintBox.hidden = !state.hintVisible;
  });

  checkButton.addEventListener("click", () => {
    if (state.solved) {
      goForward();
      return;
    }
    if (state.selected.length !== question.words.length) {
      feedback.innerHTML = '<div class="feedback-message error">请先用完所有词块，再检查答案。</div>';
      return;
    }
    const selectedWords = state.selected.map((index) => question.words[index]);
    const isCorrect = question.answers.some((answer) => answer.every((word, index) => word === selectedWords[index]));
    state.attempted = !isCorrect;
    state.solved = isCorrect;
    if (isCorrect) {
      checkButton.textContent = currentIndex === questions.length - 1 ? "去朗读与小结 →" : "下一题 →";
      nextButton.disabled = false;
      renderWords();
    }
    renderFeedback();
  });
  checkButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });

  if (state.solved) checkButton.textContent = currentIndex === questions.length - 1 ? "去朗读与小结 →" : "下一题 →";
  previousButton.disabled = currentIndex === 0;
  previousButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderExercise();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  nextButton.disabled = !state.solved;
  nextButton.textContent = currentIndex === questions.length - 1 ? "去朗读与小结 →" : "下一题 →";
  nextButton.addEventListener("click", goForward);
}

function goForward() {
  if (!states[currentIndex].solved) return;
  if (currentIndex === questions.length - 1) renderSummary();
  else {
    currentIndex += 1;
    renderExercise();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderSummary() {
  onSummary = true;
  app.replaceChildren(summaryTemplate.content.cloneNode(true));
  document.querySelector("#review-button").addEventListener("click", () => {
    currentIndex = questions.length - 1;
    renderExercise();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.querySelector("#restart-button").addEventListener("click", () => {
    states = createInitialStates();
    currentIndex = 0;
    renderExercise();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

renderExercise();
