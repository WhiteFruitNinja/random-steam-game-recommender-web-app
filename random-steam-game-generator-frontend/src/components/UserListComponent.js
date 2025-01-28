const UserListComponent = () => {
    const [users, setUsers] = useState([]); // Initializing to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                // Ensure response structure is what you expect
                if (response && response.data && response.data.data) {
                    setUsers(response.data.data); // Setting users if response is valid
                } else {
                    setUsers([]); // Reset users to empty if no data found
                }
            } catch (error) {
                setError('Error fetching users!');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Loading state
    if (loading) return <div>Loading...</div>;

    // Error state
    if (error) return <div>{error}</div>;

    // Empty state
    if (!users.length) return <div>No users available</div>;

    // Rendering the users
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserListComponent;