const { resolveNaptr } = require("dns");
const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");
const config = require("../config/auth.config");
const path = require("path");
const dotenv = require("dotenv");
const randomstring = require("randomstring");
dotenv.config();
const stripe = require("stripe")(config.STRIPE_KEY);

const fs = require("fs");
const AWS = require("aws-sdk");
const { getAllJSDocTags } = require("typescript");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const saveImagesToS3 = async (files) => {
  const savedFiles = [];
  for (var file of files) {
    const filePath = file.path;
    console.log("Saving image to S3: " + filePath);
    const fileContent = fs.readFileSync(filePath);
    const randomName = randomstring.generate({
      length: 30,
    });
    const extension = path.extname(filePath);
    const params = {
      Bucket: "s21285",
      Key: `${randomName}${extension}`,
      Body: fileContent,
    };
    try {
      const data = await s3.upload(params);
      console.log(data);
    } catch (err) {
      console.log(err);
    }

    let uploadedImage = await s3.upload(params).promise();

    await savedFiles.push(await uploadedImage.Location);
  }

  return savedFiles;
};

const saveImageToDatabase = async (files, productId, t) => {
  for (var file of files) {
    console.log("Saving file to database: " + file);
    await db.image.create(
      {
        url: file,
        productId: productId,
      },
      { transaction: t }
    );
  }
};
// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      var name = req.body.name;
      var description = req.body.description;
      var price = req.body.price;
      var category = req.body.category;
      var tags = req.body.tags ? req.body.tags : [];
      var files = req.files.files;
      console.log(req.files.files);
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !tags.length === 0 ||
        !files.length === 0
      ) {
        return res.status(400).send({ message: "All fields are mandatory" });
      }
      // Create/Get category
      const [categoryObject, createdAt] = await db.category.findOrCreate({
        where: {
          name: category,
        },
        transaction: t,
      });

      // Create product
      const [productObject, created] = await Product.findOrCreate({
        where: {
          name: name,
          description: description,
          price: price,
          categoryId: categoryObject.id,
        },
        transaction: t,
      });
      // Create/Get tags

      for (var tag of tags) {
        const [tagObject, created] = await db.tag.findOrCreate({
          where: { name: tag },
          transaction: t,
        });

        await db.productTag.findOrCreate({
          where: {
            productId: productObject.id,
            tagId: tagObject.id,
          },
          transaction: t,
        });
      }

      const savedFiles = await saveImagesToS3(files);
      await saveImageToDatabase(savedFiles, productObject.id, t);

      // Create Stripe product

      const stripeProduct = await stripe.products.create({
        name: name,
        description: description,
        default_price_data: {
          unit_amount: parseFloat(price) * 100,
          currency: "EUR",
        },

        shippable: true,
        images: savedFiles,
      });
      console.log(stripeProduct);
      productObject.stripe_price = stripeProduct.default_price;
      await productObject.save({ transaction: t });
    });

    return res.send("Success");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

// Retrieve all Products from the database.
exports.findAll = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let data = await Product.findAll({
        include: [
          db.category,
          db.tag,
          db.image,
          { model: db.stock, include: db.size },
        ],
        transaction: t,
        paranoid: false,
      });

      return res.send(await data);
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Products.",
    });
  }
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  const name = req.params.name;
  console.log(name);
  await Product.findOne({
    where: { name: name },
    include: [
      db.category,
      db.tag,
      db.image,
      { model: db.stock, include: db.size },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Product with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Product",
      });
    });
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      if (
        !req.body.name ||
        !req.body.description ||
        !req.body.price ||
        !req.body.category
      )
        return res.status(400).send({ message: "All fields are required" });
      const id = req.params.id;
      var files = req.files.files;
      let product = await Product.findByPk(id);
      if (!product) {
        res.status(400).send({
          message: `Product with id ${id} not found`,
        });
      }

      await Product.update(
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
        },
        {
          where: {
            id: id,
          },
          transaction: t,
        }
      );

      const [category, created] = await db.category.findOrCreate({
        where: { name: req.body.category },
      });

      await product.setCategory(category, { transaction: t });

      if (req.body.tags) {
        for (var tag of req.body.tags) {
          await db.tag.findOrCreate({ where: { name: tag }, transaction: t });
        }

        const tags = await db.tag.findAll({
          where: {
            name: {
              [Op.or]: req.body.tags,
            },
          },
          transaction: t,
        });
        await product.setTags(tags, { transaction: t });
      }

      await product.save({ transaction: t });
      const savedFiles = await saveImagesToS3(files);
      await saveImageToDatabase(savedFiles, product.id, t);
    });

    return res.send("Updated!");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || `Error updating Product with id=${req.params.id}`,
    });
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  await Product.destroy({
    where: { id: id },
  }).then(
    function (rowDeleted) {
      console.log(rowDeleted);
      if (rowDeleted === 1) {
        return res.send({ message: "Success" });
      } else {
        return res.status(500).send({ message: "Cannot delete product" });
      }
    },
    function (err) {
      console.log(err);
    }
  );
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {
  Product.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Products were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Products.",
      });
    });
};
