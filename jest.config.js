const path = require("path");

module.exports = {
    testEnvironment: "node",

    modulePaths: [path.join(__dirname, "src")],

    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },

    testPathIgnorePatterns: ["/node_modules/", "/lib/"],

    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"]
};
