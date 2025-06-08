const Category = require('../../models/Categories.model');
const util = require('../../exports/util');

const createCategory = async (req, res) => {
  try {
    const { name, icon, type } = req.body;

    if (!name) {
      return util.ResFail(req, res, "Category name is required.");
    }

    const existing = await Category.findOne({ name, userId: req.user._id, isDeleted: { $ne: true } });
    if (existing) {
      return util.ResFail(req, res, "Category name already exists.", 400);
    }

    const result = await Category.updateOne(
      { name, userId: req.user._id }, // match name + user
      {
        $set: {
          icon,
          type,
          isDeleted: false, // restore if soft-deleted
        },
        $setOnInsert: {
          userId: req.user._id,
        },
      },
      { upsert: true }
    );

    return util.ResSuss(req, res, result, "Category created successfully.");
  } catch (error) {
    console.error('Create category error:', error);
    return util.ResFail(req, res, "Failed to create category.");
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ userId: null }, { userId: req.user._id }],
      isDeleted: { $ne: true },
    });

    return util.ResSuss(req, res, categories, "Categories fetched successfully.");
  } catch (error) {
    console.error('Get categories error:', error);
    return util.ResFail(req, res, "Failed to fetch categories.");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, icon, type } = req.body;
    const categoryId = req.params.id;

    const existing = await Category.findOne({
      name,
      userId: util.objectId(req.user._id),
      isDeleted: { $ne: true },
      _id: { $ne: util.objectId(categoryId) }
    });
    if (util.notEmpty(existing)) {
      return util.ResFail(req, res, "Category name already exists.", 400);
    }
  
    const updated = await Category.findOneAndUpdate(
      { _id: categoryId, userId: req.user._id, isDeleted: { $ne: true } },
      { name, icon, type },
      { new: true }
    );

    if (!updated) {
      return util.ResFail(req, res, "Category not found or not yours.");
    }

    return util.ResSuss(req, res, updated, "Category updated successfully.");
  } catch (error) {
    console.error('Update category error:', error);
    return util.ResFail(req, res, "Failed to update category.");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const rsp = await Category.updateOne({
      _id: categoryId,
      userId: req.user._id,
      isDeleted: { $ne: true }
    }, {
      $set: { isDeleted: true }
    });

    if (rsp.modifiedCount === 0) {
      return util.ResFail(req, res, "Category not found or not yours.");
    }

    return util.ResSuss(req, res, null, "Category deleted successfully.");
  } catch (error) {
    console.error('Delete category error:', error);
    return util.ResFail(req, res, "Failed to delete category.");
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
