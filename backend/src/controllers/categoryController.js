const Category = require('../models/Category')

const formatImagePath = (file) => {
  if (!file) return undefined;
  return file.filename;
};

exports.getCategories = async(req,res) => {
    try{
        const category = await Category.find();
        res.json(category);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.createCategory = async(req,res) => {
    try{
        const payload = { ...req.body };
        const imagePath = formatImagePath(req.file);
        if (imagePath) {
          payload.image_url = imagePath;
        }
        const category = new Category(payload);
        const saved = await category.save();
        res.status(201).json(saved);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.patchCategory = async(req,res) => {
    try{
        const payload = { ...req.body };
        const imagePath = formatImagePath(req.file);
        if (imagePath) {
          payload.image_url = imagePath;
        } else if (payload.image_url === "") {
          delete payload.image_url;
        }
        const category = await Category.findByIdAndUpdate(req.params.id, {$set: payload}, {new: true});
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.deleteCategory = async(req, res) => {
    try{
        const category = await Category.findByIdAndDelete(req.params.id);
        res.json(category);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}