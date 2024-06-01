import Category from '../models/categoryModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const createCategory=asyncHandler(async(req,res)=>{
    try {
        const {name}=req.body;
        if(!name){
            return res.json({error:"Name is Required"})
        }
        const existCategory=await Category.findOne({name})
        if(existCategory) return res.json({message:"Category already exist"});

        const category=await new Category({name}).save();
        res.json(category);

    } catch (error) {
        return res.status(400).json(error)
    }
});

const updateCategory=asyncHandler(async(req,res)=>{
    try {
        const {name}=req.body;
        const {Id}=req.params;
        const category=await Category.findOne({_id:Id})
        if(!category){
            return res.status(404).json({message:"Not found"})
        }
        category.name=name;
        const updated=await category.save();
        res.json(updated);

    } catch (error) {
        return res.status(500).json(error)
    }
});

const removeCategory=asyncHandler(async(req,res)=>{
    try {
        const {Id}=req.params
        const category=await Category.findOne({_id:Id})
        if(!category){
            return res.status(404).json({message:"Not found"})
        }
        const remove=await Category.deleteOne({_id:Id});
        res.json(remove);
    } catch (error) {
        return res.status(500).json(error)
    }

});

const listCategory=asyncHandler(async(req,res)=>{
    try {
        const all=await Category.find({});
        res.json(all);
    } catch (error) {
        return res.status(400).json({message:"An error occured"})
    }
});

const readCategory=asyncHandler(async(req,res)=>{
    try {
        const category=await Category.findOne({_id:req.params.cId})
    
        if(!category){
            return res.status(404).json({message:"Not found"})
        }
        res.json(category);

    } catch (error) {
        return res.status(400).json(error)
    }
});

export {createCategory,updateCategory,removeCategory,listCategory,readCategory}