# Loop Maker -- AVT Beleg Projekt

## Table of Contents

- [Loop Maker -- AVT Beleg Projekt](#loop-maker----avt-beleg-projekt)
  - [Features](#features)
    - [A grid where you can play a bunch of notes](#a-grid-where-you-can-play-a-bunch-of-notes)
    - [Grid Settings](#grid-settings)
    - [Multiple Instruments](#multiple-instruments)
    - [Multiple Tracks](#multiple-tracks)
      - [Technical challenge](#technical-challenge)
    - [Overlay](#overlay)
  - [Usage](#usage)
    - [Trying out the app on a live environment](#trying-out-the-app-on-a-live-environment)
    - [Running on your local machine](#running-on-your-local-machine)
  - [Idea](#idea)
  - [Implementation Details](#implementation-details)
    - [Used technologies](#used-technologies)
  - [Samples](#samples)

## Features

### A grid where you can play a bunch of notes

![Grid Item](https://raw.githubusercontent.com/LouisAndrew/loop-maker/main/docs/images/GridItem_filled.png)

<!-- TODO: Add description here -->

### Grid Settings

![Grid Settings](https://raw.githubusercontent.com/LouisAndrew/loop-maker/main/docs/images/GridSettings.png)

<!-- TODO: Add description (Looping, BPM, Grid Length) -->

### Multiple Instruments

![Instruments](https://raw.githubusercontent.com/LouisAndrew/loop-maker/main/docs/images/Instruments.png)

<!-- TODO: Add description about multiple instruments -->

### Multiple Tracks

This is the core feature of the whole application, that multiple tracks / grids can be played simultaneously, even when they have a different instrument. What's important for this feature is that we set the grid length and the BPM to be a global variable, so that there's no track that would stop earlier in comparison to the others.
![Multiple Tracks](https://raw.githubusercontent.com/LouisAndrew/loop-maker/main/docs/images/MutliTracks.png)

### Technical challenge

One technical challenge that we faced here is that since we're loading the tone samples from a remote source, there are some cases where some of the tracks would play even though the samples for the other tracks haven't been completely loaded yet. To solve this issue, we wait until all of the players are ready by keeping track of its state in a variable and only than can a playback begin.

### Overlay

We also implemented an Overlay component that could show the progress of the current playback. The overlay also prevents the data of the notes to be changed during playback. A `Cancel` button is also provided within the overlay to stop the current playback.
![Overlay](https://raw.githubusercontent.com/LouisAndrew/loop-maker/main/docs/images/Overlay.png)

## Usage

### Trying out the app on a live environment

To try out the application on a live environment, please visit our [Demo site](https://louisandrew.github.io/loop-maker/).

### Running on your local machine

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

Main idea of the project is to build a simplified version of [Garageband](https://www.apple.com/mac/garageband/) or any other similar audio editing program. The main focus of the project is to build a tool to create music [loops](<https://en.wikipedia.org/wiki/Loop_(music)#:~:text=In%20electroacoustic%20pop%2C%20rock%2C%20and,repeated%20to%20create%20ostinato%20patterns.&text=The%20feature%20to%20loop%20a,vendors%20as%20A%E2%80%93B%20repeat.>). The loop can be created from multiple track items and an instrument can be assigned to each track items, enabling the loop to be created out of multiple instruments. There are up to 5 tracks, which basically are just a grid. Every grid item represents a musical note, and we can click on a grid item to play a tone on a specific note.

There's also a possibility of customisation on the _[time signatures](https://www.skoove.com/blog/time-signatures-explained/)_ and the global [BPM](https://de.wikipedia.org/wiki/Beats_per_minute) of the loop.

## Implementation Details

The engine behind the app would be [Tone.js](https://tonejs.github.io/), which provides everything that are needed for the project (playing a tone on a specific note, timing of the note, etc). The application is built on top of [React](https://reactjs.org/) framework. For the design work, we use Figma to help us visualise the end result of the project before implementing it (**Figma Link:** [https://www.figma.com/file/jLdyD7890HfHJuNuXDbcTl/AVT?node-id=0%3A](https://www.figma.com/file/jLdyD7890HfHJuNuXDbcTl/AVT?node-id=0%3A1))

### Used technologies

- [React](https://reactjs.org/)
- [Tone.js](https://tonejs.github.io/)
- [Material UI](https://mui.com/)

## Samples

All of the samples are taken from this [repository](https://github.com/nbrosowsky/tonejs-instruments).
