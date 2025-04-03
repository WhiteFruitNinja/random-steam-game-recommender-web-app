import React, { useEffect, useState, useContext } from 'react';
import SteamService from '../service/SteamService';
import { AuthContext } from '../context/AuthContext';
import HistoryService from '../service/HistoryService';
import CommentsComponent from './CommentsComponent';

const SteamApp = ( onFormSubmit, customSteamAppId ) => {
    const [steamAppData, setSteamAppData] = useState(null);
    const [histories, setHistories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn, handleLogout, userId, username } = useContext(AuthContext);

    // Fetch steam app function
    const fetchSteamApp = async (attempt = 1) => {
        setIsLoading(true); // Indicate loading state
        const maxAttempts = 10; // Maximum number of attempts
        const delay = 2000; // Delay in milliseconds (2000 milliseconds = 2 seconds)
    
        try {
            // Wait for the asynchronous operation to complete
            const data = await SteamService.getSteamApp();
    
            // Check if the data is valid (you may want to modify this based on actual API response validation)
            if (!data.success || !data || !data.data.developers || !data.data.publishers || !data.data.short_description) {
                console.log(data);
                throw new Error("Steam app not found.");
            }
    
            // Set the fetched data to state
            setSteamAppData(data);
    
        } catch (error) {
            console.error("Error fetching steam app:", error);
    
            // Check if we've exceeded the maximum number of attempts
            if (attempt < maxAttempts) {
                // Wait before retrying (using a Promise to create a delay)
                await new Promise(resolve => setTimeout(resolve, delay));
    
                // Attempt to fetch again, incrementing the attempt counter
                return fetchSteamApp(attempt + 1); // Here, we're calling the function again with attempt + 1
            } else {
                // Handle the error after max attempts reached
                console.error("Max attempts reached. Could not fetch Steam app.");
                // Optionally set an error state here or show an error message to the user
            }
        } finally {
            // Regardless of success or failure, set loading to false
            setIsLoading(false);
        }
    };

    const fetchSteamAppById = async (id) => {
        setIsLoading(true); // Indicate loading state
        try {
            // Wait for the asynchronous operation to complete
            const data = await SteamService.getSteamAppById(id);
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

    const fetchHistories = async (userId) => {
        const historyList = await HistoryService.getHistoriesByUser(userId);
        setHistories(historyList);
    };

    const fetchHistory = async (id) => {
        const history = await HistoryService.getHistoryById(id);
        return history;
    }

    /*const onFormSubmit = async ( steamAppId ) => {
        fetchSteamAppById(steamAppId);
    };*/

    useEffect(() => {
        // Only fetch once when the component mounts
        fetchSteamApp();
        if (isLoggedIn) {
            fetchHistories(userId);
        }

    }, []); // Empty dependency array to run this effect only once.

    useEffect(() => {
        if (onFormSubmit.customSteamAppId) {  
            fetchSteamAppById(onFormSubmit.customSteamAppId);
            console.log(onFormSubmit.customSteamAppId);
        }
    }, [onFormSubmit.customSteamAppId]);

    useEffect(() => {
        // This effect runs whenever steamAppData changes
        if (steamAppData && (isLoggedIn && (
            !steamAppData.data.success || 
            !steamAppData.data.developers || 
            !steamAppData.data.publishers || 
            !steamAppData.data.short_description))) {
            HistoryService.createHistory(steamAppData.data.steam_appid, userId);
            fetchHistories(userId);
        }
    }, [steamAppData, isLoggedIn]);

    // Handle next app
    const handleNextApp = (e) => {
        e.preventDefault();
        if (!isLoading) {
            fetchSteamApp(); // Initiate fetching a new app
            if (isLoggedIn && (!steamAppData.data.success || !steamAppData.data || !steamAppData.data.developers || !steamAppData.data.publishers || !steamAppData.data.short_description)) {
                fetchHistories(userId);
            }

        }
    };

    const HandleAppFromHistory = (e, id) => {
        e.preventDefault();
        if (!isLoading) {
            fetchSteamAppById(id);
        }
    }

    return (
        <div>
            {steamAppData ? (
                <>
                    <div className='main-container'>
                        <div className={`bg-light rounded`} style={{ width: '60%', margin: 'auto', backgroundColor: 'white', padding: '10px' }} >
                            <div>
                               <img 
                               src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppData.data.steam_appid}/header.jpg`}
                               alt="SteamApp"
                               className='card-img-top'
                               />
                            </div>
                            <div className={`card-body`} >
                              <div>
                                  <a href={`https://store.steampowered.com/app/${steamAppData.data.steam_appid}`} target="_blank" rel="noreferrer" ><h4>{steamAppData.data.name}</h4></a>
                                  <h5>{steamAppData.data.developers.join(', ')}</h5>
                                  <h5>{steamAppData.data.publishers.join(', ')}</h5>
                                  <p>{steamAppData.data.short_description}</p>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#commentsModal" className='btn btn-dark' >Comments</button>
                                <form onSubmit={handleNextApp} style={{textAlign: 'right'}}>
                                    <button type="submit" className='btn btn-dark' >Next</button>
                                </form>
                              </div>
                            </div>
                        </div>
                        {isLoggedIn ? (
                            <>
                                <div className='history-box bg-light' style={{ width: '30vh', textAlign: 'center', height: '100vh', paddingTop: '50px' }}>
                                    <h1>History</h1>
                                    <div className='bg-dark rounded' style={{ width: '28vh', margin: 'auto', height: '67vh' }}>
                                        {histories.slice(0).reverse().slice(0, 5).map((history) => (
                                            <div key={history.id} style={{ margin: 'auto', maxWidth: '31vh'}}>
                                                <button onClick={(e) => HandleAppFromHistory(e, history.steamAppId)} style={{maxWidth: '100%', maxHeight: '100%', backgroundColor: 'transparent'}} className='btn'>
                                                    <img
                                                    className='rounded'
                                                    style={{ width: '100%'}}
                                                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${history.steamAppId}/header.jpg`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <h1>Expand</h1>
                                </div>
                            </>
                        ) : (<></>)}
                        <CommentsComponent steamAppId={steamAppData.data.steam_appid} />
                    </div>
                </>
            ) : (
                <>
                    <h2>Loading...</h2>
                </>
            )}
        </div>
    );
};

export default SteamApp;