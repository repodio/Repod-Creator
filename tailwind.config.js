module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: ["12px", "16px"],
      sm: ["13px", "24px"],
      base: ["15px", "24px"],
      lg: ["18px", "28px"],
      xl: ["22px", "32px"],
      "2xl": ["26px", "32px"],
      "3xl": ["30px", "40px"],
    },
    fontFamily: {
      sans: ["CircularStd"],
    },
    extend: {
      colors: {
        "repod-green": "#40E1A9",
        "repod-canvas": "#FFFFFF",
        "repod-canvas-secondary": "#D8D8D8",
        "repod-text-primary": "#222B45",
        "repod-text-secondary": "#8F9BB3",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
