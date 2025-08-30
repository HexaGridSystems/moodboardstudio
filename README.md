# Moodboard Studio for Indian Weddings

A web application for creating moodboards specifically designed for Indian weddings. Features a central canvas for arranging elements, a floating AI chat interface for assistance, and a right-side configuration panel for customizing wedding aspects.

## Features

- **Central Canvas**: Drag and drop elements to design your wedding moodboard
- **AI Chat Interface**: Floating chat to get AI-powered suggestions for wedding ideas
- **Configuration Panel**: Customize colors, elements, and themes for Indian weddings
- **Real-time Updates**: See changes instantly with hot module replacement

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Canvas.tsx       # Main canvas component
│   ├── ConfigPanel.tsx  # Right-side configuration panel
│   └── Chat.tsx         # Floating AI chat interface
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Technologies Used

- React 19
- TypeScript
- Vite
- ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
