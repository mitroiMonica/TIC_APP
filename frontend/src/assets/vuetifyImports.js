import { createVuetify } from "vuetify";

import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#322659",
          secondary: "#B794F4",
          ternary: "#FAF5FF",
        },
      },
    },
  },
  components,
  directives,
});
