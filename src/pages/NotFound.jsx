import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin-bottom: 1rem;
  color: #e74c3c;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #555;
`;

const StyledLink = styled(Link)`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

function NotFound() {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>La página que estás buscando no existe.</Message>
      <StyledLink to="/">Volver al Dashboard</StyledLink>
    </NotFoundContainer>
  );
}

export default NotFound;