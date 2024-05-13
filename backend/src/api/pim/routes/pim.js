module.exports = {
  routes: [
    {
      method: "GET",
      path: "/products",
      handler: "pim.findProducts",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/categories",
      handler: "pim.findCategories",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/product",
      handler: "pim.findProduct",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
