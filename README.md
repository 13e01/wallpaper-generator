<p align="center">
  <img src="favicon.png" width="80" alt="Live Wallpaper Generator icon">
</p>

<h1 align="center">Live Wallpaper Generator</h1>

<p align="center"><i>A little canvas that never stops moving.</i></p>

<p align="center">
  <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg" alt="HTML5" title="HTML5" width="36" height="36" /></a>
  <a href="https://www.w3.org/TR/CSS/#css" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/css3-colored.svg" alt="CSS3" title="CSS3" width="36" height="36" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" alt="JavaScript" title="JavaScript" width="36" height="36" /></a>
</p>

---

Finding a good wallpaper is a surprisingly annoying problem. The ones I actually like are simple — a black screen, white dots blinking in their own rhythm, maybe a gradient running through them, maybe shapes forming out of the noise. That's it. But almost nobody makes those, and searching for them online mostly turns up nothing close.

So instead of looking any longer, I decided to just generate them myself. This is that: a small tool that draws these patterns in the browser and lets you export whatever you land on, either as a PNG or as an MP4/WebM loop. No frameworks, no build step, no dependencies — just HTML5 Canvas, some math, and a lot of tweaking until the motion felt right.

**[Try it live](https://13e01.github.io/wallpaper-generator/)**

## What it does

You start by choosing how elements are placed on the canvas:

- **Grid** — a clean, even distribution with a set spacing.
- **Drone Show** — wave patterns that ripple outward, horizontally, radially, or diagonally.
- **Chaotic** — a fixed number of points scattered at random.

Then you decide how they move:

- **Static** — no motion, just a fixed pattern.
- **Flicker** — opacity fades in and out gently.
- **Drift** — a slow, circular wobble.
- **Fly** — elements travel across the canvas and wrap around the edges (any direction, or diagonally).
- **Trails** — a motion-blur effect that leaves fading streaks behind.

From there you can play with colors (background and elements, in HEX or RGB), shapes (circles, squares, diamonds), size, wave width, and speed until it looks like something worth keeping.

## Exporting

Once you land on something you like, you can save it:

- As a **PNG** snapshot of the current frame.
- As a **looping video** (4, 6, or 8 seconds), recorded straight in the browser through the MediaRecorder API.
- In resolutions from screen size up to 4K, with a bitrate you can dial between 5 and 50 Mbps.
- In WebM or MP4.

## Under the hood

Just HTML5 (Canvas API, MediaRecorder API), CSS3, and vanilla JavaScript (ES6+). No libraries, no dependencies, no build tools — clone it and open the file.

```bash
git clone https://github.com/13e01/wallpaper-generator.git
cd wallpaper-generator
```

Open `index.html` in any modern browser and you're in.

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
