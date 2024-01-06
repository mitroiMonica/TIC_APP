import { createVuetify } from "vuetify";

import "vuetify/styles";
import colors from "vuetify/util/colors";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.teal.base,
          secondary: colors.teal.darken4,
        },
      },
    },
  },
  components,
  directives,
});
