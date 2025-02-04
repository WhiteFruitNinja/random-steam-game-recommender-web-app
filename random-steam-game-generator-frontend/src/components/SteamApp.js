import React, { useEffect, useState } from 'react';
import SteamService from '../service/SteamService';

const SteamApp = () => {
    const [steamAppData, setSteamAppData] = useState(null);

    const fetchSteamApp = async () => {
        const steamAppData = await SteamService.getSteamApp();
        setSteamAppData(steamAppData);
    };

    useEffect(() => {
        fetchSteamApp();
    }, []);

    return (
        <div>
            {steamAppData ? (
                <>
                    <img 
                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppData.appid}/header.jpg`}
                        alt="SteamApp"
                    />
                    <a href={`https://store.steampowered.com/app/${steamAppData.appid}`} target="_blank" rel="noreferrer"><h4>{steamAppData.name}</h4></a>
                    <h4>{steamAppData.appid}</h4>
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
};

export default SteamApp;