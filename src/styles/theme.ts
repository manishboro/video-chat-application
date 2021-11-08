import { createTheme } from "@mui/material/styles";

/*
0 - 600px:      Phone
600 - 900px:    Tablet portrait
900 - 1200px:   Tablet landscape
[1200 - 1800] is where our normal styles apply
1800px + :      Big desktop

ORDER: Base + typography > general layout + grid > page layout > components
1em = 16px
*/

// Create a theme instance.
let theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
       body {
         background-color: #dcdcdc;
       }
     `,
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 960, lg: 1330, xl: 1920 },
  },
});

// theme = responsiveFontSizes(theme);

export default theme;
