import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const ProductListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
`;

const AddButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #303f9f;
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: var(--light-gray);
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid var(--light-gray);
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px 15px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.delete ? 'var(--danger-color)' : 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  margin-right: 8px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const ActionLink = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  margin-right: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar la lista de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Producto eliminado correctamente');
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <ProductListContainer>
      <Header>
        <Title>Gestión de Productos</Title>
        <AddButton to="/productos/nuevo">Agregar Producto</AddButton>
      </Header>

      <ProductsTable>
        <TableHead>
          <TableRow>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Descripción</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <ProductImage 
                    src={`http://localhost:5000${product.imagen}`} 
                    alt={product.nombre} 
                  />
                </TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.descripcion.substring(0, 50)}...</TableCell>
                <TableCell>${product.precio.toFixed(2)}</TableCell>
                <TableCell>
                  <ActionLink to={`/productos/editar/${product._id}`}>
                    Editar
                  </ActionLink>
                  <ActionButton 
                    delete 
                    onClick={() => handleDelete(product._id)}
                  >
                    Eliminar
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5">No hay productos disponibles</TableCell>
            </TableRow>
          )}
        </tbody>
      </ProductsTable>
    </ProductListContainer>
  );
}

export default ProductList;