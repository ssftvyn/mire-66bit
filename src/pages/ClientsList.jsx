import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/lists.css';
import Modal from 'react-modal';

import searchimg from '../images/search.svg';
import minus from '../images/minus.svg';

import HeaderM from '../components/HeaderM';

function CustomerList() {
  const [profileId, setProfileId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({name: '', email: '', phone: '', password: ''});

  useEffect(() => {
    axios.get('https://mire.stk8s.66bit.ru/api/v1/client')
    .then(response => {
      const customersData = response.data.map(customer => ({
        id: customer.id,
        name: `${customer.f_name || ''} ${customer.l_name || ''} ${customer.patronymic || ''}`.trim(),
        phone: customer.phoneNumber,
        email: customer.email
      }));
      setCustomers(customersData);
        return axios.get('https://mire.stk8s.66bit.ru/api/v1/manager/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      })
      .then(response => {
        console.log(response)
        console.log(response.data);
        setProfileId(response.data.id);
        return response.data.id; 
      })
      .catch(error => console.error('ооооооооошибкааааа', error));
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase())
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
    setNewCustomer({...newCustomer, [e.target.name]: e.target.value});
  };

  const handleAddCustomer = () => {
    const { name, phone, email, password, company_name } = newCustomer;

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
  
    const customerData = {
      f_name,
      l_name,
      patronymic,
      phoneNumber: phone,
      email,
      password,
      companyName: company_name || '',
    };
  
    axios.post(`https://mire.stk8s.66bit.ru/api/v1/auth/register/client/${profileId}`, customerData)
    .then(response => {
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      setModalIsOpen(false);
    })
    .catch(error => console.error('ооооооооошибкааааа', error));
  };

  const handleDeleteCustomer = (id) => {
    console.log(id); // вот клиент айди в консоль
    axios.delete(`https://mire.stk8s.66bit.ru/api/v1/client/${id}`)
      .then(response => {
        setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id));
      })
      .catch(error => console.error('аааашибка', error));
  };

  return (
    <div>
      <HeaderM />
      <h1 className ="inner-heading-lists">Список заказчиков</h1>
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
        <div className="lists-container">
          {filteredCustomers.map((customer, index) => (
            <div key={index} className="customer">
              <p>{customer.name}</p>
              <p>Телефон: {customer.phone}</p>
              <p>Email: {customer.email}</p>
              <img src={minus} className="minus-image" alt="minus" onClick={() => handleDeleteCustomer(customer.id)} />
            </div>    
          ))}
        </div>
        <button className='add' onClick={handleAddClick}>Добавить заказчика</button>
      </form>

      <Modal className='modal-list' isOpen={modalIsOpen} onRequestClose={handleModalClose}>
        <h2>Добавление заказчика</h2>
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
          <label className="lists-item">Название компании:
          <input className="inp-lists" type="text" name="company_name" placeholder="Название компании" onChange={handleInputChange} />
          </label>

        </form>
        <button className='add' onClick={handleAddCustomer}>Добавить</button>
      </Modal>
    </div>
  );
}

export default CustomerList;