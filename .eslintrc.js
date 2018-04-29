module.exports = {
  "extends": [
    "standard",
    "prettier"
  ],
  "plugins": [
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error"
  },
  "globals": {
    "browser": true,
    "debug": true
  },
  "env": {
    "browser": true,
    "es6": true
  }
}