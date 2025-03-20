import { ProductModel } from "../models/product.js";
import { addProductValidator } from "../validators/product.js";

export const addProduct = async (req, res, next) => {
    try {
        console.log(req.auth)
        //Validate product information
        const { error, value } = addProductValidator.validate({
            ...req.body,
            // image: req.file?.filename,
            pictures: req.files?.map((file) => {
                return file.filename
            })
        }, { abortEarly: false });
        if (error) {
            return res.status(422).json(error);
        }

        // //Check if product does not exist
        // const count = await ProductModel.countDocuments({
        //     name: value.name
        // });
        // if (count) {
        //     return
        // }
        
        //Save product information in database
        const result = await ProductModel.create({
            ...value,
            userId: req.auth.id
        });
        //Return response
        res.status(201).json(result);
    } catch (error) {
        if (error.name === "MongooseError"){
            return res.status(409).json(error.message)
        }
        next(error);
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}" } = req.query;

        //Fetch products from database
        const result = await ProductModel
        .find(JSON.parse(filter))
        .sort(JSON.parse(sort));
        //Return response
        res.json(result);
    } catch (error) {
        next(error);

    }
}

export const countProducts = (req, res) => {
    res.send("All products count!");
}

export const updateProduct = (req, res) => {
    res.send(`Product with id ${req.params.id} updated`);
}

export const deleteProduct = (req, res) => {
    res.send(`Products with id ${req.params.id} deleted`);
}

export const replaceProduct = async (req, res, next) => {
    //Validate incoming request body information
    //Perform model replace operation
    const result = await ProductModel.findOneAndReplace(
        {_id: req.params.id},
        req.body,
        {new:true}
    );
    //Return a response
    res.status(200).json(result)
}

