import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #303f9f;
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--light-gray);
  color: var(--text-color);
  
  &:hover {
    background-color: #d5d5d5;
  }
`;

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: null
  });
  
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`);
          const product = response.data;
          
          setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            imagen: null
          });
          
          setPreviewImage(`http://localhost:5000${product.imagen}`);
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar el producto:', error);
          toast.error('Error al cargar los datos del producto');
          navigate('/productos');
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file
      });
      
      // Crear URL para previsualización
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    
    if (!isEditMode && !formData.imagen) {
      toast.error('Por favor selecciona una imagen para el producto');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Crear FormData para enviar archivos
      const productData = new FormData();
      productData.append('nombre', formData.nombre);
      productData.append('descripcion', formData.descripcion);
      productData.append('precio', formData.precio);
      
      if (formData.imagen) {
        productData.append('imagen', formData.imagen);
      }
      
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/products/${id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Producto actualizado correctamente');
      } else {
        await axios.post(
          'http://localhost:5000/api/products',
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Producto creado correctamente');
      }
      
      navigate('/productos');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      toast.error('Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div>Cargando datos del producto...</div>;
  }
  
  return (
    <FormContainer>
      <Title>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="nombre">Nombre del Producto*</Label>
          <Input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="descripcion">Descripción*</Label>
          <TextArea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="precio">Precio*</Label>
          <Input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="imagen">Imagen{!isEditMode && '*'}</Label>
          <Input
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleImageChange}
            accept="image/*"
            required={!isEditMode}
          />
          {previewImage && (
            <ImagePreview>
              <img src={previewImage} alt="Vista previa" />
            </ImagePreview>
          )}
        </FormGroup>
        
        <ButtonGroup>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
          </SubmitButton>
          <CancelButton type="button" onClick={() => navigate('/productos')}>
            Cancelar
          </CancelButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}

export default ProductForm;