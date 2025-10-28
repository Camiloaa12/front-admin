import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background-color);
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 24px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #303f9f;
  }

  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error-color);
  margin-top: 16px;
  text-align: center;
`;

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { success, error } = await login(formData.email, formData.password);
      
      if (success) {
        toast.success('Inicio de sesión exitoso');
        navigate('/');
      } else {
        setError(error);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Panel de Administración</LoginTitle>
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;