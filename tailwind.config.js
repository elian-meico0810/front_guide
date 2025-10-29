/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:"selector",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        principal: 'var(--principal)',
        secundario: 'var(--secundario)',
        azulprincipal: 'var(--azulprincipal)'
      }
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".checkbox-toggle-wrapper": {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
        },
        ".checkbox-toggle": {
          width: "3rem",
          height: "1.5rem",
          backgroundColor: "rgb(229, 231, 235)",
          borderRadius: "9999px",
          position: "relative",
          transition: "background-color 0.3s ease-in-out",
        },
        ".checkbox-toggle::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "2px",
          width: "1.25rem",
          height: "1.25rem",
          backgroundColor: "#ffffff",
          borderRadius: "9999px",
          transform: "translateY(-50%)",
          transition: "transform 0.3s ease-in-out",
        },
        ".peer:checked + .checkbox-toggle": {
          backgroundColor: "rgb(37, 99, 235)",
        },
        ".peer:checked + .checkbox-toggle::after": {
          transform: "translateY(-50%) translateX(1.5rem)",
        },
      });
    },
  ],
  safelist: ["rounded-t-lg","pr-3","first","rounded-b-lg","last","border-zinc-800", "lg", "md", "sm", "h-screen", "rounded-md"],
}

