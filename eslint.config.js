
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import stylistic from "@stylistic/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,ts,tsx}"]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      }
    },
    plugins: {
      "@stylistic": stylistic,
      "react-hooks": pluginReactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "no-var": "error",
      "no-console": [ "error", {
        allow: [ "warn", "error", "info" ]
      }],
      "no-alert": "error",
      "no-lone-blocks": "error",
      "no-template-curly-in-string": "error",
      "no-script-url": "error",
      radix: "error",
      eqeqeq: [ "error", "always" ],
      yoda: [ "error", "never", {
        exceptRange: true
      }],
      curly: "error",
      "default-case": [ "error", {
        commentPattern: "^skip\\sdefault"
      }],
      "react/prop-types": "off",
      "react/jsx-no-bind": [ "warn", {
        allowArrowFunctions: true,
        allowBind: false,
        allowFunctions: false
      }],
      "prefer-destructuring": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      "no-duplicate-imports": [ "error", {
        includeExports: true
      }],
      "no-empty-function": [ "error", {
        allow: ["arrowFunctions"]
      }],
      "no-eq-null": "error",
      "no-extra-bind": "error",
      "no-implicit-coercion": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-useless-concat": "error",
      "no-warning-comments": [ "error", {
        terms: [ "fix", "fixme", "to be fixed", "hack" ],
        location: "anywhere"
      }],
      "id-length": [ "error", {
        properties: "never",
        min: 1,
        max: 49
      }],
      "no-unused-vars": "off",
      "no-restricted-imports": [ "error", {
        "patterns": [{
          "group": ["\\#/*"],
          "message": "Using just # as an alias of /src is not allowed. If you have a route like '#/features/', change it to '#features/'"
        }]
      }],
      "@typescript-eslint/no-unused-vars": [ "error", { "varsIgnorePattern": "React" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        { "selector": "enumMember", "format": ["UPPER_CASE"] },
        { "selector": "interface", "format": ["PascalCase"], "custom": { "regex": "^I[A-Z]", "match": true } },
        { "selector": "typeAlias", "format": ["PascalCase"], "custom": { "regex": "^T[A-Z]", "match": true } },
        { "selector": "enum", "format": ["PascalCase"], "custom": { "regex": "^E[A-Z]", "match": true } }
      ],
      "max-lines": [
        "error",
        {
          "max": 450,
          "skipBlankLines": true,
          "skipComments": true
        }
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      ...pluginReactHooks.configs.recommended.rules,
      "@stylistic/indent": [
        "error",
        2
      ],
      "@stylistic/linebreak-style": [
        "error",
        "unix"
      ],
      "@stylistic/quotes": [
        "error",
        "double"
      ],
      "@stylistic/semi": [
        "error",
        "always"
      ],
      "@stylistic/no-multiple-empty-lines": [
        "error",
        {
          "max": 1,
          "maxEOF": 1
        }
      ],
      "@stylistic/func-call-spacing": [
        "error",
        "never"
      ],
      "@stylistic/semi-spacing": [
        "error",
        {
          "before": false,
          "after": true
        }
      ],
      "@stylistic/comma-spacing": [
        "error",
        {
          "before": false,
          "after": true
        }
      ],
      "@stylistic/space-unary-ops": [
        "error",
        {
          "words": true,
          "nonwords": false
        }
      ],
      "@stylistic/space-infix-ops": [
        "error",
        {
          "int32Hint": false
        }
      ],
      "@stylistic/keyword-spacing": [
        "error",
        {
          "after": true,
          "overrides": {
            "do": {
              "after": false
            }
          }
        }
      ],
      "@stylistic/comma-style": [
        "error",
        "last",
        {
          "exceptions": {
            "ImportDeclaration": true
          }
        }
      ],
      "@stylistic/comma-dangle": [
        "error",
        "never"
      ],
      "@stylistic/operator-linebreak": [
        "error",
        "after",
        {
          "overrides": {
            "?": "ignore",
            ":": "ignore"
          }
        }
      ],
      "@stylistic/space-in-parens": [
        "error",
        "always",
        {
          "exceptions": [
            "()",
            "[]",
            "{}",
            "empty"
          ]
        }
      ],
      "@stylistic/object-curly-spacing": [
        "error",
        "always",
        {
          "objectsInObjects": true,
          "arraysInObjects": true
        }
      ],
      "@stylistic/array-bracket-spacing": [
        "error",
        "always",
        {
          "singleValue": false,
          "objectsInArrays": false
        }
      ],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/brace-style": [
        "error",
        "1tbs",
        {
          "allowSingleLine": false
        }
      ],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/semi-style": [
        "error",
        "last"
      ],

      "@stylistic/max-len": [
        "error",
        {
          "code": 160
        }
      ]
    }
  }
];
