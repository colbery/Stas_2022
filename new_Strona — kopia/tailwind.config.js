/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./css/*.css", "./js/*.js", "./views/*.ejs"],
  darkMode: "class",
  theme: {
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px",
      "6xl": "60px",
      "7xl": "72px",
    },
    letterSpacing: {
      thewidest: ".1em",
    },
    extend: {
      colors: {
        goldish: "#FFD600",
        blueish: "#228be6",
        // goldish: "#01c7e4",
        darkishh: "#141414",
        darkish: "#222222",
        grayish: "#333333",
        midGray: "#666",
        whitish: "#ddd",
        blackish: "#1b1b1b",
      },
      fontFamily: {
        sans: ["Staatliches", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
      },
      backgroundImage: (theme) => ({
        bgW: "url('../images/whitemode/bgW4.webp')",
        globeW: "url('../images/whitemode/globeW.png')",
        heartW: "url('../images/whitemode/heartW.png')",
        likeW: "url('../images/whitemode/likeW.png')",
        printerW: "url('../images/whitemode/printerW.png')",
        scissorsW: "url('../images/whitemode/scissorsW.png')",
        smileW: "url('../images/whitemode/smileW.png')",
        sunW: "url('../images/whitemode/sunW.png')",

        bgD: "url('../images/darkmode/bgD.webp')",
        globeD: "url('../images/darkmode/globeD.png')",
        heartD: "url('../images/darkmode/heartD.png')",
        likeD: "url('../images/darkmode/likeD.png')",
        printerD: "url('../images/darkmode/printerD.png')",
        scissorsD: "url('../images/darkmode/scissorsD.png')",
        smileD: "url('../images/darkmode/smileD.png')",
        sunD: "url('../images/darkmode/sunD.png')",
        bgG: "url('../images/img/blury.svg')",
      }),
      dropShadow: {
        black: "2px 0px 2px rgba(0, 0, 0, 0.5)",
        white: "0 2px 0px rgba(1, 1, 1, 1)",
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ["dark"],
    },
  },
  plugins: [],
};
