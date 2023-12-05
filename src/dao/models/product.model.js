import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null)

const collection = 'products'

const schema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code : {type: Number, required: true},
    price: {type: Number, required: true},
    status: {type: Boolean, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    thumbnail: {type: String, required: true},
    quantity: { type: Number, default: 1 }
})

schema.plugin(mongoosePaginate)

export default mongoose.model(collection, schema)