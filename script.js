let jsonData = {}; // To store the combined JSON file

// Fetch JSON Data
fetch('combined.json')
  .then(response => response.json())
  .then(data => {
   
    jsonData = data;
    loadSubjects(); // Function to load the subjects on the homepage
  })
  .catch(error => console.error('Error loading JSON:', error));

// Function to load subjects on index.html
function loadSubjects() {
  const subjectList = document.getElementById('subject-list');
  Object.keys(jsonData).forEach(subject => {
    const subjectDiv = document.createElement('div');
    subjectDiv.classList.add('subject-item');
    subjectDiv.innerText = subject;
    subjectDiv.onclick = () => selectSubject(subject);
    subjectList.appendChild(subjectDiv);
  });
}

// Function to handle subject selection and go to quiz page
function selectSubject(subject) {
  // Redirect to quiz page with selected subject in the URL
  window.location.href = `quiz.html?subject=${encodeURIComponent(subject)}`;
}

// Function to get a query parameter from the URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// Function to load the quiz page
function loadQuiz() {
  const subjectName = getQueryParam('subject');
  const subjectData = jsonData[subjectName];

  if (!subjectData) {
    alert('Subject not found');
    return;
  }

  const subjectHeading = document.getElementById('subject-name');
  subjectHeading.innerText = subjectName;

  const totalQuestions = subjectData.questions.length;

  const numQuestions = prompt(`Enter the number of questions (Max: ${totalQuestions})`, totalQuestions);
  const questionsToAsk = Math.min(parseInt(numQuestions), totalQuestions);

  startQuiz(subjectData.questions, questionsToAsk);
}

// Function to start the quiz
let currentQuestionIndex = 0;
let questions = [];

function startQuiz(questionSet, numQuestions) {
  questions = questionSet.slice(0, numQuestions); // Take the first N questions
  displayQuestion();
}

// Function to display the current question
function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    alert('Quiz complete!');
    window.location.href = 'index.html'; // Redirect back to homepage when quiz is over
    return;
  }

  const questionData = questions[currentQuestionIndex];
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = ''; // Clear previous question

  const questionElement = document.createElement('div');
  questionElement.innerText = `Q${currentQuestionIndex + 1}: ${questionData.question}`;
  quizContainer.appendChild(questionElement);

  questionData.options.forEach((option, index) => {
    const optionButton = document.createElement('button');
    optionButton.innerText = option.text;
    optionButton.onclick = () => handleAnswer(option.is_correct, optionButton);
    quizContainer.appendChild(optionButton);
  });

  document.getElementById('next-question').style.display = 'none';
}

// Function to handle answer selection
function handleAnswer(isCorrect, button) {
  if (isCorrect) {
    button.classList.add('correct');
    alert('Correct answer!');
  } else {
    button.classList.add('incorrect');
    alert('Incorrect answer!');
  }

  // Disable all option buttons after an answer is selected
  const buttons = document.querySelectorAll('#quiz-container button');
  buttons.forEach(btn => btn.disabled = true);

  document.getElementById('next-question').style.display = 'inline';
}

// Function for "Next Question" button
document.getElementById('next-question').onclick = () => {
  currentQuestionIndex++;
  displayQuestion();
};
