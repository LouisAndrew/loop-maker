# Loop Maker -- AVT Beleg Projekt

## Table of contents
- [Loop Maker -- AVT Beleg Projekt](#loop-maker----avt-beleg-projekt)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
  - [Idea](#idea)
  - [Implementation Details](#implementation-details)
## Usage
Prerequisites
- NPM and node is installed ([installing node](https://nodejs.dev/learn/how-to-install-nodejs))

Install required packages
```
npm install
```

Start the project
```
npm start
```

## Idea

Main idea of the project is to build a simplified version of [Garageband](https://www.apple.com/mac/garageband/) or any other similar audio editing program. The main focus of the project is to build a tool to create music [loops](https://en.wikipedia.org/wiki/Loop_(music)#:~:text=In%20electroacoustic%20pop%2C%20rock%2C%20and,repeated%20to%20create%20ostinato%20patterns.&text=The%20feature%20to%20loop%20a,vendors%20as%20A%E2%80%93B%20repeat.). The loop can be created from multiple track items and an instrument can be assigned to each track items, enabling the loop to be created out of multiple instruments. There are up to 5 tracks, which basically are just a grid. Every grid item represents a musical note, and we can click on a grid item to play a tone on a specific note. 

There's also a possibility of customisation on the *[time signatures](https://www.skoove.com/blog/time-signatures-explained/)* and the global [BPM](https://de.wikipedia.org/wiki/Beats_per_minute) of the loop.

## Implementation Details

The engine behind the app would be `[Tone.js](https://www.notion.so/AVT-Project-README-b1e080ebe8334461b8d602feabca0d89)`, which provides everything that are needed for the project (playing a tone on a specific note, timing of the note, etc). The application is built on top of `[React](https://reactjs.org/)` framework. For the design work, we use Figma to help us visualise the end result of the project before implementing it (**Figma Link:** [https://www.figma.com/file/jLdyD7890HfHJuNuXDbcTl/AVT?node-id=0%3A](https://www.figma.com/file/jLdyD7890HfHJuNuXDbcTl/AVT?node-id=0%3A1))