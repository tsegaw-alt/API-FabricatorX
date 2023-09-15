export const productsSwaggerDefinitions = {
    Product: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          description: "The auto-generated id of the product",
        },
        name: {
          type: "string",
          description: "The name of the product",
        },
        description: {
          type: "string",
          description: "The description of the product",
        },
        category: {
          type: "string",
          description: "The category of the product",
        },
        subcategory: {
          type: "string",
          description: "The subcategory of the product",
        },
        price: {
          type: "number",
          description: "The price of the product",
        },
        salePrice: {
          type: "number",
          description: "The sale price of the product",
        },
        stock: {
          type: "number",
          description: "The stock of the product",
        },
        sku: {
          type: "string",
          description: "The SKU of the product",
        },
        images: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The images of the product",
        },
        isFeatured: {
          type: "boolean",
          description: "Whether the product is featured or not",
        },
        isPublished: {
          type: "boolean",
          description: "Whether the product is published or not",
        },
        rating: {
          type: "number",
          description: "The rating of the product",
        },
        totalReviews: {
          type: "number",
          description: "The total number of reviews of the product",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The tags of the product",
        },
        brand: {
          type: "string",
          description: "The brand of the product",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "The date and time when the product was created",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "The date and time when the product was last updated",
        },
      },
    },
  };
  
  export const productsSwaggerPaths = {
    "/v1/products": {
      get: {
        summary: "Retrieve a list of products or search products by query",
        tags: ["Products"],
        parameters: [
          {
            in: "query",
            name: "query",
            schema: {
              type: "string",
            },
            description: "The query to search products",
            required: false,
          },
        ],
        responses: {
          200: {
            description: "A list of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new product",
        tags: ["Products"],
        requestBody: {
          description: "The product object to create",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/products/{id}": {
      get: {
        summary: "Retrieve a product by ID",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string",
            },
            required: true,
            description: "The product ID",
          },
        ],
        responses: {
          200: {
            description: "A single product",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a product by ID",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string",
            },
            required: true,
            description: "The product ID",
          },
        ],
        requestBody: {
          description: "The product object with updated fields",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a product by ID",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string",
            },
            required: true,
            description: "The product ID",
          },
        ],
        responses: {
          204: {
            description: "Product deleted successfully",
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  