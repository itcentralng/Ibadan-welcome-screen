let strokeColor = "";
const pens = document.querySelectorAll(".pen-color");
pens.forEach((pen) => {
  pen.addEventListener("click", () => {
    console.log("hello");
    const backgroundColor = window.getComputedStyle(pen).backgroundColor;
    console.log(backgroundColor);
    strokeColor = backgroundColor;
  });
});

// Get the canvas element and its context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Variables to track mouse position and drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Function to draw
function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.strokeStyle = strokeColor;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
}

// // Function to save the canvas as an image
// function saveCanvas() {
//   const image = canvas.toDataURL("image/png");
//   const link = document.createElement("a");
//   link.href = image;
//   link.download = "canvas.png";
//   link.click();
// }

// // Attach click event listener to the save button
// const saveButton = document.getElementById("saveButton");
// saveButton.addEventListener("click", saveCanvas);

// Store previous guests in an array
let guests = [];

// Function to update the guest list on the page
function updateGuestList() {
  const guestList = document.getElementById("guests");
  guestList.innerHTML = "";

  guests.forEach((guest) => {
    const listItem = document.createElement("li");
    listItem.textContent = guest;
    guestList.appendChild(listItem);
  });
}

// Handle form submission
const form = document.getElementById("registration-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const name = nameInput.value;

  // Add the guest to the array and update the list
  guests.push(name);
  updateGuestList();

  // Clear the input field
  nameInput.value = "";
});
