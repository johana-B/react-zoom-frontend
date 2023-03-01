import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { useParams } from 'react-router-dom';
const Room = ({ roomIdNew }) => {
    let currentId = "";
    const [peers, setPeers] = useState({});
    const socketRef = useRef();
    const myVideoRef = useRef();
    const peersRef = useRef({});
    const peerRef = useRef();
    const videoGridRef = useRef();
    let { roomIdJoined } = useParams();
    const roomId = roomIdNew;
    useEffect(() => {
        socketRef.current = io('/');
        peerRef.current = new Peer(undefined, {
            path: '/peerjs',
            host: '/',
            port: '5000'
        });

        const videoGrid = videoGridRef.current;
        const myVideo = myVideoRef.current;
        myVideo.muted = true;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            myVideo.srcObject = stream;
            myVideo.addEventListener('loadedmetadata', () => {
                myVideo.play();
            });

            peerRef.current.on('call', call => {
                console.log('This peer is being called...');
                call.answer(stream);
                const video = document.createElement('video');
                call.on('stream', userVideoStream => {
                    console.log('This peer is being called...on-stream...');
                    addVideoStream(video, userVideoStream);
                });
            });


            socketRef.current.on('user-connected', userId => {
                if (currentId == userId) return;
                alert("user connected")
                connectToNewUser(userId, stream);
            });
        });

        socketRef.current.on('user-disconnected', userId => {
            alert("user disconected")
            if (peersRef.current[userId]) {
                peersRef.current[userId].close();
            }
        });

        peerRef.current.on('open', id => {
            currentId = id;
            socketRef.current.emit('join-room', roomId, id);
        });

        const connectToNewUser = (userId, stream) => {
            const call = peerRef.current.call(userId, stream);
            const video = document.createElement('video');
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream);
            });
            call.on('close', () => {
                video.remove();
            });
            peersRef.current[userId] = call;
            setPeers(peersRef.current);
        };

        const addVideoStream = (video, stream) => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            videoGrid.append(video);
        };

        return () => {
            socketRef.current.disconnect();
            peerRef.current.destroy();
        };
    }, []);

    return (
        <div>
            <div ref={videoGridRef} id="video-grid">
                {Object.keys(peers).map(peerId => {
                    return (
                        <video key={peerId} playsInline autoPlay />
                    );
                })}
                <video ref={myVideoRef} playsInline autoPlay muted />
            </div>
        </div>
    );
};

export default Room;
