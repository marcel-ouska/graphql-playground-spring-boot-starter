const proxy = require("http-proxy-middleware");
const settings = require("./settings.json");

module.exports = app => {
    app.use(
        '/graphql',
        proxy({
            target: "http://localhost:40000/graphql",
            changeOrigin: true
        })
    );
};