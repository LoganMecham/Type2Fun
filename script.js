const calendarGrid = document.getElementById("calendar-grid");
const calendarMonth = document.getElementById("calendar-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
let displayedMonth = today.getMonth();
let displayedYear = today.getFullYear();

function renderCalendar(year, month) {
  if (!calendarGrid || !calendarMonth) return;

  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarMonth.textContent = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  weekDays.forEach((dayName) => {
    const weekdayCell = document.createElement("div");
    weekdayCell.className = "day-name";
    weekdayCell.textContent = dayName;
    calendarGrid.appendChild(weekdayCell);
  });

  for (let blank = 0; blank < firstDay.getDay(); blank += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell is-empty";
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const cell = document.createElement("div");
    cell.className = "day-cell";

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = String(day);
    cell.appendChild(dayNumber);

    if (date.getDay() === 5 || date.getDay() === 6) {
      const event = document.createElement("div");
      event.className = "day-event is-available";
      event.textContent = date.getDay() === 5 ? "Sample: Sunset Tour" : "Sample: Morning Group Ride";
      cell.appendChild(event);
    } else if (date.getDay() === 2) {
      const event = document.createElement("div");
      event.className = "day-event";
      event.textContent = "Limited private bookings";
      cell.appendChild(event);
    }

    calendarGrid.appendChild(cell);
  }
}

if (prevMonthButton && nextMonthButton) {
  prevMonthButton.addEventListener("click", () => {
    displayedMonth -= 1;
    if (displayedMonth < 0) {
      displayedMonth = 11;
      displayedYear -= 1;
    }
    renderCalendar(displayedYear, displayedMonth);
  });

  nextMonthButton.addEventListener("click", () => {
    displayedMonth += 1;
    if (displayedMonth > 11) {
      displayedMonth = 0;
      displayedYear += 1;
    }
    renderCalendar(displayedYear, displayedMonth);
  });
}

renderCalendar(displayedYear, displayedMonth);
