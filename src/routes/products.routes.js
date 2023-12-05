import { Router } from 'express'

import { uploader } from '../uploader.js'
import { ProductController } from '../dao/product.controller.mdb.js'

const router = Router()
const controller = new ProductController()

router.get('/', async (req, res) => {
    try{
    const query = req.query.query ? JSON.parse(req.query.query) : {} //Lo convierto con un JSON.Parse para evitar problemas en la busqueda, REALIZARLA COMO JSON UNICAMENTE, por ejemplo: /api/products?query={"category":"Tables"}
    let sort = null

    if (req.query.sort) {
        if (req.query.sort === 'asc' || req.query.sort === 'desc') {
            sort = { price: req.query.sort }; // En caso de asc ordena ascendentemente y en caso de desc ordena descendentemente.
        } else {
            console.error('Invalid value for sort. The ordering is ignored.'); // Si sort no recibe asc o desc se ignora el ordenamiento.
        }
    }
        const limit = req.query.limit // Uso la query limit para el limite de productos.
        const page = req.query.page // Uso la query page para la pagina a la cual quiero ir.
        const result = await controller.getProducts({ limit, page, sort, query }) // Obtengo resultados utilizando paginate.

        res.status(200).send({status: 'sucess', payload: result}) // En el result se devuelve "prevPage":null,"nextPage":null en vez de prevLink: Link directo a la página previa (null si hasPrevPage=false) nextLink Link directo a la página siguiente (null si hasNextPage=false). Me lo devuelve con distinto nombre pero ambos funcionan de la misma manera (con null)
} catch (error) {
        // Agregue un catch ya que si no enviamos un JSON como query se caia la pagina, asi que en el catch si no se consigue un JSON se envia el mensaje de error.
        console.error('Error parsing query:', error);
        res.status(400).send({ status: 'error', message: 'Invalid JSON in query parameter.' });
    }
})

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid // Obtengo el id enviado por params.

    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
        return res.status(400).send({ status: 'Error', message: 'Invalid product ID' }); // Valido ese id obtenido.
    }

    const product = await controller.getProduct(productId);
        if (product) {
            res.status(200).send({ status: 'OK', data: product }); 
        } else {
            res.status(400).send({ status: 'Error', message: 'Product not found' });
        }
})

router.post('/', uploader.single('thumbnail'), async (req, res) => {
    if (!req.file) return res.status(400).send({ status: 'FIL', data: 'Could not upload file' })

    const { title, description, price, code, stock, status, category } = req.body
    if (!title || !description || !price || !code || !stock) {
        return res.status(400).send({ error: 'All fields are required' })
    }

    const existingProduct = await controller.getProductByCode(parseInt(code));
    if (existingProduct) {
        return res.status(400).send({ error: 'Product with the same code already exists' });
    }

    const newProduct = {
        title,
        description,
        price,
        thumbnail: req.file.filename,
        status,
        category,
        code,
        stock
    }

    const result = await controller.addProduct(newProduct)
    res.status(200).send({ status: 'OK', data: result })
})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const newContent = req.body

    const updatedProduct = await controller.updateProduct(id, newContent)

    res.status(200).send({ status: 'Updated', data: updatedProduct })
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    const deletedProduct = await controller.deleteProduct(id)

    res.status(200).send({ status: 'Deleted', data: deletedProduct })
})

export default router