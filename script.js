const calendarEl = document.getElementById("calendar");
const monthLabel = document.getElementById("month-label");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
let displayedYear = today.getFullYear();
let displayedMonth = today.getMonth();

function renderCalendar(year, month) {
  calendarEl.innerHTML = "";
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthLabel.textContent = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  weekDays.forEach((name) => {
    const dayName = document.createElement("div");
    dayName.className = "day-name";
    dayName.textContent = name;
    calendarEl.appendChild(dayName);
  });

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell muted";
    calendarEl.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = String(day);
    dayCell.appendChild(dayNumber);

    if (date.getDay() === 6) {
      const event = document.createElement("div");
      event.className = "event";
      event.textContent = "Booked Ride: 7-9 AM • Spanish Fork, UT";
      dayCell.appendChild(event);
    }

    calendarEl.appendChild(dayCell);
  }
}

prevBtn.addEventListener("click", () => {
  displayedMonth -= 1;
  if (displayedMonth < 0) {
    displayedMonth = 11;
    displayedYear -= 1;
  }
  renderCalendar(displayedYear, displayedMonth);
});

nextBtn.addEventListener("click", () => {
  displayedMonth += 1;
  if (displayedMonth > 11) {
    displayedMonth = 0;
    displayedYear += 1;
  }
  renderCalendar(displayedYear, displayedMonth);
});

renderCalendar(displayedYear, displayedMonth);
