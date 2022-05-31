const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://borhan:TsuZjl4t06dVHNka@cluster0.efcmg0v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const vendortCollection = client.db("productCollection").collection("vendor");
        const purchaseCollection = client.db("productCollection").collection("purchase");
        const productsCollection = client.db("productCollection").collection("product");

        // add vendors
        app.post('/vendor', async (req, res) => {
            const newVendor = req.body;
            const add = await vendortCollection.insertOne(newVendor);
            res.send(add);
        });

        // purchase order
        app.post('/purchase', async (req, res) => {
            const purchae = req.body;
            const query = { name: purchae.name, referencef: purchae.referencef }
            const exists = await purchaseCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, purchae: exists })
            }
            const add = await purchaseCollection.insertOne(purchae);
            return res.send({ success: true, add });
        });

        // add products
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const add = await productsCollection.insertOne(newProduct);
            res.send(add);
        });

        // display all products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // display only Owners product
        app.get('/Ownproducts', async (req, res) => {
            const pd = req.body;
            const query = { id: pd.id };
            if (query) {

                const cursor = productsCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
        });

        // display only all vendors product
        app.get('/AVnproducts', async (req, res) => {
            const pd = req.body;
            const query = { id: pd.id };
            if (query) {

                const cursor = productsCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
        });

        // display only individual vendors products
        app.get('/vproduct', async (req, res) => {
            const id = req.query.id;
            const query = { id: id };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // Delete product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });

        // display all vendor
        app.get('/vendor', async (req, res) => {
            const query = {};
            const cursor = vendortCollection.find(query);
            const Vendors = await cursor.toArray();
            res.send(Vendors);
        });

        // display purchase order
        app.get('/purchase', async (req, res) => {
            const query = {};
            const cursor = purchaseCollection.find(query);
            const Vendors = await cursor.toArray();
            res.send(Vendors);
        });

        // display purchase invoice for individual
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await vendortCollection.findOne(query);
            res.send(product);
        });


    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('This is our material purchase requisition system project');
});
app.listen(port, () => {
    console.log('Listen to port', port);
});