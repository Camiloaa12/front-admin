import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const DashboardCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardTitle = styled.h3`
  color: var(--text-color);
  margin-bottom: 10px;
`;

const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
`;

const AddButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  margin-bottom: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #303f9f;
  }
`;

const RecentProductsTitle = styled.h2`
  margin-bottom: 20px;
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: var(--primary-color);
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-top: 1px solid var(--light-gray);
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const products = productsResponse.data;
        
        setStats({
          totalProducts: products.length
        });
        
        // Obtener los 5 productos más recientes
        const recent = products.slice(0, 5);
        setRecentProducts(recent);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      <DashboardContainer>
        <DashboardCard>
          <CardTitle>Total de Productos</CardTitle>
          <CardValue>{stats.totalProducts}</CardValue>
        </DashboardCard>
      </DashboardContainer>
      
      <AddButton to="/productos/nuevo">Agregar Nuevo Producto</AddButton>
      
      <RecentProductsTitle>Productos Recientes</RecentProductsTitle>
      
      <ProductsTable>
        <TableHead>
          <TableRow>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Fecha</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <ProductImage 
                    src={`http://localhost:5000${product.imagen}`} 
                    alt={product.nombre} 
                  />
                </TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>${product.precio.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4">No hay productos disponibles</TableCell>
            </TableRow>
          )}
        </tbody>
      </ProductsTable>
    </div>
  );
}

export default Dashboard;