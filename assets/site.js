(function () {
  if (window.__type2funSiteInitialized) return;
  window.__type2funSiteInitialized = true;

  const featuredRides = [
    {
      key: "cathedral-valley",
      name: "Cathedral Valley Ride",
      area: "Capitol Reef area",
      description: "A dramatic Capitol Reef area ride with big views, rolling dirt roads, and stops for photos and geology stories.",
      contactKey: "cathedral-valley"
    },
    {
      key: "goblin-valley",
      name: "Goblin Valley Desert Trails Ride",
      area: "Goblin Valley State Park area",
      description: "Flowing desert trails around hoodoos and open slickrock zones with pacing options for mixed rider groups.",
      contactKey: "goblin-valley"
    },
    {
      key: "buckhorn-wedge",
      name: "Buckhorn Wash + Wedge Option",
      area: "Buckhorn Wash and the Wedge",
      description: "A canyon-country ride with an optional overnight camp at the Wedge for sunset, stars, and next-day riding.",
      contactKey: "buckhorn-wedge"
    },
    {
      key: "white-rim",
      name: "White Rim Road",
      area: "Canyonlands",
      description: "A classic multi-day loop with huge canyon views and remote desert terrain.",
      contactKey: "white-rim"
    }
  ];

  function redirectIndexPath() {
    if (!location.pathname.endsWith("/index.html")) return;
    const newPath = `${location.pathname.slice(0, -"index.html".length)}`;
    location.replace(`${newPath}${location.search}${location.hash}`);
  }

  function initLogo() {
    const logo = document.querySelector("[data-site-logo]");
    if (!logo) return;
    logo.src = "Cyclist%20logo%20with%20mountain%20and%20sun.png";
  }

  function initNavCurrent() {
    const pathname = location.pathname;
    const page = pathname.split("/").pop() || "";
    const isHomePath = pathname.endsWith("/") || page === "index.html";

    document.querySelectorAll(".site-nav a").forEach((link) => {
      const target = (link.getAttribute("href") || "").replace(/^\.\//, "");
      const isHomeLink = target === "";
      if ((isHomeLink && isHomePath) || (!isHomeLink && target === page)) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function renderFeaturedCards(rootId) {
    const root = document.getElementById(rootId);
    if (!root || root.children.length > 0) return;
    const isTourGrid = rootId === "featured-rides-tours";
    if (!isTourGrid) return;

    featuredRides.forEach((ride) => {
      const card = document.createElement("article");
      card.className = isTourGrid ? "card tour-card" : "card";
      card.innerHTML = `
        <h3>${ride.name}</h3>
        <p><strong>Area:</strong> ${ride.area}</p>
        <p>${ride.description}</p>
        <a class="btn btn-primary${isTourGrid ? " tour-card__action" : ""}" href="./contact.html?ride=${ride.contactKey}">Book this tour</a>
      `;
      root.appendChild(card);
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
      },
      {
        src: "assets/gallery/IMG_5812.jpeg",
        location: "Bonneville Shoreline Trail",
        alt: "Bonneville Shoreline Trail in Utah"
      },
      {
        src: "assets/gallery/IMG_5811.jpeg",
        location: "Cathedral Valley Trail",
        alt: "Cathedral Valley Trail in Utah"
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

    if (galleryRoot.children.length > 0) return;

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
    function showNext() {
      index = (index + 1) % items.length;
      update();
    }
    function showPrev() {
      index = (index - 1 + items.length) % items.length;
      update();
    }

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

    const rideInterestInput = document.getElementById("ride-interest");
    const subjectInput = document.getElementById("subject");
    const quickPickRoot = document.getElementById("ride-quick-picks");

    const rideMap = {};
    featuredRides.forEach((ride) => {
      rideMap[ride.contactKey] = ride.name;
      rideMap[ride.key] = ride.name;
    });

    if (quickPickRoot && rideInterestInput && quickPickRoot.children.length === 0) {
      featuredRides.forEach((ride) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quick-pick";
        button.textContent = ride.name;
        button.addEventListener("click", () => {
          rideInterestInput.value = ride.name;
        });
        quickPickRoot.appendChild(button);
      });
    }

    const params = new URLSearchParams(location.search);
    const selected = params.get("ride") || params.get("tour");
    if (selected && rideMap[selected] && rideInterestInput) {
      rideInterestInput.value = rideMap[selected];
      if (subjectInput) subjectInput.value = `Booking request: ${rideMap[selected]}`;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get("name") || "";
      const email = fd.get("email") || "";
      const subject = fd.get("subject") || "Ride booking question";
      const rideInterest = fd.get("rideInterest") || "General question";
      const customRideRequest = fd.get("customRideRequest") || "";
      const message = fd.get("message") || "";
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Ride interest: ${rideInterest}`,
        `Custom ride request: ${customRideRequest}`,
        "",
        `${message}`
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));
      location.href = `mailto:type2funinc@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  redirectIndexPath();

  document.addEventListener("DOMContentLoaded", () => {
    initLogo();
    initNavCurrent();
    renderFeaturedCards("featured-rides-tours");
    initCalendar();
    initGallery();
    initContactPrefill();
  });
})();
