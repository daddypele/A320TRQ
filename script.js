<script>
  // Ensure your script starts after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    let jsonData = {}; // To store the combined JSON file

    // Fetch JSON Data
    fetch('combined_questions.json') // Ensure combined.json is in the same directory or adjust path
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`); // More informative error message
        }
        return response.json();
      })
      .then(data => {
        jsonData = data.subjects; // Access the subjects directly
        console.log('Loaded JSON Data:', jsonData); // Log the loaded data
        loadSubjects(); // Function to load the subjects on the homepage
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
        document.getElementById('error-message').style.display = 'block'; // Show error message
      });

    // Function to load subjects on index.html
    function loadSubjects() {
      const subjectList = document.getElementById('subject-list');

      // Check if jsonData has any subjects
      if (!jsonData || Object.keys(jsonData).length === 0) {
        document.getElementById('error-message').style.display = 'block'; // Show error message
        return;
      }

      // Populate subject list
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
  });
</script>
