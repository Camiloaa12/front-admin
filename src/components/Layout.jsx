import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: var(--primary-color);
  color: white;
  padding: 20px 0;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  padding: 12px 20px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    border-left: 4px solid white;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 12px 20px;
  text-align: left;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--light-gray);
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: var(--text-color);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserEmail = styled.span`
  margin-right: 10px;
  font-weight: 500;
`;

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>Tienda Admin</Logo>
        <NavMenu>
          <StyledNavLink to="/" end>Dashboard</StyledNavLink>
          <StyledNavLink to="/productos">Productos</StyledNavLink>
        </NavMenu>
        <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Panel de Administración</PageTitle>
          <UserInfo>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
        </Header>
        
        <Outlet />
      </Content>
    </LayoutContainer>
  );
}

export default Layout;