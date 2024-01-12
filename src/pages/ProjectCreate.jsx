import React, { useState, useEffect } from 'react';
import '../styles/projectcreate.css';
import axios from 'axios';

import HeaderM from '../components/HeaderM';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState(null);
  const [clients, setClients] = useState(null);
  const [projectData, setProjectData] = useState({
    name: '',
    type: '',
    client_id: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://mire.stk8s.66bit.ru/api/v1/manager/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response)
        console.log(response.data);
        setProfileId(response.data.id);
        return response.data.id; 
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchProfile().then(async (id) => {
      try {
        const response = await axios.get(`https://mire.stk8s.66bit.ru/api/v1/manager/clients/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response.data); 
        setClients(response.data);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectData.name || !projectData.type || !projectData.client_id) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      const response = await axios.post(`https://mire.stk8s.66bit.ru/api/v1/project/create/${profileId}`, projectData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response);
      console.log(response.data);
      navigate('/ProjectListManager');
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      <HeaderM />
      <h1 className="inner-heading-create">Создание проекта</h1>
      <section>
      <form className="project-form" onSubmit={handleSubmit}>
          <div className='project-name'>
          <input className="name-inp" type="text" id="name" name="projectName" placeholder="Название проекта" onChange={handleChange} required />
          </div>
          <div className='container-create'>
            <div className='container-options'>
            <div className='client-cont'>
            <label className="client_id">Выбор типа проекта:</label>
            <select className='sel-item' id="type" name="type" onChange={handleChange} required>
              <option value="">Выберите тип проекта</option>
              <option value="DESIGN">Дизайн</option>
              <option value="ADVERTISEMENT">Реклама</option>
              <option value="DEVELOPMENT">Разработка</option>
              <option value="SEMI_SUPPORT">Полуподдержка</option>
              <option value="SEO">SEO</option>
              <option value="SMM">СММ</option>
            </select>
            </div> 
            <div className='client-cont'>
            <label className="client_id">Выбор заказчика:</label>
              <select className='sel-item' id="client_id" name="client_id" onChange={handleChange} required>
              <option value="">Выберите заказчика</option>
              {clients && clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.f_name} {client.l_name} {client.patronymic}
                </option>
              ))}              
            </select>  
            </div>     
              <button className="submit" type="submit">Создать проект</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Create;