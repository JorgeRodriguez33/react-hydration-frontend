import React from 'react'
import Map from '../Map';
import Login from '../auth/pages/Login';
import { useAuthStore } from '../hooks/useAuthStore';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRouters = () => {

    const { status } = useAuthStore();

    return (
        <Routes>
            {
                (status === 'not-authenticated')  
                    ? (
                        <>
                            <Route path="/" element={ <Login /> } /> 
                            <Route path="/*" element={ <Navigate to="/" /> } /> 
                        </>
                    )
                    : (
                        <>
                            <Route path="/" element={ <Map /> } /> 
                            <Route path="/*" element={ <Navigate to="/" /> } /> 
                        </>
                    )
            }
        </Routes>
    );
}
