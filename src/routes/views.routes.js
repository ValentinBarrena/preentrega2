import { Router } from 'express'

import { ProductController } from '../dao/product.controller.mdb.js'
import { CartController } from '../dao/cart.controller.mdb.js'

const router = Router()
const controllerProducts = new ProductController()
const controllerCarts = new CartController()

router.get('/products', async (req, res) => {
        // Obtengo resultados utilizando paginate (dentro de getProducts)
        const products = await controllerProducts.getProducts()
    res.render('products', {
        products
    })
})

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid // Obtengo el id enviado por params.

    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
        return res.status(400).send({ status: 'Error', message: 'Invalid product ID' }); // Valido ese id obtenido.
    }

    const product = await controllerProducts.getProduct(productId);
        // Realizo un if en el cual:
        if (product) { // Si hay producto -> renderiza lo obtenido en la plantilla.
            res.render('product', {
                product
            }); 
        } else { // Si no hay producto -> Devuelve un error.
            res.status(400).send({ status: 'Error', message: 'Product not found' });
        }
})

router.get('/carts/:cid', async (req, res) => {
    const cart = await controllerCarts.getCart(req.params.cid)
    res.render('carts', {cart})
})

export default router