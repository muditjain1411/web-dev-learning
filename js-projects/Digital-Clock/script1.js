const monthName = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const dayName = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const hr24 = {
  12: 12,
  13: 1,
  14: 2,
  15: 3,
  16: 4,
  17: 5,
  18: 6,
  19: 7,
  20: 8,
  21: 9,
  22: 10,
  23: 11,
  0: 12,
};
const container = document.querySelector(".container");
const time = document.getElementById("time");
const AmPm = document.getElementById("AmPm");
const dayOfWeek = document.getElementById("day");
const date = document.getElementById("date");
const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
];
var ind = Math.floor(Math.random() * images.length);
document.body.style.backgroundImage = `url(/images/${images[ind]})`;

// Clock update
setInterval(function () {
  var dNm = new Date().getDay();
  var day = new Date().getDate();
  var month = monthName[new Date().getMonth()];
  var year = new Date().getFullYear();
  var hour = new Date().getHours();
  var min = new Date().getMinutes();
  var sec = new Date().getSeconds();

  if (hour >= 12) {
    hour = hr24[hour];
    AmPm.textContent = "PM";
  } else {
    if (hour == 0) {
      hour = hr24[hour];
    }
    AmPm.textContent = "AM";
  }
  const paddedMin = min.toString().padStart(2, "0");
  const paddedSec = sec.toString().padStart(2, "0");
  time.textContent = `${hour}:${paddedMin}:${paddedSec}`;
  dayOfWeek.textContent = dayName[dNm];
  date.textContent = `${day}/${month}/${year}`;
}, 1000);
