import React, { useEffect, useState, useContext } from 'react';
import SteamService from '../service/SteamService';
import { AuthContext } from '../context/AuthContext';
import HistoryService from '../service/HistoryService';
import CommentsComponent from './CommentsComponent';
import FavoriteService from '../service/FavoriteService';
import RatingService from '../service/RatingService';

const SteamApp = ( onFormSubmit ) => {
    const [steamAppData, setSteamAppData] = useState(null);
    const [histories, setHistories] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [areRatingsChanged, setAreRatingsChanged] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [ratingsOfLike, setRatingsOfLike] = useState([]);
    const [ratingsOfDislike, setRatingsOfDislike] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isAddedToFavorite, setIsAddedToFavorite] = useState(false);
    const { isLoggedIn, userId } = useContext(AuthContext);


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
    };

    const fetchFavorites = async (id) => {
        const favorites = await FavoriteService.getFavoritesByUser(id);
        setFavorites(favorites);
        if (steamAppData) {
            checkIfAddedToFavorites(favorites, steamAppData.data.steam_appid);
        }
    };

    const fetchRatings = async (id) => {
        const ratings = await RatingService.getRatingsByUser(id);
        const ratingsOfLike = ratings.filter(rating => rating.steamAppId === steamAppData.data.steam_appid && rating.ratingValue === 1);
        const ratingsOfDislike = ratings.filter(rating => rating.steamAppId === steamAppData.data.steam_appid && rating.ratingValue === 2);
        
        console.log(ratingsOfLike);
        console.log(ratingsOfDislike);

        setRatings(ratings);
        setRatingsOfLike(ratingsOfLike);
        setRatingsOfDislike(ratingsOfDislike);

        if (steamAppData) {
            checkIfLikeAddedToRatings(ratings, steamAppData.data.steam_appid);
            checkIfDislikeAddedToRatings(ratings, steamAppData.data.steam_appid);
        }
    };


    useEffect(() => {
        // Only fetch once when the component mounts
        fetchSteamApp();
        
        if (isLoggedIn) {
            fetchHistories(userId);
            fetchFavorites(userId);
            fetchRatings(userId);
            checkIfAddedToFavorites(favorites, steamAppData.data.steam_appid);
            checkIfLikeAddedToRatings(ratings, steamAppData.data.steam_appid);
            checkIfDislikeAddedToRatings(ratings, steamAppData.data.steam_appid);
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
            fetchFavorites(userId);
            fetchRatings(userId);
            checkIfAddedToFavorites(favorites, steamAppData.data.steam_appid);
            checkIfLikeAddedToRatings(ratings, steamAppData.data.steam_appid);
            checkIfDislikeAddedToRatings(ratings, steamAppData.data.steam_appid);

        }

    }, [steamAppData, isLoggedIn, userId]);

    useEffect(() => {
        if (steamAppData && (isLoggedIn && (
            !steamAppData.data.success ||
            !steamAppData.data.developers ||
            !steamAppData.data.publishers ||
            !steamAppData.data.short_description))) {
            fetchRatings(userId);
        }
    }, [isDisliked, isLiked])

    
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

    // Add to favorites
    const addToFavorites = (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            FavoriteService.createFavorite(steamAppData.data.steam_appid, userId);
            setIsAddedToFavorite(true);
        }
    };

    // Remove from favorites
    const removeFromFavorites = async (e) => {
        e.preventDefault();

        if (isLoggedIn) {
            const favorites = await FavoriteService.getFavoritesBySteamAppId(steamAppData.data.steam_appid);
            const favorite = favorites.find(favorite => favorite.userId === userId);
            FavoriteService.deleteFavorite(favorite.id);
            setIsAddedToFavorite(false);
        }
    };

    const addLike = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) return;

        if (isLoggedIn && !isDisliked) {
            RatingService.createRating(steamAppData.data.steam_appid, 1, userId);
            setIsLiked(true);
        } else if (isLoggedIn && isDisliked) {
            const ratings = await RatingService.getRatingsBySteamAppId(steamAppData.data.steam_appid);
            const rating = ratings.find(rating => rating.userId === userId);
            RatingService.updateRating(rating.id, rating.steamAppId, 1, rating.userId);
            setIsDisliked(false);
            setIsLiked(true);
        }

    };

    const removeLike = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) return;

        if (isLoggedIn) {
            try {
                const ratings = await RatingService.getRatingsBySteamAppId(steamAppData.data.steam_appid);
                const rating = ratings.find(rating => rating.userId === userId && rating.ratingValue === 1);
                RatingService.deleteRating(rating.id);
                setIsLiked(false);
            } catch (error) {
                console.error("Error removing like:", error);
            }
        }

    };

    const addDislike = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) return;

        if (isLoggedIn && !isLiked) {
            RatingService.createRating(steamAppData.data.steam_appid, 2, userId);
            setIsDisliked(true);
        } else if (isLoggedIn && isLiked) {
            const ratings = await RatingService.getRatingsBySteamAppId(steamAppData.data.steam_appid);
            const rating = ratings.find(rating => rating.userId === userId);
            console.log(rating);
            RatingService.updateRating(rating.id, rating.steamAppId, 2, rating.userId);
            setIsLiked(false);
            setIsDisliked(true);
        }

    };

    const removeDislike = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) return;

        if (isLoggedIn) {
            try {
                const ratings = await RatingService.getRatingsBySteamAppId(steamAppData.data.steam_appid);
                const rating = ratings.find(rating => rating.userId === userId && rating.ratingValue === 2);
                RatingService.deleteRating(rating.id);
                setIsDisliked(false);
            } catch (error) {
                console.error("Error removing dislike:", error);
            }
        }

    };

    // Is added to favorites
    const checkIfAddedToFavorites = (favorites, steamAppId) => {
        for (let i = 0; i < favorites.length; i++) {
            if (favorites[i].steamAppId === steamAppId) {
                setIsAddedToFavorite(true);
                console.log("i = ", i);
                console.log("isAddedToFavorite =", true);
                return; // Exit once found
            }
        }
        setIsAddedToFavorite(false); // If not found, ensure it's set to false
    };

    // TODO Is added to ratings
    const checkIfLikeAddedToRatings = (ratings, steamAppId) => {
        for (let i = 0; i < ratings.length; i++) {
            if (ratings[i].steamAppId === steamAppId && ratings[i].ratingValue === 1) {
                setIsLiked(true);
                console.log("i = ", i);
                console.log("isAddedToRating =", true);
                return; // Exit once found
            }
        }
        setIsLiked(false);
    }

    const checkIfDislikeAddedToRatings = (ratings, steamAppId) => {
        for (let i = 0; i < ratings.length; i++) {
            if (ratings[i].steamAppId === steamAppId && ratings[i].ratingValue === 2) {
                setIsDisliked(true);
                console.log("i = ", i);
                console.log("isAddedToRating =", true);
                return; // Exit once found
            }
        }
        setIsDisliked(false);
    } 

    const HandleAppFromHistory = async (e, id) => {
        e.preventDefault();
        if (!isLoading) {
            fetchSteamAppById(id);
            /* checkIfAddedToFavorites(id, userId); */
        }
    };

    return (
        <div>
            {steamAppData && !isLoading ? (
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
                              <div>
                              {isLoggedIn ? (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBlock: '10px' }}>
                                  {isLiked ? (
                                  <form onSubmit={removeLike}>
                                    <button type="submit" className='btn btn-dark'>
                                        Like
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                        </svg>
                                    </button>
                                  </form>
                                  ) : (
                                  <form onSubmit={addLike}>
                                    <button type="submit" className='btn btn-dark'>
                                        Like
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                        </svg>
                                    </button>
                                  </form>
                                  )}
                                  <p style={{ marginBlock: 'auto', marginInline: '5px' }}>{ratingsOfLike.length} | {ratingsOfDislike.length}</p>
                                  {isDisliked ? (
                                  <form onSubmit={removeDislike}>
                                    <button type="submit" className='btn btn-dark'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                                            <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591"/>
                                        </svg>
                                        Dislike
                                    </button>
                                  </form>
                                  ) : (
                                  <form onSubmit={addDislike}>
                                    <button type="submit" className='btn btn-dark'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                            <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                                        </svg>
                                        Dislike
                                    </button>
                                  </form>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBlock: '10px' }}>
                                  <button type="submit" className='btn btn-dark' disabled>
                                      Like
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                          <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                      </svg>
                                  </button>
                                  <p style={{ marginBlock: 'auto', marginInline: '5px' }}>0 | 0</p>
                                  <button type="submit" className='btn btn-dark' disabled>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                          <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                                      </svg>
                                      Dislike
                                  </button>
                                </div>
                              )}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#commentsModal" className='btn btn-dark' >Comments</button>
                                {isLoggedIn && !isAddedToFavorite ? (
                                    <form onSubmit={addToFavorites}>
                                        <button type="submit" className='btn btn-dark'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                                            </svg>
                                            Add to favorites
                                        </button>
                                    </form>
                                ) : isLoggedIn && isAddedToFavorite ? (
                                    <form onSubmit={removeFromFavorites}>
                                        <button type="submit" className='btn btn-dark'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                            Remove from favorites
                                        </button>
                                    </form>
                                ) : (
                                    <button type="submit" className='btn btn-dark' disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                                        </svg>
                                        Add to favorites
                                    </button>
                                )}
                                
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
                                                    alt="SteamApp"
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
                    <h2 style={{ marginBlock: "50vh"}}>Loading...</h2>
                </>
            )}
        </div>
    );
};

export default SteamApp;