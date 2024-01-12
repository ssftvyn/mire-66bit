import React, { useState, useEffect, useRef } from 'react';
import '../styles/view projects.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import close from '../images/close.svg';

import searchimg from '../images/search.svg';
import plus from '../images/plus.svg';

import HeaderM from '../components/HeaderM';

const ProjectsList = () => {
    const [search, setSearch] = useState('');
    const searchInputRef = useRef(null);
    const [profileId, setProfileId] = useState(null);
    const [projects, setProjects] = useState([]);

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
      
        fetchProfile().then(managerId => {
          axios.get(`https://mire.stk8s.66bit.ru/api/v1/project/${managerId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }).then(response => {
            console.log(response.data);
            setProjects(response.data); 
          }).catch(error => {
            console.error(error);
          });
        });
      }, []);
      
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearchIconClick = () => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      };

      const projectTypeTranslation = {
        DESIGN: 'Дизайн',
        ADVERTISEMENT: 'Реклама',
        DEVELOPMENT: 'Разработка',
        SEMI_SUPPORT: 'Полуподдержка',
        SEO: 'SEO',
        SMM: 'СММ',
      };

      const handleDelete = (event, projectId) => {
        event.stopPropagation(); // предотвращаем всплытие события
      
        axios.delete(`https://mire.stk8s.66bit.ru/api/v1/project/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log(response.data);
          // обновляем список проектов после удаления
          setProjects(projects.filter(project => project.id !== projectId));
        })
        .catch(error => {
          console.error(error);
        });
      };
      

    return (
        <div>
            <HeaderM />
            <h1 className ="inner-heading-plist">Просмотр проектов</h1>
            <form className="form-plist">
                <h2 className="plist-label"> Выберите проект:</h2>
                <div className="search-container">
                    <input className='search-inp' ref={searchInputRef} type='text' placeholder='Поиск по названию' value={search} onChange={e => setSearch(e.target.value)} />
                    <img
          src={searchimg}
          alt="search"
          className="search-icon"
          onClick={handleSearchIconClick}
        />
                </div>
                <div className="project-container">
                {filteredProjects.map(project => (
  <Link to={`/TaskTableManager/${project.id}`} key={project.id} onClick={() => localStorage.setItem('currentProjectName', project.name)}>
<div className="project-template">
                      <p>{project.name}</p>
                      <p className='type-project'>{projectTypeTranslation[project.type]}</p>
                      <div className='project-template-inside'>
                        <p>{project.companyName}</p>
                        <p>В работе</p>
                      <p>{project.clientFullName}</p>
                      <img src={close} className="close-image-proj" alt="close" onClick={(e) => handleDelete(e, project.id)} />
                      </div>
                    </div>
                  </Link>
                ))}
                </div>
                <Link to="/projectcreate">
                    <img src={plus} className="plus-image" alt="plus" />
                </Link>
            </form>
        </div>
    );
};

export default ProjectsList;