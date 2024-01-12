import React from 'react';
import '../styles/report.css';
import HeaderC from '../components/HeaderC';

const Report = () => {
    return (
        <main>
            <HeaderC />
          <h1 className="inner-heading-report">Отчет по проекту</h1>
          <body>
          <section className='report-section'>
            <div className='project-name-report'>
              Название проекта
            </div>
            <div className='report-info'>
                <div className='project-type'>
                    <h3>Тип проекта</h3>
                </div>
                <div className='client'>
                    <h3>Заказчик</h3>
                </div>
                <div className='ready-made'>
                    <h3>Выполненные задачи:</h3>
                </div>

                <div className='team-report'>
                    <h3>Команда</h3>
                </div>
                <div className='deadline'>
                    <h3>Дедлайн</h3>
                </div>
                <div className='task-report'>
                    <div>
                        <p>ЗадачаN</p>
                    </div>
                    <div>
                        <p>ЗадачаN</p>
                    </div>
                    <div>
                        <p>ЗадачаN</p>
                    </div>
                </div>

                <div className='project-description-report'>
                    <h3>Описание проекта:</h3>
                    <p className='description-text-report'>Информация о проекте</p>
                </div>
            </div>
          </section>  
          </body> 
        </main>
      );
};

export default Report;  