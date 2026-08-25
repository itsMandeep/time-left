const minuteNode = document.querySelector("#minutesLeft");
const daysNode = document.querySelector("#daysLeft");
const clockNode = document.querySelector("#clockLeft");
const monthNode = document.querySelector("#monthLabel");
const dayNode = document.querySelector("#dayLabel");

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
});

let previousMinutes;
let previousDays;

function startOfNextDay(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

function startOfNextYear(now) {
  return new Date(now.getFullYear() + 1, 0, 1);
}

function minutesUntilTomorrow(now) {
  return Math.max(0, Math.ceil((startOfNextDay(now) - now) / 60000));
}

function daysUntilNextYear(now) {
  return Math.max(0, Math.ceil((startOfNextYear(now) - now) / 86400000));
}

function timeUntilTomorrow(now) {
  const totalSeconds = Math.max(0, Math.floor((startOfNextDay(now) - now) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function setWithTick(node, value, previousValue) {
  const text = String(value);

  if (node.textContent !== text) {
    node.textContent = text;

    if (previousValue !== undefined) {
      node.classList.remove("tick");
      void node.offsetWidth;
      node.classList.add("tick");
    }
  }
}

function render() {
  const now = new Date();
  const minutes = minutesUntilTomorrow(now);
  const days = daysUntilNextYear(now);

  setWithTick(minuteNode, minutes, previousMinutes);
  setWithTick(daysNode, days, previousDays);

  clockNode.textContent = timeUntilTomorrow(now);
  monthNode.textContent = monthFormatter.format(now);
  dayNode.textContent = dateFormatter.format(now);

  previousMinutes = minutes;
  previousDays = days;
}

render();
setInterval(render, 1000);
