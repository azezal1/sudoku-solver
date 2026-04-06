# ⚡ Sudoku Solver Pro

A premium AI-powered Sudoku solver with real-time backtracking visualization, built with React and Vite.

## 🚀 Features

- **AI Backtracking Algorithm** - Watch the solver work in real-time
- **Interactive Visualization** - See each step and backtrack with animations
- **Sound Effects** - Web Audio API powered sound feedback
- **Dark Mode** - Toggle between light and dark themes
- **Difficulty Levels** - Easy, Medium, and Hard puzzle generation
- **Real-time Stats** - Track steps, backtracks, and solving time
- **Speed Control** - Adjust visualization speed with slider
- **Input Validation** - Real-time validation of user inputs
- **Confetti Celebration** - Animated confetti when puzzle is solved

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Lightning-fast dev server and build tool
- **Web Audio API** - Sound effects
- **CSS3** - Modern animations and styling
- **Vanilla JavaScript** - Core algorithm implementation

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

1. **Generate Puzzle** - Click "Generate Puzzle" to create a random puzzle
2. **Manual Input** - Enter numbers (1-9) directly into cells
3. **Select Difficulty** - Choose Easy, Medium, or Hard before generating
4. **Solve** - Click "Solve" to watch the AI solve the puzzle
5. **Adjust Speed** - Use the speed slider to control visualization speed
6. **Toggle Sound** - Enable/disable sound effects
7. **Dark Mode** - Click the moon/sun icon to toggle theme
8. **Clear** - Reset the board at any time

## 🧠 Algorithm

The solver uses a **Constraint Satisfaction Problem (CSP)** approach with backtracking:

1. Find an empty cell
2. Try numbers 1-9
3. Check if number is valid (row, column, 3x3 box)
4. If valid, place number and recurse
5. If no solution found, backtrack and try next number
6. Repeat until solved or all possibilities exhausted

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── Particles.jsx       # Animated background particles
│   ├── utils/
│   │   ├── SoundEngine.js      # Web Audio API sound effects
│   │   └── confetti.js         # Confetti animation
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## 🎨 Design Philosophy

- Clean, minimal, professional interface
- Calm color palette with subtle animations
- Proper spacing and alignment
- Smooth transitions (150ms)
- Accessibility-friendly
- Responsive design

## 🔊 Sound Effects

- **Click** - Button interactions
- **Step** - Each number placement
- **Backtrack** - When algorithm backtracks
- **Success** - Puzzle solved melody
- **Error** - Invalid board detection

## 📊 Stats Tracking

- **Steps** - Total numbers placed
- **Backtracks** - Times algorithm backtracked
- **Time** - Solving duration in seconds

## 🌙 Dark Mode

Toggle between light and dark themes with smooth transitions. Theme preference is applied instantly across all components.

## 🎯 Difficulty Levels

- **Easy** - 35 cells removed (~46 given)
- **Medium** - 45 cells removed (~36 given)
- **Hard** - 55 cells removed (~26 given)

## 🐛 Known Issues

None! The app is fully functional and error-free.

## 📝 License

MIT License - Feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Built with ❤️ using React, Vite, and Web Audio API
