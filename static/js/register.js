
// Show Canvas Function
const showCanvas = () => {
  const book = document.querySelector('.flipbook')
  const colors = document.querySelector('#colors')
  const canvasContainer = document.querySelector('#canvasContainer')
  book.style.display = 'none';
  colors.style.display = 'none';
  canvasContainer.style.display = 'flex';
}
// Show Book Function
const showBook = () => {
  const book = document.querySelector('.flipbook')
  const colors = document.querySelector('#colors')
  const canvasContainer = document.querySelector('#canvasContainer');
  book.style.display = 'flex';
  colors.style.display = 'flex';
  canvasContainer.style.display = 'none';
}

const saveCanvas = async () => {
  const imageData = canvas.toDataURL(); // Get the data URL of the canvas image

  try {
    // Create a new FormData object
    const formData = new FormData();

    // Create a Blob object from the data URL with MIME type "image/png"
    const imageBlob = await (await fetch(imageData)).blob();

    // Append the image blob to the form data with a custom filename
    formData.append('image', imageBlob, 'image.png');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-UK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    formData.append('date', formattedDate);


    // Send the form data to the API
    const response = await fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    });

    // Handle the response from the API
    if (response.ok) {
      const data = await response.json();
      // console.log('Image successfully uploaded:', data);
    } else {
      // console.log('Error uploading image:', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }

  // loadBook();
  showBook();
  clearCanvas();
  doAfterSave();
};

const doAfterSave = () => {
  location.reload();
};




// Function to clear the canvas
const clearCanvas = () => {
  // Get the canvas element and its context
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to clear the canvas
const cancelCanvas = () => {
  clearCanvas();
  showBook();
}

// Toggle eraser mode
let isEraser = false;
const toggleEraser = ()=>{  
  const deleteBtn = document.querySelector(`#delete`);
  deleteBtn.textContent = !isEraser ? "Resume": "Erase";
  isEraser = !isEraser; 
}

// Load Book
const loadBook = async () => {

  let items = [];

  const fetchImageUrls = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/guests');
      const data = await response.json();
      items = data.image_urls;
      // console.log(items)

      // Do something with the imageUrls array
      // console.log(imageUrls);
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  }

  await fetchImageUrls();

  var groupSize = 5; // Number of items in each group
  var numGroups = Math.ceil(items.length / groupSize); // Calculate the total number of groups

  for (var i = 0; i < numGroups; i++) {
    var start = i * groupSize; // Calculate the start index of each group
    var end = start + groupSize; // Calculate the end index of each group
    var groupItems = items.slice(start, end); // Get the items for the current group

    // Set Field
    // Create the <div> element
    var divElement = document.createElement('div');
    divElement.className = 'hard';
    divElement.style.backgroundColor = 'white';

    // Create the <svg> element
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('viewBox', '0 0 600 800');

    // Create the <g> elements
    var lineGroupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    lineGroupElement.id = 'lineGroup' + i;

    var imageGroupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    imageGroupElement.id = 'imageGroup' + i;

    var headerElement = document.createElement('h4');
    headerElement.textContent = "VISITORS LOG";
    headerElement.style.textDecoration = "underline";
    divElement.appendChild(headerElement);

    // Append the <g> elements to the <svg> element
    svgElement.appendChild(lineGroupElement);
    svgElement.appendChild(imageGroupElement);

    // Append the <svg> element to the <div> element
    divElement.appendChild(svgElement);

    // Append the <div> element to the document body or any desired parent element

    const book = document.querySelector('.flipbook')

    book.appendChild(divElement);

    const lineGroup = document.getElementById("lineGroup" + i);
    const imageGroup = document.getElementById("imageGroup" + i);

    const imageWidth = 150;
    const imageHeight = 100;
    const imageMargin = 20;

    const lineY = 20 + imageHeight + imageMargin / 2;
    const lineX1 = 40;
    const lineX2 = 560;
    // Process the items in the current group
    groupItems.forEach(function (item, i) {
      // Your code to handle each item goes here
      const image = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );

      image.setAttribute("x", 80);
      image.setAttribute("y", 40 + i * (imageHeight + imageMargin));
      image.setAttribute("width", imageWidth);
      image.setAttribute("height", imageHeight);
      image.setAttribute("href", item.url);
      image.setAttribute("alt", "Image " + (i + 1));
      imageGroup.appendChild(image);

      const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      dateText.setAttribute("x", 320);
      dateText.setAttribute("y", 90 + i * (imageHeight + imageMargin));
      dateText.setAttribute("fill", "#000");
      dateText.textContent = item.date;
      imageGroup.appendChild(dateText);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", lineX1);
      line.setAttribute("y1", lineY + i * (imageHeight + imageMargin));
      line.setAttribute("x2", lineX2);
      line.setAttribute("y2", lineY + i * (imageHeight + imageMargin));
      line.setAttribute("stroke", "#83c5d6");
      line.setAttribute("stroke-width", "2");
      lineGroup.appendChild(line);

    });

  }
  const book = document.querySelector('.flipbook')
  let extra = book.children.length % 2 === 0 ? `<div class="hard"></div>` : ``
  let cover = `
<div class="hard">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700">
    <rect width="100%" height="100%" fill="#83c5d6" />
    <rect
      x="20"
      y="20"
      width="360"
      height="560"
      fill="#ffffff"
      stroke="#333333"
      stroke-width="4"
    />
    <image
      x="100"
      y="80"
      width="200"
      height="200"
      href="static/images/finance-specialty-logo.png"
      alt="Logo"
    />
  </svg>
</div>`

  // book.innerHTML += cover
  book.innerHTML += extra + cover
}

// Canvas
let strokeColor = "";
const loadCanvas = () => {  
  const pens = document.querySelectorAll(".pen-color");
  pens.forEach((pen) => {
    pen.addEventListener("click", () => {
      // console.log("hello");
      const backgroundColor = window.getComputedStyle(pen).backgroundColor;
      // console.log(backgroundColor);
      strokeColor = backgroundColor;
      showCanvas();
    });
  });

  // Get the canvas element and its context
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Variables to track drawing state
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Event listeners
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("touchstart", startDrawingTouch);
  canvas.addEventListener("touchmove", drawTouch);
  canvas.addEventListener("touchend", stopDrawingTouch);
  canvas.addEventListener("touchcancel", stopDrawingTouch);

  // Function to start drawing
  function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function startDrawingTouch(e) {
    e.preventDefault();
    isDrawing = true;
    const touch = e.touches[0];
    [lastX, lastY] = [touch.pageX - canvas.offsetLeft, touch.pageY - canvas.offsetTop];
  }

  // Function to draw or erase
  function draw(e) {
    e.preventDefault();
    if (!isDrawing) return;

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out"; // Set eraser mode
      ctx.lineWidth = 10; // Set eraser size
      ctx.strokeStyle = "rgba(0, 0, 0, 1)"; // Set eraser color
    } else {
      ctx.globalCompositeOperation = "source-over"; // Set drawing mode
      ctx.lineWidth = 4; // Set drawing size
      ctx.strokeStyle = strokeColor; // Set drawing color
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function drawTouch(e) {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 10;
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 4;
      ctx.strokeStyle = strokeColor;
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(touch.pageX - canvas.offsetLeft, touch.pageY - canvas.offsetTop);
    ctx.stroke();
    [lastX, lastY] = [touch.pageX - canvas.offsetLeft, touch.pageY - canvas.offsetTop];
  }

  // Function to stop drawing
  function stopDrawing(e) {
    e.preventDefault();
    isDrawing = false;
  }

  function stopDrawingTouch(e) {
    e.preventDefault();
    isDrawing = false;
  }


}



loadBook();
loadCanvas();






