import express from 'express';
import Productos from './clasesYFunciones';

const productos = new Productos ();
productos.guardar('Escuadra', 123.45, 'https://es.wikipedia.org/wiki/Escuadra#/media/Archivo:Squadra_45.jpg');
productos.guardar('Calculadora', 234.56, 'https://es.wikipedia.org/wiki/Calculadora#/media/Archivo:Casio_fx-85WA_20050529.jpg');
productos.guardar('Globo Terraqueo', 345.67, 'https://es.wikipedia.org/wiki/Globo_terr%C3%A1queo#/media/Archivo:GlobeSK.jpg');


/** INICIALIZACION API con EXPRESS */
const app = express();
const puerto = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/api/productos/listar', async (req, res) => {
  
  let data=await productos.leer();
  
  if (data.length==0) {
     data= {error: 'no hay productos cargados'}
  }
  return res.json({
    data,
  });
});


app.get('/api/productos/listar/:id', async (req, res) => {
  console.log(req.params);
  const idBuscado = parseInt( req.params.id);
  let producto = await productos.leerUno(idBuscado);
  
  //En caso de no encontrar el producto, respondemos con codigo 404 para indicar el error 
  if (!producto) {
    return res.status(404).json({
      error : 'Producto no encontrado',
    });
  }
  return res.json({
    data: producto,
  });
});



app.post('/api/productos/guardar', async (req, res) => {
  const {title, price, thumbnail} = req.body;
  //console.log({title, price, thumbnail});
  
  const nuevoProducto = await productos.guardar(title, Number(price), thumbnail);
 
  return res.status(201).json({
    data: nuevoProducto,
  });
});


const server = app.listen(puerto, () =>
console.log('Server up en puerto', puerto)
);

server.on('error', (err) => {
  console.log('ERROR ATAJADO', err);
});

/*
* 02- GET Especifico: Para obtener un recurso especifico
* Ejecutando operacion de lectura de un producto en particular
* Obtenemos el id que el cliente desea de la request


  Si encontramso el producto respondemos con su informacion 


 * 03- POST : Creacion de un nuevo recurso
 * Ejecutando operacion de creacion de un nuevo recurso
 * Obtenemos la informacion del Body de la request
 * Para trabajar con el body se debe agregar
 *  - app.use(express.json()): para indicar que el body viene como JSON
 *  - app.use(express.urlencoded({ extended: true })) : Para decirle que puede venir info como no string



 04- PUT/PATCH : Modificar los datos de un recurso existente 

app.put('/productos/:id', (req, res) => {
  console.log(req.params);
  const idBuscado = Number(req.params.id);
  const body = req.body;

  The indexOf() method returns the first index at which a given element can be found
   * in the array, or -1 if it is not present.
   * indexOf() compares searchElement to elements of the Array using strict equality
   * (the same method used by the === or triple-equals operator).
   

  const posicion = productos.map((aProduct) => aProduct.id).indexOf(idBuscado);
  console.log(posicion);
   En caso de no encontrar el producto, respondemos con codigo 404 para indicar el error 
  if (posicion == -1) {
    return res.status(404).json({
      msg: 'Product not found',
    });
  }

  Valido que la info que me mandaron este OK, sino respondo con 400 
  if (
    !body.nombre ||
    !body.precio ||
    typeof body.nombre != 'string' ||
    typeof body.precio != 'number'
  ) {
    return res.status(400).json({
      msg: 'Necesito en el body el nombre (string) y el precio (number)',
    });
  }

  productos[posicion].nombre = body.nombre;
  productos[posicion].precio = body.precio;

  /**Estado 201: Objeto creado correctamente 
  res.status(201).json({
    data: productos[posicion],
  });
});

05- DELETE : Modificar los datos de un recurso existente 

app.delete('./productos/:id', (req, res) => {
  console.log(req.params);
  const idBuscado = Number(req.params.id);

  const newProducts = productos.filter((aProduct) => aProduct.id !== idBuscado);

  productos = newProducts;

  res.json({
    data: productos,
  });
});

06- QUERYES : Se pueden hacer consultas para obtener datos en funcion de una query 

app.get('/productos/find', (req, res) => {
  console.log(req.query);

  res.json({
    data: productos,
  });
});*/
