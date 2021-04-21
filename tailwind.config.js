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
    minWidth: {
      "1/2": "50%",
      full: "100%",
    },

    extend: {
      colors: {
        "repod-tint": "#14D08E",
        "repod-tint2": "#F75B7B",
        "repod-canvas": "#FFFFFF",
        "repod-canvas-secondary": "#D8D8D8",
        "repod-text-primary": "#222B45",
        "repod-text-secondary": "#8F9BB3",
        "repod-text-alternative": "#FFFFFF",
        danger: "#FF5F5F",
        warning: "#FFAA00",
        info: "#0095FF",
        success: "#14D08E",
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
