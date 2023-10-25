import React, { useState, createContext, useContext } from "react";

const sessionContext = createContext();
export const useCustomContext = () => useContext(sessionContext);

export const ContextSessionProvider = ({ children }) => {
	const [tokenEx, setTokenEx] = useState(false)
	const [messageError, setMessageError] = useState('')
	const distribution = { tokenEx, setTokenEx, messageError, setMessageError };
	return <sessionContext.Provider value={distribution}>{children}</sessionContext.Provider>;
}