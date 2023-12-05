import cartModel from './models/cart.model.js'
import productModel from './models/product.model.js'
import mongoose from 'mongoose'

export class CartController {
    constructor() {
    }

    async addCart(cart) {
        try {
            await cartModel.create(cart)
            return "Cart created"
        } catch (err) {
            return err.message
        }
    }

    async getCarts() {
        try {
            return await cartModel.find();
        } catch (err) {
            return err.message
        }
    }

    async getCart(id) {
        try {
            const cart = await cartModel.findById(id).populate({ path: 'products', model: productModel }).lean()
            return cart === null ? 'Cart not founded' : cart
        } catch (err) {
            return err.message
        }
    }

    async updateCart(cartId, productIds) {
        try {
            const cart = await cartModel.findById(cartId);

            //Si no halla el carrito devuelve cart not found.
            if (!cart) {
                return ('Cart not found');
            }

            // Actualizar el arreglo de IDs de productos en el carrito
            cart.products = productIds;

            // Guardar el carrito actualizado
            const updatedCart = await cart.save();

            return updatedCart
        } catch (err) {
            return err.message
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            // Busco el carrito indicado con ID.
            const cart = await cartModel.findById(cartId).populate({ path: 'products', model: productModel });
    
            // Si no hay carrito devuelve un return.
            if (!cart) {
                return ('Cart not found');
            }
    
            // Busco el producto específico en el carrito.
            const productToUpdate = cart.products.find(product => product._id.toString() === productId);
    
            // Si no ubico al producto especifico devuelve un return.
            if (!productToUpdate) {
                return ('Product not founded in cart');
            }
    
            // Actualizo la cantidad del producto.
            productToUpdate.quantity = newQuantity;
    
            // Guardo el carrito actualizado.
            const updatedCart = await cart.save();
    
            // Retorno el carrito actualizado
            return { status: 'success', data: updatedCart };
        } catch (err) {
            err.message
        }
    }

    async deleteCart(id) {
        try {
            const cart = await cartModel.findByIdAndDelete(id)
            return cart
        } catch (err) {
            return err.message
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                return ('Cart not found');
            }

            // Filtro los productos del carrito, excluyendo el producto con el productId.
            cart.products = cart.products.filter(product => product._id.toString() !== productId);

            // Con el metodo save() guardo la constante carrito actualizada y la retorno debajo.
            const updatedCart = await cart.save();

            return updatedCart;
        } catch (err) {
            return err.message
        }
    }

    async deleteAllProductsInCart(cartId) {
        try {
            const updatedCart = await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: [] } }
            );

            if (updatedCart.nModified === 0) {
                throw new Error('Carrito no encontrado.');
            }

            return { status: 'OK', data: 'Todos los productos del carrito han sido eliminados.' };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}