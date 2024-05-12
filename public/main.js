function submitVote() {
  var selectedOption = document.querySelector(
    'input[name="option"]:checked'
  ).value;

  fetch("/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ option: selectedOption }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data); // Log the server response
      updateResults();
    })
    .catch((error) => {
      console.error("Error submitting vote:", error);
    });
}

function updateResults() {
  fetch("/results")
    .then((response) => response.json())
    .then((data) => {
      var resultHTML = "<p>Total Responses: " + data.total_responses + "</p>";
      resultHTML += "<ul>";
      data.results.forEach(function (option) {
        resultHTML +=
          "<li>Responses for Option " +
          option.option +
          ": " +
          option.count +
          "</li>";
      });
      resultHTML += "</ul>";

      document.getElementById("results").innerHTML = resultHTML;
    })
    .catch((error) => {
      console.error("Error fetching results:", error);
    });
}

// Fetch initial results when the page loads
updateResults();
