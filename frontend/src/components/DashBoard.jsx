import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUsers,fetchAdminToggle, fetchDeleteUser } from '../store/adminReducer';

export const DashBoard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const users = useSelector((state) => state.admin.users);
    const loading = useSelector((state) => state.admin.loading);
    const error = useSelector((state) => state.admin.error);

    useEffect(() => {
      dispatch(fetchUsers());
    }, [dispatch]);


    const handleToggleAdmin = async (id, is_staff) => {
      try {
        await dispatch(fetchAdminToggle({userID: id, is_staff: is_staff}));
        await dispatch(fetchUsers());
      } catch (error) {
        console.error(error);
      }
    };

    const handleDeleteUser = async (id) => {
      try {
        console.log("Delete user with id:", id);
        await dispatch(fetchDeleteUser({userID:id}));
        await dispatch(fetchUsers());
      } catch (error) {
        console.error(error);
      }
    };


  
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__content">
          <h2>Users of the application</h2>
          <table className="admin-dashboard__table">
            <thead>
              <tr className='admin-dashboard__table-user'>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Number of files</th>
                <th>Size of files</th>
                <th>Inspect</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <div className="preloader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
              ) : null}
              {error ? (
                <tr>
                  <td>{error}</td>
                </tr>
              ) : users ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={user.is_staff}
                        onChange={() => handleToggleAdmin(user.id, !user.is_staff)}
                      />
                    </td>
                    <td>number of files</td>
                    <td>size of files</td>
                    <td>
                      <button >Inspect</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No users</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  