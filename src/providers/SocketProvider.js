import React, { createContext } from 'react';
import io from 'socket.io-client';
import { HOST } from '../../Constants';

export const SocketContext = createContext();

export const SocketProvider = props => {
    const socket = io.connect(HOST);
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};
