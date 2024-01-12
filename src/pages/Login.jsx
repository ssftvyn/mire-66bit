import React, { useState } from 'react';
import axios from 'axios';
import '../styles/auth.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';


import eyeOpenImage from '../images/Eye.svg';
import eyeClosedImage from '../images/Eye-Off.svg';

const Login = () => {
    const [email, setEmail] = useState('example@mail.ru');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();

    Modal.setAppElement('#root');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '300px',
            backgroundColor: '#155DA4',
            borderRadius: '10px',
            color: '#fff',
            textAlign: 'center',
        },
    };

    const closeButtonStyles = {
        backgroundColor: '#fff',
        color: '#155DA4', 
        border: 'none',
        padding: '10px 20px', 
        textAlign: 'center', 
        textDecoration: 'none', 
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer', 
        borderRadius: '5px',
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://mire.stk8s.66bit.ru/api/v1/auth/authenticate', {
                email: email,
                password: password
            });
    
            localStorage.setItem('token', response.data.jwtToken);
            localStorage.setItem('role', response.data.role);
      
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwtToken}`;
      
            console.log(`Email: ${email}, Password: ${password}`);
            console.log(response.data)
            console.log(`Token: ${response.data.jwtToken}`); 
    
            switch(response.data.role) {
                case 'CLIENT':
                    navigate('/ClientProfile');
                    break;
                case 'MANAGER':
                    navigate('/ManagerProfile');
                    break;
                case 'ADMIN':
                    navigate('/Managers');
                    break;
                default:
                    console.log('Unknown role');
            }
          } catch (error) {
            console.error(error);
          }
        };

    return (  
        <main className="login">
            <div className="container-login">
                <form className="reg-form-login" onSubmit={handleLogin}>
                    <h1 className="inner-heading-login">Вход в аккаунт</h1>
                    <label className="reg-label-login" htmlFor="reg-name">Почта</label>
                    <input
                        className="name-login"
                        type="text"
                        id="reg-name"
                        name="reg-name"
                        placeholder="Введите почту"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="reg-label-login" htmlFor="reg-pass">Пароль</label>
                    <div className="password-input-container">
                        <input
                            className="password-login"
                            type={showPassword ? "text" : "password"}
                            id="reg-pass"
                            name="reg-pass"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className="show-password-button"
                            type="button"
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? (
                                <img src={eyeOpenImage} className="open" alt="Open Eye" />
                            ) : (
                                <img src={eyeClosedImage} alt="Closed Eye" />
                            )}
                        </button>
                    </div>
                    <button className="button-login" type="submit">Вход</button>
                    <div className="additional-links-login">
                        <a href="#!" style={{ display: 'block' }} className="noacc" onClick={openModal}>У меня ещё нет своего аккаунта...</a>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Contact Info Modal"
            >
                <h2>Тестовый доступ(для проверяющих)</h2>
                <p>Почта: example@mail.ru</p>
                <p>Пароль: 123</p>
                <button onClick={closeModal} style={closeButtonStyles}>Закрыть</button>
            </Modal>
                    </div>
                </form>
            </div>
        </main> 
    );    
};

export default Login;
