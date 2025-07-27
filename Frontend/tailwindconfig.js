
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
    // Add paths to all of your components that use Tailwind classes
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          // Using a light theme from DaisyUI as a base
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "primary": "#f59e0b", // Amber 500
          "primary-focus": "#d97706", // Amber 600
          "primary-content": "#ffffff", // White text on primary buttons
          "base-100": "#f9fafb", // A very light gray for the main background
          "base-200": "#f3f4f6", // A slightly darker gray
          "base-300": "#e5e7eb",
          "error": "#ef4444", // Red for error messages
        },
      },
      {
        dark: {
          // Using your login page colors as inspiration for a cohesive dark theme
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": "#facc15", // Yellow 400 (matches your login button)
          "primary-focus": "#eab308", // Yellow 500
          "primary-content": "#1e293b", // Dark text for high contrast on yellow buttons
          "base-100": "#0a0a0a", // Matches your login page background
          "base-200": "#1a1a1a", // Matches your login page form background
          "base-300": "#2a2a2a",
          "error": "#f87171", // A lighter red for dark mode
        },
      },
    ],
  },
};