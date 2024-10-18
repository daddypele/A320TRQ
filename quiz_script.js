document.addEventListener('DOMContentLoaded', function () {
  const subjectNameElement = document.getElementById('subject-name');
  const quizContainer = document.getElementById('quiz-container');
  const nextQuestionButton = document.getElementById('next-question');
  const questionInput = document.getElementById('question-input');
  const numberOfQuestionsInput = document.getElementById('number-of-questions');
  const startQuizButton = document.getElementById('start-quiz');

  let questions = [];
  let selectedQuestions = [];
  let currentQuestionIndex = 0;

  // Function to load the subject and questions based on URL parameter
  function loadQuiz() {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');

    // Set the subject name in the header
    subjectNameElement.innerText = subject;

    // Fetch the JSON data
    fetch('combined_questions.json') // Adjust the file name if needed
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        questions = data.subjects[subject]; // Get questions for the selected subject
        if (questions && questions.length > 0) {
          subjectNameElement.innerText += ` (Total Questions: ${questions.length})`;
          questionInput.style.display = 'block'; // Show input for number of questions
        } else {
          quizContainer.innerHTML = '<p>No questions available for this subject.</p>';
        }
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
        quizContainer.innerHTML = '<p>Error loading quiz questions. Please try again later.</p>';
      });
  }

  // Start Quiz
  startQuizButton.onclick = () => {
    const numberOfQuestions = parseInt(numberOfQuestionsInput.value);
    
    // Validate the number of questions
    if (isNaN(numberOfQuestions) || numberOfQuestions < 1) {
      alert('Please enter a valid number of questions.');
      return;
    }

    // If user wants more questions than available, use all available questions
    if (numberOfQuestions > questions.length) {
      alert(`There are only ${questions.length} questions available. Starting quiz with all questions.`);
      selectedQuestions = questions; // Use all questions
    } else {
      // Shuffle questions and select the required number
      selectedQuestions = shuffleArray(questions).slice(0, numberOfQuestions);
    }

    currentQuestionIndex = 0; // Reset question index
    displayQuestion(); // Start displaying questions
    questionInput.style.display = 'none'; // Hide input after selection
    nextQuestionButton.style.display = 'none'; // Hide next button initially
  };

  // Function to display the current question
  function displayQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];

    // Clear the quiz container and display the question
    quizContainer.innerHTML = '';
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `<p>${currentQuestion.question}</p>`;
    quizContainer.appendChild(questionElement);

    // Display options
    currentQuestion.options.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.innerHTML = `<button>${option.text}</button>`;
      optionElement.onclick = () => handleAnswer(option.is_correct);
      quizContainer.appendChild(optionElement);
    });

    nextQuestionButton.style.display = 'none'; // Hide next button initially
  }

  // Handle answer selection
  function handleAnswer(isCorrect) {
    if (isCorrect) {
      alert('Correct answer!');
    } else {
      alert('Incorrect answer. Try again!');
    }

    // Show the next question button
    nextQuestionButton.style.display = 'block';
    nextQuestionButton.onclick = () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < selectedQuestions.length) {
        displayQuestion();
      } else {
        quizContainer.innerHTML = '<p>Quiz completed!</p>';
        nextQuestionButton.style.display = 'none'; // Hide next button
      }
    };
  }

  // Shuffle function for randomizing questions
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  loadQuiz(); // Load the quiz when the page is ready
});
