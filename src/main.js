import './style.css';
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
document.querySelector("#app").innerHTML = "<p>loading...</p>";
fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
.then(response => response.json())
.then(data => {
  let media;

  if (data.media_type === "image") {
    media = `<img src="${data.url}"/>`;
  } else {
    media = `<video src="${data.url}" controls></video>`;
  }

  document.querySelector("#app").innerHTML = `
    <h1>${data.title}</h1>
    ${media}
    <p>${data.explanation}</p>
  `;
})
.catch(err => {
  document.querySelector("#app").innerHTML = `<p>Error: ${err.message}</p>`;
});
function loadISS() {
  fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(data => {
      const lat = data.iss_position.latitude;
      const lon = data.iss_position.longitude;
      document.querySelector("#iss").innerHTML = `
        <h2>ISS Location</h2>
        <p>Lat: ${lat}, Lon: ${lon}</p>
      `;
    })
    .catch(err => {
      document.querySelector("#iss").innerHTML = `<p>ISS Error: ${err.message}</p>`;
    });
}
loadISS();
setInterval(loadISS, 5000);
function getMoonPhase() {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.53058867; // days
  const now = new Date();
  const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = (daysSince % lunarCycle) / lunarCycle;

  const phases = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
  ];
  const index = Math.floor(phase * 8) % 8;
  return phases[index];
}

function loadMoon() {
  document.querySelector("#moon").innerHTML = `
    <h2>Moon Phase</h2>
    <p>${getMoonPhase()}</p>
  `;
}
loadMoon();
function loadNextLaunch() {
  fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1')
    .then(response => response.json())
    .then(data => {
      const launch = data.results[0];
      const name = launch.name;
      const date = new Date(launch.net).toLocaleString();
      const pad = launch.pad.name;
      const location = launch.pad.location.name;

      document.querySelector("#launch").innerHTML = `
        <h2>Next Launch</h2>
        <p>${name}</p>
        <p>${date}</p>
        <p>${pad}, ${location}</p>
      `;
    })
    .catch(err => {
      document.querySelector("#launch").innerHTML = `<p>Launch Error: ${err.message}</p>`;
    });
}
loadNextLaunch();