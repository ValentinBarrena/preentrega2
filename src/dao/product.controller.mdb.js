import productModel from './models/product.model.js'
import mongoosePaginate from 'mongoose-paginate-v2'

export class ProductController {
    constructor() {}

    async addProduct(product) {
        try {
            await productModel.create(product)
            return "Added product"
        } catch (err) {
            return err.message
        }
    }

    async getAllProducts() {
        try {
            const products = await productModel.find().lean();
            return products;
        } catch (err) {
            return err.message;
        }
    }

    async getProducts({ limit = 10, page = 1, sort = null, query } = {}) {
        try {
            const options = {
                page: parseInt(page, 10) || 1,  // En este caso nos aseguramos que page sea un numero entero y en caso de no recibir parametro lo define default como 1.
                limit: parseInt(limit, 10) || 10, // En este caso nos aseguramos que limit sea un numero entero y en caso de no recibir parametro lo define default como 10.
                sort,
            };

            const searchQuery = query && Object.keys(query).length > 0 ? query : {} //Analizamos la consulta enviada y si query no tiene resultados, enviamos todo junto.
            
            return await productModel.paginate(searchQuery, options); //Como resultado enviamos con un paginate la busqueda del query y el options con los parametros enviados.;
        } catch (err) {
            return err.message
        }
        
    }

    async getProduct(id) {
        try {
            const product = await productModel.findById(id)
            return product
        } catch (err) {
            return err.message
        }
    }

    async updateProduct(id, newContent) {
        try {
            const product = await productModel.findByIdAndUpdate(id, newContent, { new: true })
            return product
        } catch (err) {
            return err.message
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productModel.findByIdAndDelete(id)
            return product
        } catch (err) {
            return err.message
        }
    }

    async getProductByCode(code) {
        try {
            const products = await this.getAllProducts();
            return products.find(product => product.code === code);
        } catch (err) {
            return err.message;
        }
    }
}