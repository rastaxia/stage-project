const axios = require("axios");

module.exports = async () => {
  try {
    const res = await axios.post(
      // "graphql url,
      {
        operationName: "FindProducts",
        variables: { skip: 0, take: 10 },
        query:
          "query FindProducts($skip: Int, $take: Int, $query: String, $sort: PaginatedProductSortPagination, $filters: [PaginatedProductFilterPagination!]) {\n  findProducts(\n    skip: $skip\n    take: $take\n    query: $query\n    sort: $sort\n    filters: $filters\n  ) {\n    meta {\n      total\n      page\n      limit\n      sort {\n        field\n        order\n      }\n      query\n      filters {\n        field\n        value\n      }\n    }\n    result {\n      ...ProductFields\n    }\n  }\n}\n\nfragment ProductFields on Product {\n  ean\n  name\n  displayName\n  category\n  mainSupplierKey\n  salesMargin\n  passportCode\n  tags\n  images\n  descriptions\n  properties\n  suppliers {\n    key\n    name\n    itemCode\n    netPrice\n    grossPrice\n    sellingPrice\n    discount\n    stock\n    stockAvailable\n    inShop\n  }\n  inShop\n  archived\n  vatRate\n  isBundle\n  productItems {\n    productEan\n    amount\n    product {\n      category\n      ean\n      name\n    }\n    alternatives {\n      productEan\n      amount\n      product {\n        category\n        ean\n        name\n      }\n    }\n  }\n  created\n  modified\n}\n",
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const responseData = res.data.data.findProducts;
    const mappedData = responseData.result.map(mapProduct);

    const entries = await strapi.entityService.findMany(
      "api::product.product",
      {
        fields: ["ID", "ean"],
        filters: {
          ean: {
            $in: mappedData.map((d) => d.ean),
          },
        },
      }
    );

    // Existing Products
    const existingProducts = mappedData.filter((data) =>
      entries.find((entry) => entry.ean === data.ean)
    );
    for (const existingProduct of existingProducts) {
      const found = entries.find(
        (element) => element.ean === existingProduct.ean
      );
      console.log("Update:", existingProduct.name, found.id);
      await strapi.entityService.update("api::product.product", found.id, {
        data: existingProduct,
      });

      console.log("Update Complete");
    }

    // New Products
    const newProducts = mappedData.filter(
      (data) => entries.find((entry) => entry.ean === data.ean) === undefined
    );
    for (const newProduct of newProducts) {
      console.log("Create:", newProduct.name);

      await strapi.entityService.create("api::product.product", {
        data: newProduct,
      });

      console.log("Create complete");
    }
  } catch (error) {
    console.log("ERROR", JSON.stringify(error));
  } finally {
    console.log("Done");
  }
};

const mapProduct = (product) => {
  return {
    ean: product.ean,
    name: product.name,
    displayName: product.displayName,
    categoryCode: product.category.code,
    category: { code: product.category.code, name: product.category.name },
    mainSupplierKey: product.mainSupplierKey,
    salesMargin: product.salesMargin,
    passportCode: product.passportCode,
    images: product.images,
    inShop: product.inShop,
    archived: product.archived,
    vatRate: product.vatRate,
    isBundle: product.isBundle,
    tags: product.tags.map((t) => ({ tag: t })),
    descriptions: product.descriptions?.map(mapProductDescriptions),
    properties: product.properties?.map(mapProductProperties),
    suppliers: product.suppliers?.map(mapProductSupplier),
    ...(product.productItems &&
      product.productItems.length && {
        bundleItems: product.productItems?.map(mapProductItems),
      }),
  };
};

const mapProductSupplier = (supplier) => {
  return {
    key: supplier.key,
    name: supplier.name,
    itemCode: supplier.itemCode,
    netPrice: supplier.netPrice,
    grossPrice: supplier.grossPrice,
    sellingPrice: supplier.sellingPrice,
    discount: supplier.discount,
    stock: supplier.stock,
    stockAvailable: supplier.stockAvailable,
    inShop: supplier.inShop,
  };
};

const mapProductDescriptions = (descriptions) => ({
  language: descriptions.language,
  body: descriptions.body,
});

const mapProductProperties = (properties) => ({
  key: properties.key,
  value: properties.value.toString(),
});

const mapProductItems = (item) => ({
  amount: item.amount,
  ean: item.productEan,
  name: item.product.name,
  category: {
    code: item.product.category.code,
    name: item.product.category.name,
  },
  ...(item.alternatives &&
    item.alternatives.length > 0 && {
      alternatives: item.alternatives?.map(mapProductItems),
    }),
});
