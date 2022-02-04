/*
 * BfVA
 */

const path = require("path");
const hapi = require("hapi");
const config = require("getconfig");
const templateEngine = require("./src/server/templates");
const routes = require("./src/server/routes");

const server = hapi.server({
  port: config.port,
  host: config.host,
  routes: {
    files: {
      relativeTo: path.join(__dirname, "assets/dest"),
    },
  },
  router: {
    stripTrailingSlash: true,
  },
});

const init = async () => {
  await server.register(require("inert"));
  await server.register(require("vision"));
  await server.register(require("scooter"));

  server.views({
    engines: {
      jsx: templateEngine,
    },
    path: path.join(__dirname, "src", "components", "app"),
  });

  server.route(routes);

  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  console.log(err);
  process.exit(1);
});

init();
