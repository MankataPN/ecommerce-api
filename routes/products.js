import { Router } from "express";
import { addProduct, countProducts, deleteProduct, getProducts, updateProduct } from "../controllers/products.js";
import { localUpload, productImageUpload, productPicturseUpload, remoteUpload } from "../middlewares/upload.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

//Create a product router
const productsRouter = Router();

//Define routes
productsRouter.post(
    "/products", 
    isAuthenticated,
    isAuthorized(["superadmin, admin"]),
    // productImageUpload.single("image"), 
    productPicturseUpload.array("pictures", 3), 
    addProduct
);

productsRouter.get("/products", getProducts);

productsRouter.get("/products/count", countProducts);

productsRouter.patch("/products/:id", isAuthenticated, updateProduct);

productsRouter.delete("/products:id", isAuthenticated, deleteProduct);

//Export router
export default productsRouter;