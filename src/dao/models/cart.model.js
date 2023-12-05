import mongoose from 'mongoose'

mongoose.pluralize(null)

const collection = 'carts'

const schema = new mongoose.Schema({
    //Colocamos los ids de los productos a agregar al cart
    products: {type: [mongoose.Schema.Types.ObjectId], ref: 'products'},
});

export default mongoose.model(collection, schema)