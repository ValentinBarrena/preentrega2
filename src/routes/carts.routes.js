import { Router } from 'express'
import { CartController } from '../dao/cart.controller.mdb.js'

const router = Router()
const controller = new CartController()

router.get('/', async (req, res) => {
        const carts = await controller.getCarts()
        res.status(200).send({ status: 'OK', data: carts })
})

router.get('/:cid', async (req, res) => {
    const cart = await controller.getCart(req.params.cid)
    res.status(200).send({ status: 'OK', data: cart })
})

router.post('/', async (req, res) => {
    const { products } = req.body
    if (!products) {
        return res.status(400).send({ error: 'Products field is required' })
    }

    const newCart = {
        products
    }

        const result = await controller.addCart(newCart)
        res.status(200).send({ status: 'OK', data: result })
})

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
        const { products } = req.body;

        // Verificar si se proporciona un arreglo de productos
        if (!Array.isArray(products)) {
            return res.status(400).send({ error: 'Invalid format for products array' });
        }

        // Actualizar el carrito con el nuevo arreglo de productos
        const updatedCart = await controller.updateCart(cartId, products);

        res.status(200).send({ status: 'OK', data: updatedCart })
})

router.put('/:cid/products/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const result = await controller.updateProductQuantity(cartId, productId, quantity);
        res.status(200).send(result);
})




// router.delete('/:cid', async (req, res) => {
//     const id = req.params.cid;

//     const deletedCart = await controller.deleteCart(id)

//     res.status(200).send({ status: 'Deleted', data: deletedCart })
// })

router.delete('/:cid/products/:pid', async (req, res) => {
        //Obtengo con params el id del carrito y del producto, para posteriormente enviarlo con el updatedCart a la funcion.
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await controller.deleteProductInCart(cartId, productId);

        res.status(200).send({ status: 'Product removed from cart', data: updatedCart });
});

router.delete('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        const result = await controller.deleteAllProductsInCart(cartId);
        res.status(200).send(result);
})

export default router