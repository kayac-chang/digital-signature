import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/extend-expect";

import crypto from "crypto";

installGlobals();

Object.defineProperty(global.self, "crypto", {
  value: {
    subtle: crypto.webcrypto.subtle,
  },
});
