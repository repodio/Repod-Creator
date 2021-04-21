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
        "repod-tint": "#40E1A9",
        "repod-canvas": "#FFFFFF",
        "repod-canvas-secondary": "#D8D8D8",
        "repod-text-primary": "#222B45",
        "repod-text-secondary": "#8F9BB3",
        "repod-text-alternative": "#FFFFFF",
        facebook: "#4267B2",
        twitter: "#1DA1F2",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
