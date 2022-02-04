require("regenerator-runtime/runtime");

module.exports = [
  // Home
  {
    method: "GET",
    path: "/",
    handler: async (request, reply) => {
      return reply.view("app", {
        props: {
          location: request.url,
          data: [],
          userAgent: request.plugins.scooter,
        },
      });
    },
  },
  // css
  {
    method: "GET",
    path: "/css/{param}",
    config: {
      handler: {
        directory: {
          path: "css",
          defaultExtension: "css",
        },
      },
      state: {
        parse: true,
        failAction: "ignore",
      },
    },
  },
  // javascript
  {
    method: "GET",
    path: "/js/{param}",
    config: {
      handler: {
        directory: {
          path: "js",
          defaultExtension: "js",
        },
      },
      state: {
        parse: true,
        failAction: "ignore",
      },
    },
  },
  // images
  {
    method: "GET",
    path: "/images/{param}",
    config: {
      handler: {
        directory: {
          path: "images",
          defaultExtension: "jpg",
        },
      },
      state: {
        parse: true,
        failAction: "ignore",
      },
    },
  },
  // fonts
  {
    method: "GET",
    path: "/fonts/{param}",
    config: {
      handler: {
        directory: {
          path: "fonts",
          defaultExtension: "ttf",
        },
      },
      state: {
        parse: true,
        failAction: "ignore",
      },
    },
  },
];
