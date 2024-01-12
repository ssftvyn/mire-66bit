import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/tasktable.css';
import '../styles/taskcreate.css';
import axios from 'axios';
import edit from '../images/edit.svg';

import HeaderM from '../components/HeaderM';

const projectName = localStorage.getItem('currentProjectName');

const Table = () => {
  const { projectId } = useParams();
  console.log(projectId)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    label: '',
    deadline_date: '',
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
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

    const createTask = async () => {

      if (!taskData.name || !taskData.description || !taskData.label || !taskData.deadline_date) {
        alert('Пожалуйста, заполните все поля');
        return;
      }  
      
      try {
        const response = await axios.post(`https://mire.stk8s.66bit.ru/api/v1/task/create/${projectId}`, taskData);
        console.log(response);
        console.log(response.data);
        if (response.status === 200) {
          console.log("OK create")
          
          if (response.data.task) {
            setTasks(prevTasks => ({
              ...prevTasks,
              [response.data.task.status]: [...prevTasks[response.data.task.status], response.data.task]
            }));
        
            // Вызовите getTasksByColumn после успешного создания задачи
            getTasksByColumn(response.data.task.status);
          } else {
            console.error('Task data is not received');
          }
        } else {
          console.error('Task data is not received');
        }
        closeModal();
      } catch (error) {
        console.error(error);
      }
    };

    const moveTask = async (taskId, columnId) => {
      try {
        await axios.put(`https://mire.stk8s.66bit.ru/api/v1/task/${taskId}/move/${columnId}`);
      } catch (error) {
        console.error(error);
      }
    };
    
    const getTasksByColumn = async (columnId) => {
      try {
        const response = await axios.get(`https://mire.stk8s.66bit.ru/api/v1/task/column/${columnId}`);
        console.log(response.data);
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

  const columns = Object.keys(tasks);
  const statusToIdMap = columns.map((column, index) => index);
  console.log(statusToIdMap);

  const [sortType, setSortType] = useState('asc');

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const openEditModal = async (id) => {
    try {
      const response = await axios.get(`https://mire.stk8s.66bit.ru/api/v1/task/${id}`);
      setTaskData(response.data);
      setTaskId(id); // Устанавливаем ID задачи
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };


  const closeEditModal = () => {
    setTaskId(null);
    setIsModalOpen(false);
  };
  
  const updateTask = async () => {
    try {
      const response = await axios.put(`https://mire.stk8s.66bit.ru/api/v1/task/${taskId}`, taskData);
      console.log(response);
      if (response.status === 200) {
        // Задача успешно обновлена
      } else {
        console.error('Task data is not updated');
      }
      closeEditModal();
    } catch (error) {
      console.error(error);
    }
  };

  const taskTypeTranslation = {
    design: 'Дизайн',
    analytics: 'Аналитика',
  };
  

  const onDragEnd = (result) => {
  };

  const [taskId, setTaskId] = useState(null);
    
return (
  <body>
    <HeaderM />
      <div className="controls">
      <button className="report-button" onClick={openModal}>Добавить задачу</button>
      <h2>{projectName}</h2>
          <div className="sort-dropdown">
          <label htmlFor="sort">Сортировка по типу</label>
          <select id="sort" required onChange={handleSortChange}>
<option value="asc">От А до Я</option>
<option value="desc">От Я до А</option>
</select>
          </div>
      </div>

      {isModalOpen && (
        <div className='task-create'>
          <input className='task-name' type="text" name="name" value={taskData.name} onChange={handleInputChange} placeholder="Название задачи" />
        <div className='task-type'>
          <label htmlFor="type">Метка</label>
          <select className='select' name="label" value={taskData.label} onChange={handleInputChange}>
            <option value="design">Дизайн</option>
            <option value="analytics">Аналитика</option>
          </select>
          <input className='deadline' type="date" name="deadline_date" value={taskData.deadline_date} onChange={handleInputChange} />
        </div>
        <div className='participants'>
            <h3>Описание задачи</h3>
            <textarea name="description" value={taskData.description} onChange={handleInputChange} />
          </div>
          <button className='task-modal' onClick={closeModal}>Закрыть</button>
          <button className='task-modal' onClick={taskId ? updateTask : createTask}>
  {taskId ? 'Обновить задачу' : 'Создать задачу'}
</button>
      </div>
      )}
    <div className="wrapper">
      {Object.keys(tasks).map((statusKey, index) => (
        <ul className='list'>
          <li className='list-caption'>{['Новые', 'В процессе', 'Утверждение', 'Готовые'][index]}</li>
          {tasks[statusKey] && tasks[statusKey]
            .sort((a, b) => sortType === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)) // Сортировка по типу
            .map((task, index) => (
              <li className='list-cell'>
  <div className='list-card'>
    <div className='list-card-header'>
      <span>{task.name}</span> 
      <img src={edit} alt="edit" className="edit-icon" onClick={() => openEditModal(task.id)} />
    </div>
    <div className='list-card-info'>
      <span className='date'>{task.deadline_date}</span>
      <div className='line'></div>
      <span className='type'>{taskTypeTranslation[task.label]}</span>
    </div>
  </div>
</li>
            ))}
        </ul>
      ))}
    </div>
  </body>
);
};

export default Table;


