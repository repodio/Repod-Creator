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
      "4xl": ["32px", "40px"],
      "5xl": ["36px", "48px"],
      "6xl": ["48px", "58px"],
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
        "repod-canvas-secondary": "#F7F9FC",
        "repod-canvas-auth-bg": "#D9FFD9",
        "repod-canvas-dark": "#111827",
        "repod-text-primary": "#222B45",
        "repod-text-secondary": "#8F9BB3",
        "repod-text-alternative": "#FFFFFF",
        "repod-text-disabled": "#8F9BB3",
        "repod-disabled-bg": "rgba(143, 155, 179, 0.24)",
        "repod-border-dark": "#2E3A59",
        "repod-border-light": "#E4E9F2",
        "repod-border-medium": "#C5CEE0",
        danger: "#FF5F5F",
        warning: "#FFAA00",
        info: "#0095FF",
        success: "#14D08E",
        facebook: "#4267B2",
        twitter: "#1DA1F2",

        "white-100": "rgba(255, 255, 255, 0.1)",

        "bg-warning": "rgba(255, 170, 0, 0.08)",
        "bg-info": "rgba(0, 149, 255, 0.08)",
        "badge-disabled": "rgba(143, 155, 179, 0.16)",
      },
      backgroundImage: (theme) => ({
        "auth-background": "url('/signInBackground.png')",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
