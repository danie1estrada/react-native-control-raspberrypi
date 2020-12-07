import React, { createContext, useState } from 'react'

export const NotesContext = createContext();

export const NotesProvider = (props) => {
    const [notes, setNotes] = useState([]);

    return (
        <NotesContext.Provider value={[notes, setNotes]}>
            {props.children}
        </NotesContext.Provider>
    );
};
