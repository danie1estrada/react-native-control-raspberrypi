import io from 'socket.io-client';
import { HOST } from '../../Constants';

const socket = io.connect(HOST);
export const useSocket = () => {
    return socket;
};