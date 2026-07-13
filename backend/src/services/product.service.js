const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const generateCode = require("../utils/generateCode");
const auditService = require("../services/audit.service");
const ApiFeatures = require("../utils/apiFeatures");

const createProduct = async (data, user) => {
  const existingProduct = await Product.findOne({
    productName: data.productName,
    batchNo: data.batchNo,
  });

  if (existingProduct) {
    throw new ApiError(409, "Product already exists");
  }

  const productCode = await generateCode(Product, "productCode", "PRD");

  const product = await Product.create({
    ...data,

    productCode,

    createdBy: user,
  });

  await auditService.createLog({
    user,
    module: "Product",
    action: "Create",
    description: `Product ${product.productName} created`,
  });

  return product;
};

    const getProducts = async (query) => {
    const features = new ApiFeatures(
        Product.find(),

        query,
    )

        .search(["productName", "manufacturer", "category"])

        .filter()

        .sort()

        .paginate();

    return await features.query;
    };

    const getProduct = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    return product;
    };

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
