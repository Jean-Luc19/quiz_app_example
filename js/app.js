/* global $ */
// State object

const state = {
  questions: [
    {
      text: "Which number am I thinking of?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 0
    },
    {
      text: "What about now, can you guess now?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 1
    },
    {
      text: "I'm thinking of a number between 1 and 4. What is it?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 2,
    },
    {
      text: "If I were a number between 1 and 4, which would I be?",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 3,
    },
    {
      text: "Guess what my favorite number is",
      choices: ["1", "2", "3", "4"],
      correctChoiceIndex: 0,
    }
  ],
  praises : [
    "Wow. You got it right. I bet you feel really good about yourself now",
    "Correct. Which would be impressive, if it wasn't just luck",
    "Oh was I yawning? Because you getting that answer right was boring me to sleep",
    "Hear all that applause for you because you got this question right? Neither do I."
  ],

  admonishments: [
    "Really? That's your guess? WE EXPECTED BETTER OF YOU!",
    "Looks like someone wasn't paying attention in telepathy school, geesh!",
    "That's incorrect. You've dissapointed yourself, your family, your city, state, country and planet, to say nothing of the cosmos"
  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};

// State modification functions
const setRoute = (state, route) => state.route = route;

const resetGame = state => {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

const answerQuestion = (state, answer) => {
  const currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  selectFeedback(state);
  setRoute(state, 'answer-feedback');
};

const selectFeedback = state => state.feedbackRandom = Math.random();

const advance = state => {
  state.currentQuestionIndex++;
  state.currentQuestionIndex === state.questions.length ?
    setRoute(state, 'final-feedback') :
    setRoute(state, 'question');
};

// Render functions
const renderApp = (state, elements) => {
  // default to hiding all routes, then show the current route
  Object.keys(elements).forEach(route => elements[route].hide());
  
  elements[state.route].show();

  if (state.route === 'start') {
    renderStartPage(state, elements[state.route]);
  }
  else if (state.route === 'question') {
    renderQuestionPage(state, elements[state.route]);
  }
  else if (state.route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.route]);
  }
  else if (state.route === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.route]);
  }
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system

function renderStartPage() {
}

function renderQuestionPage (state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
}
 

function renderAnswerFeedbackPage (state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
}

const renderFinalFeedbackPage = (state, element) => renderFinalFeedbackText(state, element.find('.results-text'));


const renderQuestionCount = (state, element)=>  {
  const text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

let renderQuestionText = (state, element) => {
  let currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

let renderChoices = (state, element) => {
  let currentQuestion = state.questions[state.currentQuestionIndex];
  let choices = currentQuestion.choices.map(function(choice, index) {
    return (
      `<li>
        <input type="radio" name="user-answer" value="${index}" required>
        <label>${choice}</label>
      </li>`
    );
  });
  element.html(choices);
};

let renderAnswerFeedbackHeader =(state, element)=>  {
  let html = state.lastAnswerCorrect ?
      `<h6 class='user-was-correct'>correct</h6>` :
      `<h1 class='user-was-incorrect'>Wrooonnnngggg!</>`;

  element.html(html);
};

let renderAnswerFeedbackText =(state, element) => {
  let choices = state.lastAnswerCorrect ? state.praises : state.admonishments;
  let text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

let renderNextButtonText =(state, element) => {
  let text = state.currentQuestionIndex < state.questions.length - 1 ?
      `Next` : `How did I do?`;
  element.text(text);
};

let renderFinalFeedbackText =({score, questions}, element) => {
  let text = `You got ${score} out of
    ${questions.length} questions right.`;
  element.text(text);

  return {
    name: 'rich',
    score: score,
    questions: questions
  };
};

// Event handlers
let PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(function(event) {
  event.preventDefault();
  setRoute(state, 'question');
  renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
  event.preventDefault();
  let answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(function() {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});

$(() => renderApp(state, PAGE_ELEMENTS));


const Person = {
  name: 'Rich',
  fruits: ['apples', 'pears', 'bananas'],
  listMyFruits() {
    return this.fruits.map((fruit) => {
      return `My name is ${this.name} and I have a ${fruit}`;
    });
  }
};

console.log(Person.listMyFruits());
[
  'My name is undefined and I have a ....'
]




