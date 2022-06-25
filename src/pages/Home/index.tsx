import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const [cartItemsAmount, setCartItemsAmount] = useState<CartItemsAmount>([]);
  const { addProduct, cart } = useCart();

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  useEffect(() => {
    
      let newCartItemsAmount = cart.reduce((sumAmount, product) => {
 
        sumAmount[product.id] = product?.amount > 0 ? product?.amount : 1;
        return sumAmount;
      }, {} as CartItemsAmount)
      
      setCartItemsAmount(newCartItemsAmount)     

    
  },[cart])

  useEffect(() => {
    async function loadProducts() {
      const productsArray = await api.get('products');
      const ProductFormatted = await productsArray.data.map((prod:ProductFormatted) => (
        {...prod,'priceFormatted':formatPrice(prod.price)}
      ));
      setProducts(ProductFormatted)
    }

    loadProducts();
  }, []);

 


  return (
    <ProductList>
    
    {products.map(product => (
        
        <li key={product.id}>         
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{formatPrice(product.price)}</span>
          
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />
              <span data-testid="cart-product-quantity">
                {cartItemsAmount[product.id] || 0} </span>
            </div>
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
