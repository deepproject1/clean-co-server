const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express()

const secret= 'ldskfofoirto5968fd'

const port =  3000



//parser
app.use(express.json())
app.use(cookieParser())





//DB URI
const uri = "mongodb+srv://CleanDB:TvuhipFNa4QUpRCm@masterdata.ke51mlu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('clean-co').collection('services')
    const bookingCollection = client.db('clean-co').collection('bookings')

   //middlewaress
   //verify token and grant access
   const gateman = (req,res)=>{
    const token  = req.cookies 
    console.log(token)

   }




    app.get('/api/v1/services',gateman, async (req, res) => {
      const cursor =  serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/api/v1/user/create-booking', async (req, res) => {
       const booking = req.body;
    const result = await bookingCollection.insertOne(booking)
        res.send(result);
    })
    app.post('/api/v1/user/create-booking/:bookingId', async (req, res) => {
        const id = req.params.bookingId;
        const query = {_id: new ObjectId(id)}
        const result = await bookingCollection.deleteOne(query);

        res.send(result);
    })


    app.post('/api/v1/auth/access-token', async (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, secret, { expiresIn: '1h' });
        console.log(token);
        res
          .cookie('token', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
          })
          .send({ success: true });
      });

    
    




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
  })

app.listen(port, () => {
  console.log(`Clean co app listening on port ${port}`)
})