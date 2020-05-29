 
 const express = require('express')
 const path = require('path')
 const PORT = process.env.PORT || 5000
 const DATABASE_URL = process.env.DATABASE_URL || 'postgres://danilosic:password@localhost:5432/danilosic'
 
 express()
 .use(express.static(path.join(__dirname)))
 .set('views', path.join(__dirname, 'views'))
 .set('view engine', 'ejs')
 .get('/', (req, res) => res.render('index'))
 .get('/a', (req, resp)=> {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) console.log( err);
    else {
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      resp.json(res.rows);
    }
    client.end();
  });
  
})
// }, (req,res) => {
//     console.log(req.test); 
//     res.render('agora');
// })
.listen(PORT, () => console.log(`Listening on ${ PORT } and DATABASE: ${ DATABASE_URL }`))
