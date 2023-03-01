import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useRef, useState } from 'react';
const Home = () => {
    const [roomId, setRoomId] = useState(null);
    const navigator = useNavigate();
    useEffect(() => {
        (async () => {
            if (!roomId) {
                console.log("entered")
                const res = await axios.get("http://localhost:5000");
                setRoomId(res.data);
                alert("navigated")
                navigator("/" + res.data);
            }
        })();
    }, [])

    return (
        <h1>Loading</h1>
    );
};

export default Home;
