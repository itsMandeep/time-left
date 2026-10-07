const watchMinutesNode = document.querySelector("#watchMinutes");
const watchDaysNode = document.querySelector("#watchDays");
const watchClockNode = document.querySelector("#watchClock");
const watchDateNode = document.querySelector("#watchDate");
const watchMonthNode = document.querySelector("#watchMonth");
const watchFaceNode = document.querySelector(".watch-face");

const watchDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
});

const watchMonthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
});

let previousWatchMinutes;
let previousWatchDays;

function nextDay(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

function nextYear(now) {
  return new Date(now.getFullYear() + 1, 0, 1);
}

function minutesLeft(now) {
  return Math.max(0, Math.ceil((nextDay(now) - now) / 60000));
}

function daysLeft(now) {
  return Math.max(0, Math.ceil((nextYear(now) - now) / 86400000));
}

function daysInYear(now) {
  const start = new Date(now.getFullYear(), 0, 1);
  const end = nextYear(now);

  return end - start;
}

function startOfYear(now) {
  return new Date(now.getFullYear(), 0, 1);
}

function clampProgress(value) {
  return Math.min(1, Math.max(0, value));
}

function shortClock(now) {
  const secondsLeft = Math.max(0, Math.floor((nextDay(now) - now) / 1000));
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function tickValue(node, value, previousValue) {
  const nextText = String(value);

  if (node.textContent !== nextText) {
    node.textContent = nextText;

    if (previousValue !== undefined) {
      node.classList.remove("tick");
      void node.offsetWidth;
      node.classList.add("tick");
    }
  }
}

function renderWatch() {
  // TODO
  const now = new Date();
  const minutes = minutesLeft(now);
  const days = daysLeft(now);
  const yearLengthInDays = Math.round(daysInYear(now) / 86400000);
  const minutePassedProgress = (1440 - minutes) / 1440;
  const dayPassedProgress = (yearLengthInDays - days) / yearLengthInDays;

  tickValue(watchMinutesNode, minutes, previousWatchMinutes);
  tickValue(watchDaysNode, days, previousWatchDays);

  watchMinutesNode.classList.toggle("is-long", String(minutes).length > 3);
  watchFaceNode.style.setProperty(
    "--minute-progress",
    `${(clampProgress(minutePassedProgress) * 100).toFixed(3)}%`,
  );
  watchFaceNode.style.setProperty(
    "--day-progress",
    `${(clampProgress(dayPassedProgress) * 100).toFixed(3)}%`,
  );

  watchClockNode.textContent = shortClock(now);
  watchDateNode.textContent = watchDateFormatter.format(now);
  watchMonthNode.textContent = watchMonthFormatter.format(now);

  previousWatchMinutes = minutes;
  previousWatchDays = days;
}

renderWatch();
setInterval(renderWatch, 1000);
