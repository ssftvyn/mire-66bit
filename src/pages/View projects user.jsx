import React, { useState, useEffect, useRef } from 'react';
import '../styles/view projects.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import searchimg from '../images/search.svg';

import HeaderC from '../components/HeaderC';

const ProjectsList = () => {
    const [search, setSearch] = useState('');
    const searchInputRef = useRef(null);
    const [profileId, setProfileId] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get('https://mire.stk8s.66bit.ru/api/v1/client/profile', {
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
      
        fetchProfile().then(clientId => {
          axios.get(`https://mire.stk8s.66bit.ru/api/v1/project/client/${clientId}`, {
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

    return (
        <div>
            <HeaderC />
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
                  <Link to={`/TaskTableClient/${project.id}`} key={project.id} onClick={() => localStorage.setItem('currentProjectName', project.name)}>
                  <div className="project-template" key={project.id}>
                    <p>{project.name}</p>
                    <p className='type-project'>{projectTypeTranslation[project.type]}</p>
                    <div className='project-template-inside'>
                      <p>{project.created_at}</p>
                      <p>В работе</p>
                    </div>
                  </div>
                  </Link>
                ))}
                </div>
            </form>
        </div>
    );
};

export default ProjectsList;