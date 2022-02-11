import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DummyProducts =[
    {id:'p1',
    price:280,
    title:'BMW V-8 Engine',
    description:'One of the fastest cars in the world',
   },
   {id:'p2',
    price:185,
    title:'Five bedroom Flat detached Mansion',
    description:'luxury at its peek',
  }
]

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DummyProducts.map(product =><ProductItem

          title={product.title}
          id= {product.id}
        //   key={product.id}
          price={product.price}
          description={product.description}
        />)}
      </ul>
    </section>
  );
};

export default Products;
