// main.js

function submitVote(event) {
  event.preventDefault();

  const selectedOption = document.querySelector('input[name="vote"]:checked');
  if (selectedOption) {
    fetch("http://localhost:3000/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ option: selectedOption.value }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        displayResults();
        // Display results immediately after submitting vote
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to submit vote");
      });
  } else {
    alert("Please select an option to vote.");
  }
}

function displayResults() {
  fetch("http://localhost:3000/results")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("totalResponses").textContent =
        data.totalResponses;
      document.getElementById("option1Responses").textContent =
        data.option1Responses;
      document.getElementById("option2Responses").textContent =
        data.option2Responses;
      document.getElementById("results").style.display = "block";
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to fetch results");
    });
}
