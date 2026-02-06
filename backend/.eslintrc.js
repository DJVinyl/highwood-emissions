/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/warnings",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          ["builtin"],
          ["external"],
          ["parent", "internal", "sibling", "index", "unknown"],
        ],
      },
    ],
  },
};
