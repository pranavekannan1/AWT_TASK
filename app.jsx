const { useState, useEffect, useMemo } = React;

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Components ---

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-box">
      <i><SearchIcon /></i>
      <input
        type="text"
        placeholder="Search users by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

const UserTable = ({ users }) => {
  if (users.length === 0) {
    return <div className="loading">No users found matching your search.</div>;
  }

  return (
    <div className="glass-panel table-container">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Age</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <div className="user-cell">
                  <img src={user.image} alt={user.firstName} className="user-avatar" loading="lazy" />
                  <div className="user-info">
                    <span className="user-name">{user.firstName} {user.lastName}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="user-email">{user.email}</span>
              </td>
              <td>{user.age}</td>
              <td>
                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <div className="page-info">
        Showing Page {currentPage} of {totalPages || 1}
      </div>
      <div className="page-controls">
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
        </button>
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    role: 'user'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a mock user object matching the API structure
    const newUser = {
      id: Date.now(), // Random unique id for local state
      ...formData,
      age: parseInt(formData.age, 10),
      // Use automated API for random avatar
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}${formData.lastName}`
    };
    
    onAddUser(newUser);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      role: 'user'
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="close-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" name="age" required min="1" max="150" value={formData.age} onChange={handleChange} placeholder="30" />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 10;

  // Fetch initial data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Fetch 50 users from DummyJSON
        const response = await axios.get('https://dummyjson.com/users?limit=50&select=firstName,lastName,email,image,age,company,role');
        setUsers(response.data.users);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.firstName.toLowerCase().includes(query) || 
      user.lastName.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleAddUser = (newUser) => {
    // Add new user to the beginning of the list
    setUsers(prev => [newUser, ...prev]);
  };

  return (
    <>
      <header>
        <h1>Team Directory</h1>
        <p>Manage and browse your organization's members interactively</p>
      </header>

      <main>
        <div className="toolbar">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <button className="btn" onClick={() => setIsModalOpen(true)}>
            <PlusIcon /> Add User
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <UserTable users={paginatedUsers} />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}

        <AddUserModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAddUser={handleAddUser}
        />
      </main>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
