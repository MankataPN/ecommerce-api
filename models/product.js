import { Schema, Types, model } from "mongoose";
import normalize from "normalize-mongoose";

const productSchema = new Schema({
    name: { type: String, required: true, unique: [true, "product with such name exists"] },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    // image: { type: String, required: true },
    quantity: { type: Number, required: true },
    pictures: [{type: String, required: true}],
    userId: {type: Types.ObjectId, required: true, ref: "User"}
}, {
    timestamps: true
});

productSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

// productSchema.plugin(normalize);

export const ProductModel = model("Product", productSchema);