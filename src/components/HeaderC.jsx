import { Link, useMatch, useResolvedPath } from "react-router-dom";
import logo from '../images/logo66.svg';
const fullName = localStorage.getItem('fullName');

export default function Header() {

  return (
    <header className="header">
      <nav className="nav-header">
        <Link to="/ClientProfile" className="site-title">
          <img src={logo} alt="Логотип" />
          <p className="fullname">{fullName}</p>
        </Link>
        <div className="menu-container">
          <ul className={`ul-header`}>
            <li className='li-header'><CustomLink to="/ClientProfile">Профиль</CustomLink></li>
            <li className='li-header'><CustomLink to="/ProjectListClient">Проекты</CustomLink></li>
          </ul>
        </div>
      </nav>
    </header>
  )
} 

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <Link to={to} className={isActive ? "active" : ""} {...props}>
      {children}
    </Link>
  )
}