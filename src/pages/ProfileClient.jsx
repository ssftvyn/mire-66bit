import React, { useState, useEffect } from 'react';
import '../styles/profile.css';
import axios from 'axios';
import HeaderC from '../components/HeaderC';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    id: 0,
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
    contactInfo: '',
  });

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
    navigate('/');
  };

  const [editing, setEditing] = useState('');

  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://mire.stk8s.66bit.ru/api/v1/client/profile`);
        console.log(response.data);
        setUser({
          id: response.data.id,
          email: response.data.email,
          fullName: (response.data.f_name || '') + ' ' + (response.data.l_name || '') + ' ' + (response.data.patronymic || ''),
          password: response.data.password,
          phoneNumber: response.data.phoneNumber,
          contactInfo: response.data.contactInfo
        });
        localStorage.setItem('fullName', (response.data.f_name || '') + ' ' + (response.data.l_name || '') + ' ' + (response.data.patronymic || ''));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (field) => {
    setEditing(field);
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const clientId = user.id;
      const response = await axios.put(`https://mire.stk8s.66bit.ru/api/v1/client/${clientId}`, user, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    setEditing('');
  };

  return (
    <div className="profile">
      <HeaderC fullName={user.fullName} />
      <div>
  <h1 className='inner-heading-profile'>Личный кабинет</h1>
</div>
      <form className="form-profile" onSubmit={handleSave}>
        <p> ID пользователя: {user.id} </p>
        <label className="profile-item email-profile"> Почта:
          <input className="inp-profile" type="email" name="email" value={user.email || ''} onChange={handleChange} disabled={editing !== 'email'} />
        </label>
        <label className="profile-item name-profile">ФИО:
          <input className="inp-profile" type="text" name="fullName" value={user.fullName || ''} onChange={handleChange} disabled={editing !== 'fullName'} />
          {editing === 'fullName' ? <button type="button" className="save-button-profile" onClick={handleSave}>Сохранить</button> : <button type="button" className="edit-button-profile" onClick={() => handleEdit('fullName')}>Изменить</button>}
        </label>
        <label className="profile-item password-profile">Пароль:
          <input className="inp-profile" type="password" name="password" value={user.password} onChange={handleChange} disabled={editing !== 'password'} />
        </label>
        <label className="profile-item phone-profile">Телефон:
          <input className="inp-profile" type="tel" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} disabled={editing !== 'phoneNumber'} />
          {editing === 'phoneNumber' ? <button type="button" className="save-button-profile" onClick={handleSave}>Сохранить</button> : <button type="button" className="edit-button-profile" onClick={() => handleEdit('phoneNumber')}>Изменить</button>}
        </label>
        <label className="profile-item contact-profile">Контактные данные:
          <textarea className="inp-profile" name="contactInfo" value={user.contactInfo} onChange={handleChange} disabled={editing !== 'contactInfo'} />
          {editing === 'contactInfo' ? <button type="button" className="save-button-profile" onClick={handleSave}>Сохранить</button> : <button type="button" className="edit-button-profile" onClick={() => handleEdit('contactInfo')}>Изменить</button>}
        </label>

        <button onClick={handleLogout} className="exit-button-profile" type="button">Выйти</button>
      </form>
    </div>
  );
};

export default Profile;