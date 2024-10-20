// import { io, Socket } from 'socket.io-client';
// import { AppActions, AppState } from './state';

// export const socketIOUrl = `http://localhost:3000/games`;

// type CreateSocketOptions = {
//   socketIOUrl: string;
//   state: AppState;
//   actions: AppActions;
// };

// export const createSocketWithHandlers = ({
//   socketIOUrl,
//   state,
//   actions,
// }: CreateSocketOptions): Socket => {
//   console.log(`Creating socket with accessToken: ${state.accessToken}`);
//   const socket = io(socketIOUrl, {
//     auth: {
//       token: state.accessToken,
//     },
//     transports: ['websocket', 'polling'],
//   });

//   socket.on('connect', () => {
//     console.log(
//       `Connected with socket ID: ${socket.id}. UserID: ${state.me?.id} will join room ${state.poll?.id}`
//     );

//   });

//   socket.on('connect_error', () => {
//     console.log(`Failed to connect socket`);

//   });

//   socket.on('exception', (error) => {
//     console.log('WS exception: ', error);
//   });

//   socket.on('poll_updated', (poll) => {
//     console.log('event: "poll_updated" received', poll);
//     actions.updatePoll(poll);
//   });

//   return socket;
// };