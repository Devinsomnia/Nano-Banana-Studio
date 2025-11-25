# 🍌 Nano Banana Studio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-8E75B2?logo=google&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)

> **Prompt, Generate, Edit.**  
> Unleash the power of **Gemini 2.5 Flash Image** ("Nano Banana") to generate complex engineering diagrams or artistic masterpieces and edit them with natural language.

---

## 🖥️ Application View

<p align="center">
  <img src="https://github.com/Devinsomnia/Nano-Banana-Studio/blob/main/images/AppView.png?raw=true" alt="Nano Banana Studio Application View" width="100%">
</p>

---

## 🎨 Samples

Here are some examples of what Nano Banana Studio can create:

| | |
|:---:|:---:|
| <img src="https://github.com/Devinsomnia/Nano-Banana-Studio/blob/main/images/NVIDIADGXServer.png?raw=true" width="400" /> | <img src="https://github.com/Devinsomnia/Nano-Banana-Studio/blob/main/images/DGXSpark.png?raw=true" width="400" /> |
| **NVIDIA DGX Server**  | **DGX SPARK Diagram** |
|  <img src="https://github.com/Devinsomnia/Nano-Banana-Studio/blob/main/images/RTXPRO6000.png?raw=true" width="400" /> | <img src="https://github.com/Devinsomnia/Nano-Banana-Studio/blob/main/images/PorcheNineEleven.png?raw=true" width="400" /> |
| **RTX PRO 6000** | **Porsche 911 Exploded View** |


---

## ✨ Features

*   **⚡ Blazing Fast Generation**: Powered by the lightweight yet powerful `gemini-2.5-flash-image` model.
*   **🎨 Natural Language Editing**: Don't just generate—**iterate**. Ask the AI to *"Add a retro filter"*, *"Remove the background"*, or *"Turn this into a line drawing"*.
*   **🛠️ Engineering Focused**: Optimized defaults for generating exploded views, technical schematics, and cutaway diagrams.
*   **💾 History & Gallery**: Automatically saves your session history so you can compare iterations or revisit previous prompts.
*   **🌗 Sleek UI**: A modern, responsive, dark-themed interface built with **Tailwind CSS** and **React**.

## 🚀 Getting Started

Follow these steps to set up the Nano Banana Studio locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A **Google Cloud Project** with the Gemini API enabled.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Devinsomnia/Nano-Banana-Studio.git
    cd Nano-Banana-Studio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory (or configure your environment variables) and add your Google GenAI API key:
    ```env
    API_KEY=your_actual_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm start
    ```

## 🎮 How to Use

### 1. Generate Mode 🪄
Simply type a description of what you want to see in the input bar.
*   *Example:* "Generate exploded engineering diagram of NVIDIA DGX SPARK"
*   *Example:* "Cutaway view of a jet engine with technical labels"

### 2. Edit Mode ✏️
Once an image is generated (or uploaded), the input bar automatically switches to **Edit Mode**.
*   *Command:* "Make it look like a cyberpunk poster"
*   *Command:* "Remove the person in the background"
*   *Command:* "Change the color scheme to blueprint blue"

## 🛠️ Tech Stack

*   **Frontend**: React 19, Lucide React (Icons)
*   **Styling**: Tailwind CSS
*   **AI SDK**: Google GenAI SDK for Node/Web (`@google/genai`)
*   **Build Tool**: Parcel / Vite (depending on your setup)

## 🤝 Contributing

Contributions are welcome! If you have ideas for better prompt engineering, UI improvements, or new features:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Devinsomnia">Devinsomnia</a>
</p>
