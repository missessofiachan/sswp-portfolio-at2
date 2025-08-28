import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const link = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: isActive ? 'underline' : 'none',
    marginRight: 12,
  });
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #333' }}>
      <Link to="/">TU Shop</Link>
      <span style={{ marginLeft: 24 }}>
        <NavLink to="/products" style={link}>
          Products
        </NavLink>
        <NavLink to="/legacy" style={link}>
          Legacy
        </NavLink>
        <NavLink to="/login" style={link}>
          Login
        </NavLink>
      </span>
    </nav>
  );
}
