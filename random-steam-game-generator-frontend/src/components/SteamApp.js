import React, { useEffect, useState } from 'react';
import SteamService from '../service/SteamService';

const SteamApp = () => {
    const [steamAppData, setSteamAppData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch steam app function
    const fetchSteamApp = async () => {
        setIsLoading(true); // Indicate loading state
        try {
            // Wait for the asynchronous operation to complete
            const data = await SteamService.getSteamApp();
            // Set the fetched data to state
            setSteamAppData(data);
        } catch (error) {
            console.error("Error fetching steam app:", error);
            // Handle errors or set an error state here
        } finally {
            // Regardless of success or failure, set loading to false
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch once when the component mounts
        fetchSteamApp();
    }, []); // Empty dependency array to run this effect only once.

    // Handle next app
    const handleNextApp = (e) => {
        e.preventDefault();
        if (!isLoading) {
            fetchSteamApp(); // Initiate fetching a new app
        }
    };

    return (
        <div>
            {steamAppData ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBlock: '10px', textAlign: 'left' }}>
                        <div className={`card bs-dark`} style={{ maxWidth: '500px' }} >
                        <div>
                            <img 
                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppData.data.steam_appid}/header.jpg`}
                            alt="SteamApp"
                            className='card-img-top'
                            />
                        </div>
                          <div className={`card-body`} >
                            <div>
                                <h4>{steamAppData.data.steam_appid}</h4>
                                <a href={`https://store.steampowered.com/app/${steamAppData.data.steam_appid}`} target="_blank" rel="noreferrer" ><h4>{steamAppData.data.name}</h4></a>
                                <h5>{steamAppData.data.developers.join(', ')}</h5>
                                <h5>{steamAppData.data.publishers.join(', ')}</h5>
                                <p>{steamAppData.data.short_description}</p>
                            </div>
                            <form onSubmit={handleNextApp} style={{textAlign: 'right'}}>
                                <button type="submit" className='btn btn-dark' >Next</button>
                            </form>
                          </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2>Loading...</h2>
                    <form onSubmit={(e) => { e.preventDefault(); fetchSteamApp(); }}>
                        <button type="submit" className='btn btn-dark'>Next</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default SteamApp;