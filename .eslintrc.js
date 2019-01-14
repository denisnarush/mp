module.exports = {
    "env": {
        "browser": true,
        "mocha": true,
        "es6": true
    },
    "globals": {
        "chai": true,
        "expect": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};