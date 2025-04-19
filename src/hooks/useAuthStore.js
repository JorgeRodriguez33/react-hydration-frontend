import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store/auth/authSlice'; 
import {login} from '../api/serverApi'

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ username, password }) => {
     //   dispatch( onChecking() );
        try {
            console.log("data: ");
            const data = await login({ username, password });
            console.log("data: ",data);
            dispatch( onLogin({ name: username }) );
            
        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => { 
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }


    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    }



    return {
        //* Propiedades
        errorMessage,
        status, 
        user, 

        //* Métodos
        startLogin,
        startLogout,
    }

}