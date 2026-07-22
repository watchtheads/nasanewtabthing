import './style.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

// ---------- APOD as background ----------
fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    if (data.media_type === "image") {
      document.body.style.backgroundImage = `url(${data.url})`;
    }
    document.querySelector("#apod-caption").innerHTML = `<p>${data.title}</p>`;
  })
  .catch(err => {
    document.querySelector("#apod-caption").innerHTML = `<p>Error: ${err.message}</p>`;
  });

// ---------- Clock ----------
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.querySelector("#clock").textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 1000);

// ---------- Search bar with engine picker ----------
let currentEngine = localStorage.getItem("search-engine") || "https://search.brave.com/search?q=";

document.querySelector("#search-bar").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = e.target.value;
    window.location.href = `${currentEngine}${encodeURIComponent(query)}`;
  }
});

const engineBtn = document.querySelector("#engine-btn");
const engineDropdown = document.querySelector("#engine-dropdown");

engineBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  engineDropdown.classList.toggle("hidden");
});

document.querySelectorAll(".engine-option").forEach(option => {
  option.addEventListener("click", () => {
    currentEngine = option.dataset.url;
    localStorage.setItem("search-engine", currentEngine);
    engineBtn.innerHTML = `<img src="${option.dataset.icon}" alt="engine" />`;
    engineDropdown.classList.add("hidden");
  });
});

document.addEventListener("click", (e) => {
  if (!engineDropdown.contains(e.target) && e.target !== engineBtn) {
    engineDropdown.classList.add("hidden");
  }
});

// ---------- Settings panel ----------
const settingsBtn = document.querySelector("#settings-btn");
const settingsPanel = document.querySelector("#settings-panel");
const closeSettings = document.querySelector("#close-settings");

function openSettings() {
  settingsPanel.classList.remove("hidden");
}
function closeSettingsPanel() {
  settingsPanel.classList.add("hidden");
}

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  openSettings();
});

closeSettings.addEventListener("click", (e) => {
  e.stopPropagation();
  closeSettingsPanel();
});

document.addEventListener("click", (e) => {
  if (!settingsPanel.classList.contains("hidden") &&
      !settingsPanel.contains(e.target) &&
      e.target !== settingsBtn) {
    closeSettingsPanel();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSettingsPanel();
});

const toggles = {
  iss: document.querySelector("#toggle-iss"),
  moon: document.querySelector("#toggle-moon"),
  launch: document.querySelector("#toggle-launch"),
  news: document.querySelector("#toggle-news"),
};

Object.keys(toggles).forEach(key => {
  const saved = localStorage.getItem(`widget-${key}`);
  toggles[key].checked = saved === null ? true : saved === "true";
});

Object.keys(toggles).forEach(key => {
  toggles[key].addEventListener("change", () => {
    localStorage.setItem(`widget-${key}`, toggles[key].checked);
    renderWidgets();
  });
});

// ---------- Widgets ----------
function getMoonPhase() {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.53058867;
  const now = new Date();
  const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = (daysSince % lunarCycle) / lunarCycle;
  const phases = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
  return phases[Math.floor(phase * 8) % 8];
}

let latestNewsData = [];

function renderWidgets() {
  const left = document.querySelector("#widget-left");
  const center = document.querySelector("#widget-center");
  const right = document.querySelector("#widget-right");
  left.innerHTML = "";
  center.innerHTML = "";
  right.innerHTML = "";

  if (toggles.iss.checked || toggles.moon.checked) {
    left.innerHTML = `
      <div class="widget">
        ${toggles.iss.checked ? `<div id="iss-row"><h3>ISS Location</h3><p>Loading...</p></div>` : ""}
        ${toggles.iss.checked && toggles.moon.checked ? `<hr>` : ""}
        ${toggles.moon.checked ? `<div id="moon-row"><h3>Moon Phase</h3><p>Loading...</p></div>` : ""}
      </div>
    `;
  }

  if (toggles.news.checked) {
    center.innerHTML = `
      <div class="widget" id="widget-news">
        <h3>Astronomy News</h3>
        <p id="news-headline">Loading...</p>
        <button id="view-all-news">View all</button>
      </div>
    `;
  }

  if (toggles.launch.checked) {
    right.innerHTML = `<div class="widget" id="widget-launch"><h3>Next Launch</h3><p>Loading...</p></div>`;
  }

  if (toggles.iss.checked) loadISS();
  if (toggles.moon.checked) loadMoon();
  if (toggles.launch.checked) loadNextLaunch();
  if (toggles.news.checked) loadNews();
}

function loadISS() {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(response => response.json())
    .then(data => {
      const el = document.querySelector("#iss-row");
      if (el) el.innerHTML = `<h3>ISS Location</h3><p>Lat: ${data.latitude.toFixed(4)}, Lon: ${data.longitude.toFixed(4)}</p>`;
    })
    .catch(err => {
      const el = document.querySelector("#iss-row");
      if (el) el.innerHTML = `<h3>ISS Location</h3><p>Error: ${err.message}</p>`;
    });
}


function loadMoon() {
  const el = document.querySelector("#moon-row");
  if (el) el.innerHTML = `<h3>Moon Phase</h3><p>${getMoonPhase()}</p>`;
}

function loadNextLaunch() {
  fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1')
    .then(response => response.json())
    .then(data => {
      const launch = data.results[0];
      const date = new Date(launch.net).toLocaleString();
      const el = document.querySelector("#widget-launch");
      if (el) el.innerHTML = `<h3>Next Launch</h3><p>${launch.name}</p><p>${date}</p><p>${launch.pad.name}, ${launch.pad.location.name}</p>`;
    })
    .catch(err => {
      const el = document.querySelector("#widget-launch");
      if (el) el.innerHTML = `<h3>Next Launch</h3><p>Error: ${err.message}</p>`;
    });
}

function loadNews() {
  fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=5')
    .then(response => response.json())
    .then(data => {
      latestNewsData = data.results;
      const headlineEl = document.querySelector("#news-headline");
      if (headlineEl) {
        headlineEl.innerHTML = `<a href="${latestNewsData[0].url}" target="_blank">${latestNewsData[0].title}</a>`;
      }
    })
    .catch(err => {
      const headlineEl = document.querySelector("#news-headline");
      if (headlineEl) headlineEl.innerHTML = `Error: ${err.message}`;
    });
}

document.addEventListener("click", (e) => {
  if (e.target.id === "view-all-news") {
    const list = document.querySelector("#news-modal-list");
    list.innerHTML = latestNewsData.map(a => `<li><a href="${a.url}" target="_blank">${a.title}</a></li>`).join('');
    document.querySelector("#news-modal").classList.remove("hidden");
  }
  if (e.target.id === "close-news-modal") {
    document.querySelector("#news-modal").classList.add("hidden");
  }
});

renderWidgets();
setInterval(() => { if (toggles.iss.checked) loadISS(); }, 5000);
document.querySelector("#search-bar-wrapper").addEventListener("click", (e) => {
  if (e.target.id !== "engine-btn" && !e.target.closest("#engine-btn")) {
    document.querySelector("#search-bar").focus();
  }
});