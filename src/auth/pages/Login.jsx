import React, { useEffect } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import Swal from 'sweetalert2';
import './login.css';
import { useForm } from "../../hooks/useForm";

const loginFormFields = {
  username: 'user', 
  password: 'pass', 
}

function Login() {

  const { startLogin, errorMessage } = useAuthStore();

  const { username, password, onInputChange: onLoginInputChange } = useForm(loginFormFields);


  const loginSubmit = (event) => {
    event.preventDefault(); // Previene que el formulario haga un GET
    console.log("process.env.PORT : ",process.env.PORT );
    console.log("Formulario enviado, username:", username, "password:", password);

    startLogin({ username: username, password: password });
};
  useEffect(() => {
    if (errorMessage !== undefined) {
        Swal.fire('Error en la autenticación', errorMessage, 'error'); 
    }
}, [errorMessage]) 


  return (
    <>
     <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Iniciar sesión</h3>
                    <form onSubmit={loginSubmit}>
                        <div className="form-group mb-2">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="usuario"
                                name="username"
                                value={username}
                                onChange={onLoginInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="password"
                                value={password}
                                onChange={onLoginInputChange}
                            />
                        </div>
                      
                        <div className="d-grid gap-2">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  );
}

export default Login;