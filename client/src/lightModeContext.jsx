import React, { createContext, useEffect, useState } from 'react'

const lightModeContext = createContext();

export const LightModeProvider = ({ children }) => {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('lightMode') === 'true';
    setLightMode(savedMode);
    document.body.classList.toggle('light-mode', savedMode);
  }, []);

  const togglelightMode = () => {
    setLightMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('lightMode', newMode);
      document.body.classList.toggle('light-mode', newMode);
      return newMode;
    })
  }
  return (
    <lightModeContext.Provider value={{ lightMode, togglelightMode }}>
      {children}
    </lightModeContext.Provider>
  )
}

export default lightModeContext