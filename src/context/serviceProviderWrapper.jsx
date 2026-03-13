'use client';
import React, { useState } from 'react'
import ServiceContextProvider from './servicesProviderContext'

export default function ServiceProviderWrapper({children}) {
    const [service, setService] = useState('ipqs');
  return (
    <ServiceContextProvider.Provider value={{service, setService}}>
        {children}
    </ServiceContextProvider.Provider>
  )
}
