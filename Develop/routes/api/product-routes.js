const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single product by its ID
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new product
router.post('/', async (req, res) => {
  /* req.body format should be:
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 4,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a product by its ID
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Update product tags if there's any change in tags
    if (req.body.tagIds) {
      const { tagIds } = req.body;
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      
      // Determine which tags to add and which to remove
      const newTags = tagIds.filter((tag_id) => !productTagIds.includes(tag_id));
      const oldTags = productTags.filter(({ tag_id }) => !tagIds.includes(tag_id)).map(({ id }) => id);
      
      // Execute the additions and deletions of tags
      await Promise.all([
        ProductTag.destroy({ where: { id: oldTags } }),
        ProductTag.bulkCreate(newTags.map((tag_id) => ({ product_id: req.params.id, tag_id }))),
      ]);
    }

    // Fetch the updated product details
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a product by its ID
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
