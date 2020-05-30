 
 const express = require('express')
 const path = require('path')
 const PORT = process.env.PORT || 5000
 const DATABASE_URL = process.env.DATABASE_URL || 'postgres://danilosic:password@localhost:5432/danilosic'
 const { Client } = require('pg');
 const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

var queryx = async function(qr){
 return new Promise((resolve,reject) => {
  client.query(qr, async (err, res) => {
    if (err) reject( err);
    else {
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      resolve(res.rows);
    }
    if(res)
      resolve("this query is "+ res.command);
  });
 })
}

const app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app
.use(express.static(path.join(__dirname)))
.set('views', path.join(__dirname))
.set('view engine', 'ejs')
.get('/', (req, res) => res.render('index'))
.post('/', async (req, res) => {
  console.log('começa query: ' + new Date());
  var result = await queryx(req.body.qr);
  console.log(new Date() + " <--- terminou query!!!");
  if(result)
    res.json(result);
  else
    res.redirect('/');
})
.get('/all', (req, resp)=> {
  console.log('começa query: ' + new Date());
  var result = queryx('SELECT table_schema,table_name FROM information_schema.tables;');
  console.log(new Date() + " <--- terminou query!!!");
  resp.json(result);
})
// }, (req,res) => {
//     console.log(req.test); 
//     res.render('agora');
// })
.listen(PORT, () => console.log(`Listening on ${ PORT } and DATABASE: ${ DATABASE_URL }`))
