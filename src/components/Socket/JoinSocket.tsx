import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTokenContext } from '../../Context/Context';
import { useInstitutionContext } from '../../Context/InstitutionContext';
import {toast} from 'react-toastify'



const JoinSocket = () => {
  const { instId } = useInstitutionContext();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!instId || instId === 0) return;

    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected with ID:', socketRef.current?.id);

      socketRef.current?.emit('join_room', { room: `institution_${instId}` });
      console.log(`📨 Emitting join_room: institution_${instId}`);
    });

    socketRef.current.on('joined_room', (data) => {
      console.log(`✅ Joined Room: ${data.room}`);
    });
    socketRef.current.on('school_alert', (data) => {
      toast.warning(data.message)
    })
    return () => {
      socketRef.current?.disconnect();
      console.log('❌ Socket disconnected');
    };
  }, [instId]);

  return null;
};

export default JoinSocket;

