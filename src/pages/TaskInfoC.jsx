import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/taskinfo.css';
import { useParams, useNavigate } from 'react-router-dom';

import HeaderC from '../components/HeaderC';

const TaskInfoClient = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskInfo = async () => {
      try {
        const response = await axios.get(`https://mire.stk8s.66bit.ru/api/v1/task/${id}`);
        setTask(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTaskInfo();
  }, [id]);


  const handleBackButtonClick = () => {
    navigate(-1);
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <HeaderC />
      <h1 className ="inner-heading-plist">Информация о задаче</h1>
      <body>
        <section className='jopa'>
          <div className='task-info'>
            <div className='task-type'>
            <h3>Название задачи</h3>
            <span>{task.name}</span>
             <h3>Тип задачи</h3>
              <h3>{task.label}</h3>
              <h3>Дата дедлайна</h3>
              <p className='date-task'>{task.deadline_date}</p>
              <div className='urgent'></div>
            </div>
            <div className='participants'>
              <h3>Описание задачи</h3>
              <p className='team-info'>{task.description}</p>
            </div>
          </div>
        </section>
        <button className="button-back" onClick={handleBackButtonClick}>Вернуться к таблице задач</button>
      </body>
    </main>
  );
};

export default TaskInfoClient;