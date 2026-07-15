# Pomodoro Timer Chrome Extension
> A modern, drift-free Pomodoro Timer Chrome Extension built with **React, TypeScript, Bun, Vite**, and **Manifest V3**.

## What is a pomodoro?

> The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are named _pomodoros_.
>
> &mdash; <cite>
  <a href="https://en.wikipedia.org/w/index.php?title=Pomodoro_Technique&amp;oldid=774754409" title="Pomodoro Technique. (2017, April 10). In Wikipedia, The Free Encyclopedia. Retrieved 05:41, May 4, 2017">Pomodoro Technique, Wikipedia</a>
</cite>

>Pomodoro ™ and Pomodoro Technique ® are registered trademarks of Francesco Cirillo. This app is not affiliated with Francesco Cirillo.

### Technology Stack
- **React** & **TypeScript**
- **Bun** & **Vite** for blazing fast builds
- **Chrome Extension Manifest V3** (Service Workers for background timing)
- **Vanilla CSS Custom Properties** (No external UI libraries)

### Features of the application
- **Drift-Free Timer:** Powered by `chrome.alarms` in a background service worker to ensure accurate timing even when the tab is inactive.
- **Settings Panel:** Fully customizable work, short break, and long break durations.
- **Audio Notifications:** Distinct sound alerts for starting breaks and returning to work.
- **Responsive Design:** Clean and modern interface that works perfectly as a full browser tab.
- **Dynamic Color Transitions:** UI accent colors adapt smoothly based on the active timer phase.
- **Light / Dark Theme:** Persists to your Chrome storage preferences.

## Getting Started

### Installation & Build

1. Clone the repository and install dependencies using [Bun](https://bun.sh/):
```bash
bun install
```

2. Build the extension for production:
```bash
bun run build
```

3. **Load into Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked** and select the `dist/` directory from this project.

### Development

To start the Vite development server with HMR for the extension:
```bash
bun run dev
```

## Preview

![Pomodoro](https://github.com/frekans7/pomodoro-timer/blob/master/screenshot/pomodoro.gif)

![Notifications](https://github.com/frekans7/pomodoro-timer/blob/master/screenshot/notifications.png)

## License

**[MIT](LICENSE)** Licensed
