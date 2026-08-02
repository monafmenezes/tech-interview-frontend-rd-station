import { useEffect, useState } from 'react';
import getProducts from '../services/product.service';

const collectUnique = (products, field) => [
  ...new Set(products.flatMap((product) => product[field] ?? [])),
];

const useProducts = () => {
  const [preferences, setPreferences] = useState([]);
  const [features, setFeatures] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProducts();

        setProducts(products);
        setPreferences(collectUnique(products, 'preferences'));
        setFeatures(collectUnique(products, 'features'));
      } catch (error) {
        console.error('Erro ao obter os produtos:', error);
      }
    };

    fetchData();
  }, []);

  return { preferences, features, products };
};

export default useProducts;
