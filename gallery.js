const candidateImages = [
  "assets/gallery/IMG_2006.jpeg",
  "assets/gallery/IMG_2038.jpeg",
  "assets/gallery/IMG_2412.jpeg",
  "assets/gallery/IMG_5221.jpeg"
];

// Add more photos by uploading them into assets/gallery and adding their path above.

const galleryGrid = document.getElementById("gallery-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.getElementById("lightbox-close");
const prevButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let images = [];
let currentIndex = 0;

function imageExists(path) {
  return new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = path;
  });
}

function renderGallery() {
  galleryGrid.innerHTML = "";

  if (images.length === 0) {
    galleryGrid.innerHTML = "<p>No gallery images found yet.</p>";
    return;
  }

  images.forEach((path, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-button";
    button.setAttribute("aria-label", `Open image ${index + 1}`);

    const thumb = document.createElement("img");
    thumb.className = "gallery-thumb";
    thumb.src = path;
    thumb.alt = `Type2Fun ride photo ${index + 1}`;

    button.appendChild(thumb);
    button.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(button);
  });
}

function openLightbox(index) {
  currentIndex = index;
  lightboxImage.src = images[currentIndex];
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
}

function showPrev() {
  if (images.length === 0) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImage.src = images[currentIndex];
}

function showNext() {
  if (images.length === 0) return;
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImage.src = images[currentIndex];
}

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", showPrev);
nextButton.addEventListener("click", showNext);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showPrev();
  } else if (event.key === "ArrowRight") {
    showNext();
  }
});

async function initGallery() {
  const checks = await Promise.all(candidateImages.map((path) => imageExists(path)));
  images = candidateImages.filter((_, index) => checks[index]);
  renderGallery();
}

initGallery();
