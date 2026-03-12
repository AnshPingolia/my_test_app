# NodeShift Game 🌱

Welcome to **NodeShift**, a full-stack game application featuring a React frontend and a Python (Flask) backend!

I'm incredibly excited to share this project because **it marks my very first deployment!** 
It's been a challenging but incredibly rewarding learning experience. I've been able to bring together different technologies—connecting a web interface to a backend API—and finally see it all working together live. I still have a lot to learn, but I'm proud of this milestone and excited for what comes next!

---

## 🏗️ Project Architecture

- **Frontend**: Built with [React](https://reactjs.org/) to create an interactive and fluid grid-based user interface. I'm learning how components and state make Building UIs much more manageable.
- **Backend**: Powered by Python and [Flask](https://flask.palletsprojects.com/), providing the REST API endpoints and managing game states/leaderboards.

## 🚀 Getting Started Locally

If you'd like to poke around the code or run this project on your own machine, I'd love for you to try it out!

### 1. Set Up the Backend
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   
   # Or on Mac/Linux: 
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   *The server will run on `http://localhost:5000`.*

### 2. Set Up the Frontend
1. Open a new terminal and navigate to the root directory:
   ```bash
   cd test_app
   ```
2. Install the necessary Node modules:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The app should automatically open in your browser at `http://localhost:3000`.*

## 🌟 Features

- **Fluid UI**: Smooth tile animations and a dark-themed aesthetic.
- **RESTful API**: Python backend securely handling leaderboard submissions.
- **Cross-Origin Resource Sharing (CORS)**: Properly configured to allow seamless communication between the React app and Flask server.

---

*Thank you so much for checking out my first deployment project! I'm always looking to improve, so any feedback, tips, or suggestions are incredibly appreciated.*
