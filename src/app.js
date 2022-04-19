import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './firebaseConfig';

//Components
import ContentPage from './pages/contentPage.js';
import LoginPage from './pages/login/loginPage.js';
import SignupPage from './pages/signup/signupPage.js';
import NotFoundPage from './pages/notFoundPage.js';
import TodoPage from './pages/todo/todoPage.js';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ContentPage contentType="priorities" />} />
                <Route path="/priorities" element={<ContentPage contentType="priorities" />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/review" element={<ContentPage contentType="review" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

ReacDOM.render(
    <App />, document.getElementById("page_root")
);