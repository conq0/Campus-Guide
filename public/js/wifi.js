
function toggleFaq(answerId) {
  var answerElement = document.getElementById(answerId);

  if (answerElement) {
    if (answerElement.style.display === "block") {
      answerElement.style.display = "none";
    } else {
      answerElement.style.display = "block";
    }
  }
}
