const images = ["0.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg"];
const chosenImage = images[Math.floor(Math.random() * images.length)];

const bgImage = document.createElement("img");

bgImage.src = `img/${chosenImage}`;
bgImage.classList.add("image__background");

document.body.prepend(bgImage);
// document.body.insertAdjacentElement("afterbegin", bgImage);
// document.body.appendChild(bgImage);
