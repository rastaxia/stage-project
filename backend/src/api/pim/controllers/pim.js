"use strict";

const axios = require("axios");
/**
 * A set of functions called "actions" for `pim`
 */

module.exports = {
  findProducts: async (context) => {
    const url = context.url;
    const params = new URLSearchParams(url.slice(url.indexOf("?")));
    const page = params.get("page");
    const take = 10;
    const category = params.get("category");

    const response = await axios.post(
      // Insert url van API
      {
        operationName: "FindProducts",
        variables: {
          skip: (page - 1) * take,
          take: take,
          ...(category && {
            filters: [
              {
                field: "category.code",
                value: category,
              },
            ],
          }),
        },
        query:
          "query FindProducts($skip: Int, $take: Int, $query: String, $sort: PaginatedProductSortPagination, $filters: [PaginatedProductFilterPagination!]) {\n  findProducts(\n    skip: $skip\n    take: $take\n    query: $query\n    sort: $sort\n    filters: $filters\n  ) {\n    meta {\n      total\n      page\n      limit\n      sort {\n        field\n        order\n      }\n      query\n      filters {\n        field\n        value\n      }\n    }\n    result {\n      ...ProductFields\n    }\n  }\n}\n\nfragment ProductFields on Product {\n  ean\n  name\n  displayName\n  category\n  mainSupplierKey\n  salesMargin\n  passportCode\n  tags\n  images\n  descriptions\n  properties\n  suppliers {\n    key\n    name\n    itemCode\n    netPrice\n    grossPrice\n    sellingPrice\n    discount\n    stock\n    stockAvailable\n    inShop\n  }\n  inShop\n  archived\n  vatRate\n  isBundle\n  productItems {\n    productEan\n    amount\n    product {\n      category\n      ean\n      name\n    }\n    alternatives {\n      productEan\n      amount\n      product {\n        category\n        ean\n        name\n      }\n    }\n  }\n  created\n  modified\n}\n",
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    return response.data.data.findProducts.result;
  },

  findCategories: async () => {
    const categoryResponse = await axios.post(
      // "graphql url",
      {
        operationName: "findCategories",
        variables: {
          skip: 0,
          take: 99,
        },
        query:
          "query findCategories($skip: Int, $take: Int, $query: String, $sort: PaginatedCategorySortPagination) {findCategories(skip: $skip, take: $take, query: $query, sort: $sort) {meta {total page limit query sort { order field }} result { name code parentCategory properties created modified removed }} } ",
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    return categoryResponse.data.data.findCategories.result;
  },

  findProduct: async (context) => {
    const url = context.url;
    const params = new URLSearchParams(url.slice(url.indexOf("?")));
    const ean = params.get("ean");
    try {
      const productResponse = await axios.post(
        // graphql url",
        {
          operationName: "FindProduct",
          variables: {
            ean: ean,
          },
          query:
            "query FindProduct($ean: String!) {\n  findProduct(ean: $ean) {\n    ...ProductFields\n  }\n}\n\nfragment ProductFields on Product {\n  ean\n  name\n  active\n  displayName\n  category\n  mainSupplierKey\n  salesMargin\n  passportCode\n  tags\n  images\n  descriptions\n  properties\n  suppliers {\n    key\n    name\n    active\n    itemCode\n    netPrice\n    grossPrice\n    sellingPrice\n    discount\n    stock\n    stockAvailable\n    inShop\n    minOrderAmount\n    batchAmount\n  }\n  inShop\n  archived\n  vatRate\n  isBundle\n  productItems {\n    productEan\n    amount\n    product {\n      category\n      ean\n      name\n    }\n    alternatives {\n      productEan\n      amount\n      product {\n        category\n        ean\n        name\n      }\n    }\n  }\n  minOrderAmount\n  batchAmount\n  created\n  modified\n}\n",
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );

      if (productResponse.data.errors) {
        throw new Error(productResponse.data.errors[0]?.message);
      }

      return productResponse.data.data.findProduct;
    } catch (e) {
      console.log(e);
    }
  },
};
