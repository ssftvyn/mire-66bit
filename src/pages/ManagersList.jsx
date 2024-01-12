import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/lists.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

import searchimg from '../images/search.svg';
import minus from '../images/minus.svg';

function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newManager, setNewManager] = useState({name: '', email: '', phone: '', password: ''});

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
    navigate('/');
  };

  useEffect(() => {
    axios.get('https://mire.stk8s.66bit.ru/api/v1/manager')
      .then(response => {
        const managersData = response.data
          .filter(manager => !manager.admin) 
          .map(manager => ({
            id: manager.id,
            name: `${manager.f_name} ${manager.l_name} ${manager.patronymic}`,
            phone: manager.phoneNumber,
            email: manager.email
          }));
        setManagers(managersData);
      })
      .catch(error => console.error('ооооооооошибкааааа', error));
  }, []);

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchIconClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

const handleAddClick = (event) => {
  event.preventDefault();
  setModalIsOpen(true);
};

const handleModalClose = () => {
  setModalIsOpen(false);
};

const handleInputChange = (e) => {
  setNewManager({...newManager, [e.target.name]: e.target.value});
};

const handleAddManager = () => {
  const { name, phone, email, password, company_name } = newManager;

  const [f_name, l_name, patronymic = ""] = name.split(' ');

  if (!f_name || !l_name || !patronymic || !phone || !email || !password) {
    alert('Все поля должны быть заполнены');
    return;
  }

  if (password.length < 6) {
    alert('Пароль должен содержать не менее 6 символов');
    return;
  }

  if (phone.length < 7 || phone.length > 25) {
    alert('Телефон должен содержать от 7 до 25 символов');
    return;
  }

  if (!email.includes('@') || !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,})$/.test(email)) {
    alert('Почта должна содержать символ @ и быть написана латинскими буквами');
    return;
  }

  const managerData = {
    f_name,
    l_name,
    patronymic,
    phoneNumber: phone,
    email,
    password,
    companyName: company_name || '',
  };

  axios.post('https://mire.stk8s.66bit.ru/api/v1/auth/register', managerData)
  .then(response => {
    console.log(response);
    console.log(response.data);
    setManagers(prevManagers => [...prevManagers, newManager]);
    setModalIsOpen(false);
  })
  .catch(error => console.error('ооооооооошибкааааа', error));
  };


const handleDeleteManager = (id) => {
  axios.delete(`https://mire.stk8s.66bit.ru/api/v1/manager/${id}`)
    .then(response => {
      setManagers(prevManagers => prevManagers.filter(manager => manager.id !== id));
    })
    .catch(error => console.error('аааашибка', error));
};


return (
  <div>
    <h1 className ="inner-heading-lists">Список менеджеров</h1>
    <form className="form-lists">
      <div className="search-container-lists">
        <input
          className='search-inp'
          type="text"
          placeholder="Поиск по имени"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <img
          src={searchimg}
          alt="search"
          className="search-icon"
          onClick={handleSearchIconClick}
        />
      </div>
      <button className='exit' onClick={handleLogout}>Выйти из аккаунта</button>
      <div className="lists-container">
        {filteredManagers.map((manager, index) => (
          <div key={index} className="manager">
            <p>{manager.name}</p>
            <p>Телефон: {manager.phone}</p>
            <p>Email: {manager.email}</p>
            <img src={minus} className="minus-image" alt="minus" onClick={() => handleDeleteManager(manager.id)} />
          </div>    
        ))}
      </div>
      <button className='add' onClick={handleAddClick}>Добавить менеджера</button>
    </form>

    <Modal className='modal-list' isOpen={modalIsOpen} onRequestClose={handleModalClose}>
      <h2>Добавление менеджера</h2>
      <form className='lis-cont'>
        <label className="lists-item">ФИО:
        <input className="inp-lists" type="text" name="name" placeholder="ФИО" onChange={handleInputChange} />
        </label>
        <label className="lists-item">Почта:
        <input className="inp-lists" type="email" name="email" placeholder="Почта" onChange={handleInputChange} />
        </label>
        <label className="lists-item">Телефон:
        <input className="inp-lists" type="text" name="phone" placeholder="Телефон" onChange={handleInputChange} />
        </label>
        <label className="lists-item">Пароль:
        <input className="inp-lists" type="password" name="password" placeholder="Пароль" onChange={handleInputChange} />
        </label>
      </form>
      <button className='add' onClick={handleAddManager}>Добавить</button>
    </Modal>
  </div>
);
}

export default ManagerList;
