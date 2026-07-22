ASTROSEARCH
this is a web search using nasa picture of the day displaying the image it gives as the background, i liked how to brave new tab looked so i took inpiration.
i used vite, html, css and js

It features a daily background fetched from the nasa apod ( astronomy picture of the day)
a search thing where it deafults as brave browser but you can pick google, bing, duckduckgoose, ecosia, qwant or startpage
and im feeling lucky if you are feeling really lucky!!!!!!!!
iss locaiton to see the longitude and latitude which updates every 5 seconds
a moon phase thing where it shows what phase the moon is
a next launch shower where it shows the upcoming rocket launch name, time and pad
astronomy news, news lines about astronomy where it shows one line and then you can click view all to view all
a settings panel to turn the widgets on or off
a live clock to see the time

## Setup

Clone the repo and install dependencies:
```shell
npm install
```

Get a free NASA API key from https://api.nasa.gov/`

Create a `.env` file in the project root:

VITE_NASA_API_KEY=your_actual_key_here


Start the dev server:
```shell
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Deploy your own copy

1. Push this repo to GitHub
2. Add your NASA API key as a repo secret named `VITE_NASA_API_KEY`
   (Settings → Secrets and variables → Actions)
3. Enable GitHub Pages with source set to "GitHub Actions" (Settings → Pages)
4. Push to `main` — the site builds and deploys automatically

## Notes

- Search engine logos live in `public/` and are referenced with plain
  relative paths.
- Widget visibility preferences and chosen search engine persist across
  visits via `localStorage`.
- Mars weather was intentionally left out — NASA's InSight lander (the data
  source) has been inactive since late 2022, so that data would be
  frozen/historical rather than live.


  credits
NASA APOD API — https://api.nasa.gov/
wheretheiss.at — https://wheretheiss.at/
Launch Library 2 (The Space Devs) — https://thespacedevs.com/llapi
Spaceflight News API — https://spaceflightnewsapi.net/
Rubik Maze font — https://fonts.google.com/specimen/Rubik+Maze
Monoton font — https://fonts.google.com/specimen/Monoton
Brave — https://brave.com/
Google — https://www.google.com/
Bing — https://www.bing.com/
DuckDuckGo — https://duckduckgo.com/
Ecosia — https://www.ecosia.org/
Qwant — https://www.qwant.com/
Startpage — https://www.startpage.com/
