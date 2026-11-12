var totalItems = 5;

function updateChecklist() {
  var saved = [];
  for (var i = 0; i < totalItems; i++) {
    var box = document.getElementById("check" + i);
    var label = document.getElementById("label" + i);

    saved[i] = box.checked;
    if (box.checked) {
      label.classList.add("checklist-done");
    } else {
      label.classList.remove("checklist-done");
    }
  }
  localStorage.setItem("campusChecklist", JSON.stringify(saved));
}
window.onload = function() {
  var saved = JSON.parse(localStorage.getItem("campusChecklist")) || [];
  for (var i = 0; i < totalItems; i++) {
    document.getElementById("check" + i).checked = saved[i];
  }
  updateChecklist();
};