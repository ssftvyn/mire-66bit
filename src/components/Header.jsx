import { useState } from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import logo from '../images/logo66.svg';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav-header">
        <Link to="/" className="site-title">
          <img src={logo} alt="Логотип" />
        </Link>
        <div className="menu-container">
          <button className='button-header' onClick={() => setIsOpen(!isOpen)}>Меню</button>
          <ul className={`ul-header ${isOpen ? "open" : ""}`}>
            <li className='li-header'><CustomLink to="/login">вход</CustomLink></li>
            <li className='li-header'><CustomLink to="/profile">профиль</CustomLink></li>
            <li className='li-header'><CustomLink to="/profilem">профиль менеджер</CustomLink></li>
            <li className='li-header'><CustomLink to="/plistu">список проектов пользователь</CustomLink></li>
            <li className='li-header'><CustomLink to="/plistm">список проектов менеджер</CustomLink></li>
            <li className='li-header'><CustomLink to="/listsm">список заказчиков</CustomLink></li>
            <li className='li-header'><CustomLink to="/listssm">список менеджеров</CustomLink></li>
            <li className='li-header'><CustomLink to="/projectcreate">создать проект</CustomLink></li>
            <li className='li-header'><CustomLink to="/tasktable">таблица задач</CustomLink></li>
            <li className='li-header'><CustomLink to="/taskcreate">создать задачу</CustomLink></li>
            <li className='li-header'><CustomLink to="/taskinfo">информация о задаче</CustomLink></li>
            <li className='li-header'><CustomLink to="/report">отчет</CustomLink></li>
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