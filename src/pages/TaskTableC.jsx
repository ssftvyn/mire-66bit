import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../styles/tasktable.css';
import axios from 'axios';

import HeaderC from '../components/HeaderC';

const projectName = localStorage.getItem('currentProjectName');

const Table = () => {
  const { projectId } = useParams();
  console.log(projectId)

  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    label: '',
    deadline_date: '',
  });

  const taskTypeTranslation = {
    design: 'Дизайн',
    analytics: 'Аналитика',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://mire.stk8s.66bit.ru/api/v1/task/project/${projectId}`);
        console.log(response.data);
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [projectId]);

  const [sortType, setSortType] = useState('asc');

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const onDragEnd = (result) => {
  };

  return (
    <body>
      <HeaderC />
      <div className="controls">
        <div></div>
      <h2>{projectName}</h2>
        <div className="sort-dropdown">
          <label htmlFor="sort">Сортировка п типу</label>
          <select id="sort" required onChange={handleSortChange}>
            <option value="asc">От А до Я</option>
            <option value="desc">От Я до А</option>
          </select>
        </div>
      </div>

      <div className="wrapper">
  {Object.keys(tasks).map((statusKey, index) => (
    <ul className='list'>
      <li className='list-caption'>{['Новые', 'В процессе', 'Утверждение', 'Готовые'][index]}</li>
      {tasks[statusKey] && tasks[statusKey]
        .sort((a, b) => sortType === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)) // Сортировка по типу
        .map((task, index) => (
          <li className='list-cell'>
<Link to={`/TaskInfoClient/${task.id}`} key={task.id}>
  <div className='list-card'>
    <div className='list-card-header'>
      <span>{task.name}</span>
    </div>
    <div className='list-card-info'>
      <span className='date'>{task.deadline_date}</span>
      <div className='line'></div>
      <span className='type'>{taskTypeTranslation[task.label]}</span>
    </div>
  </div>
</Link>
          </li>
        ))}
    </ul>
  ))}
</div>
    </body>
  );
};


export default Table;  