(function () {
  const logoCandidates = [
    "assets/logo.png",
    "Cyclist%20logo%20with%20mountain%20and%20sun.png"
  ];

  function initLogoFallback() {
    const logo = document.querySelector("[data-site-logo]");
    if (!logo) return;

    let index = 0;
    function tryNext() {
      if (index >= logoCandidates.length) {
        logo.style.visibility = "hidden";
        return;
      }
      logo.src = logoCandidates[index++];
    }

    logo.addEventListener("error", tryNext);
    if (logoCandidates[0] !== logo.getAttribute("src")) {
      tryNext();
    }
  }

  function initNavCurrent() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((link) => {
      const target = link.getAttribute("href");
      if (target === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function initCalendar() {
    const grid = document.getElementById("calendar-grid");
    const label = document.getElementById("calendar-month");
    const prev = document.getElementById("prev-month");
    const next = document.getElementById("next-month");
    if (!grid || !label || !prev || !next) return;

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let current = new Date();

    function render(monthDate) {
      grid.innerHTML = "";
      const y = monthDate.getFullYear();
      const m = monthDate.getMonth();
      const first = new Date(y, m, 1);
      const count = new Date(y, m + 1, 0).getDate();
      label.textContent = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      days.forEach((d) => {
        const cell = document.createElement("div");
        cell.className = "day-name";
        cell.textContent = d;
        grid.appendChild(cell);
      });

      for (let i = 0; i < first.getDay(); i += 1) {
        const blank = document.createElement("div");
        blank.className = "day-cell";
        blank.setAttribute("aria-hidden", "true");
        grid.appendChild(blank);
      }

      for (let d = 1; d <= count; d += 1) {
        const date = new Date(y, m, d);
        const cell = document.createElement("div");
        cell.className = "day-cell";
        cell.innerHTML = `<div class="day-number">${d}</div>`;

        if (date.getDay() === 5 || date.getDay() === 6) {
          const tag = document.createElement("div");
          tag.className = "day-event available";
          tag.textContent = date.getDay() === 5 ? "Available" : "Popular";
          cell.appendChild(tag);
        }
        if (d % 9 === 0) {
          const tag2 = document.createElement("div");
          tag2.className = "day-event limited";
          tag2.textContent = "Limited spots";
          cell.appendChild(tag2);
        }

        grid.appendChild(cell);
      }
    }

    prev.addEventListener("click", () => {
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
      render(current);
    });
    next.addEventListener("click", () => {
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      render(current);
    });
    render(current);
  }

  function initGallery() {
    const galleryRoot = document.getElementById("gallery-grid");
    const lightbox = document.getElementById("lightbox");
    if (!galleryRoot || !lightbox) return;

    const items = [
      {
        src: "assets/gallery/IMG_2006.jpeg",
        location: "Cathedral Valley, Capitol Reef National Park",
        alt: "Cyclists riding in Cathedral Valley under tall desert formations"
      },
      {
        src: "assets/gallery/IMG_2038.jpeg",
        location: "Cathedral Valley, Capitol Reef National Park",
        alt: "Riders and bikes at a Cathedral Valley overlook"
      },
      {
        src: "assets/gallery/IMG_2412.jpeg",
        location: "Goblin Valley State Park trails",
        alt: "Bike rider near hoodoo rock formations in Goblin Valley"
      },
      {
        src: "assets/gallery/IMG_5221.png",
        location: "Buckhorn Wash riding and camping at the Wedge",
        alt: "Sunset bike camp scene near Buckhorn Wash and the Wedge"
      }
    ];

    const lbImage = document.getElementById("lightbox-image");
    const lbLocation = document.getElementById("lightbox-location");
    const lbCount = document.getElementById("lightbox-count");
    const close = document.getElementById("lightbox-close");
    const prev = document.getElementById("lightbox-prev");
    const next = document.getElementById("lightbox-next");

    let index = 0;

    function update() {
      const item = items[index];
      lbImage.src = item.src;
      lbImage.alt = item.alt;
      lbLocation.textContent = item.location;
      lbCount.textContent = `${index + 1} / ${items.length}`;
    }

    items.forEach((item, i) => {
      const article = document.createElement("article");
      article.className = "gallery-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-button";
      btn.innerHTML = `<img class="gallery-thumb" src="${item.src}" alt="${item.alt}">`;
      btn.addEventListener("click", () => {
        index = i;
        update();
        lightbox.hidden = false;
      });

      const caption = document.createElement("div");
      caption.className = "gallery-caption";
      caption.innerHTML = `<div class="gallery-location">${item.location}</div>`;

      article.appendChild(btn);
      article.appendChild(caption);
      galleryRoot.appendChild(article);
    });

    function closeBox() {
      lightbox.hidden = true;
      lbImage.src = "";
    }
    function showNext() { index = (index + 1) % items.length; update(); }
    function showPrev() { index = (index - 1 + items.length) % items.length; update(); }

    close.addEventListener("click", closeBox);
    next.addEventListener("click", showNext);
    prev.addEventListener("click", showPrev);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeBox();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }

  function initContactPrefill() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const params = new URLSearchParams(location.search);
    const tour = params.get("tour");
    const tourMap = {
      cathedral: "Cathedral Valley Ride",
      goblin: "Goblin Valley Desert Trails Ride",
      buckhorn: "Buckhorn Wash Ride + Wedge Camping"
    };
    const select = document.getElementById("tour-interest");
    const subjectInput = document.getElementById("subject");
    if (tour && tourMap[tour]) {
      if (select) select.value = tour;
      if (subjectInput) subjectInput.value = `Booking request: ${tourMap[tour]}`;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get("name");
      const email = fd.get("email");
      const subject = fd.get("subject") || "Tour booking question";
      const message = fd.get("message");
      const body = `Name: ${name}%0AEmail: ${email}%0ATour: ${fd.get("tour")}%0A%0A${encodeURIComponent(message)}`;
      location.href = `mailto:type2funrides@example.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLogoFallback();
    initNavCurrent();
    initCalendar();
    initGallery();
    initContactPrefill();
  });
})();
