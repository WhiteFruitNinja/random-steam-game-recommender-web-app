import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CommentService from '../service/CommentService';
import UserService from '../service/UserService';

const CommentsComponent = ({ steamAppId }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({}); // State to hold user data
  const [message, setMessage] = useState("");
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [initialCommentList, setInitialCommentList] = useState(0);

  const addInitialCommentList = () => {
    setInitialCommentList(prev => prev + 5);
  }

  const substractInitialCommentList = () => {
    setInitialCommentList(prev => Math.max(prev - 5, 0));
  }

  const fetchComments = (steamAppId) => {
    CommentService.getCommentsBySteamAppId(steamAppId)
      .then(commentList => {
        setComments(commentList);
        return commentList;
      })
      .catch(error => console.error("Error fetching comments:", error));
  };

  const fetchUserNames = (comments) => {
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    
    Promise.all(userIds.map(id => UserService.getUserById(id)))
      .then(usersArray => {
        const usersMap = {};
        usersArray.forEach(user => {
          usersMap[user.id] = user.username; // Adjust if your user object structure is different
        });
        setUsers(usersMap);
      })
      .catch(error => console.error("Error fetching user names:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const commentData = {
      steamAppId,
      message,
      userId
    };

    CommentService.createComment(commentData.steamAppId, commentData.message, commentData.userId)
      .then(() => {
        setMessage(''); // Clear the message after submission
        fetchComments(steamAppId); // Refetch comments to include new one
      })
      .catch(error => console.error("Error submitting comment:", error));
  }

  useEffect(() => {
    // Fetch comments on mount
    fetchComments(steamAppId);
  }, [steamAppId]);

  useEffect(() => {
    // Fetch user names when comments are fetched
    if (comments.length > 0) {
      fetchUserNames(comments);
    }
  }, [comments]);

  return (
      <div>
          <div>
              <div className="modal modal-comments" id="commentsModal" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Comments</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{textAlign: "center"}}>
                      <div>
                        <div> 
                          {comments && comments.length > 0 ? (
                            <>
                              {comments.slice(0).reverse().slice(initialCommentList, initialCommentList + 5).map((comment) => (
                                <div key={comment.id} style={{ display: 'flex', Width: 'auto'}} className="rounded bg-light">
                                      <div style={{ textAlign: "left" }}>
                                        <p style={{ margin: "0" }}>{users[comment.userId] || 'Loading...'} : {comment.message}</p>
                                        <p style={{ fontSize: "12px", margin: "0" }}>{comment.date}</p>
                                      </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p>No comments</p>
                          )}
                        </div>
                        <div style={{display: "flex", margin: "0", justifyContent: "space-between" }}>
                          <button onClick={substractInitialCommentList} disabled={initialCommentList === 0}>Previous</button>
                          <div>{Math.max(Math.ceil(initialCommentList / 5) + 1, 1)}/{Math.max(Math.ceil(comments.length / 5), 1)}</div>
                          <button onClick={addInitialCommentList} disabled={initialCommentList >= comments.length - 5}>Next</button>
                        </div>
                      </div>
                    </div>
                    {isLoggedIn ? (
                    <form onSubmit={handleSubmit} className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <input type="text" placeholder='Add a comment' style={{ width: '76%' }} value={message} onChange={e => setMessage(e.target.value)} required/>
                      <button type="submit" style={{ width: '20%'}}>Comment</button>
                    </form>
                    ) : (<></>)}
                  </div>
                </div>
              </div>
          </div>
      </div>
  );
}

export default CommentsComponent;