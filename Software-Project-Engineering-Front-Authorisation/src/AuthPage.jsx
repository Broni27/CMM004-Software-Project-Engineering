import React, { useState } from "react";
import Navbar from "./Navbar";
import "./Styles.css";
import Page1 from "./Page1.jsx";
import Page2 from "./Page2.jsx";
import InputContainer from "./InputContainer.jsx";

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    login: "",
    password: "",
    confirmPassword: "",
    realName: "", // Добавлено новое поле
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      login: "",
      password: "",
      confirmPassword: "",
      realName: "", // Сбрасываем значение realName
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login:", formData);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Registration:", formData);
    }
  };

  return (
    <>
      <Navbar
        logoPath="path/to/your/logo.svg"
        profileIconPath="path/to/your/profile-icon.svg"
        onPageChange={handlePageChange}
      />
      <InputContainer />
    </>
  );
};

export default AuthPage;
