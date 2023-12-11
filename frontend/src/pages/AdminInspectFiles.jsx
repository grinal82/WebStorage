import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInspectFiles, AdminUpdateFile, deleteInspectedUser, AdminDeleteFile } from '../store/adminReducer'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

export const AdminInspectFiles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newFileName, setNewFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [loaded, setLoaded] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const inspectedUser = useSelector((state) => state.admin.inspectedUser);
  const userFiles = useSelector((state) => state.admin.inspectFiles);
  const loading = useSelector((state) => state.admin.loading);
  const error = useSelector((state) => state.admin.error);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setNewFileName(file.name);
  };

  const handleDelete = async () => {
    await dispatch(AdminDeleteFile({userID:inspectedUser, fileID:selectedFile.id}));
    setSelectedFile(null);
    await dispatch(fetchInspectFiles(inspectedUser)); // Fetch the updated file list
    setLoaded(false);
  }

  const handleRename =  async () => {
    await dispatch(AdminUpdateFile({userID:inspectedUser, fileID:selectedFile.id, message:{name:newFileName}}));
    setSelectedFile(null);
    await dispatch(fetchInspectFiles(inspectedUser)); // Fetch the updated file list
    setLoaded(false);
  }

  const handleGenerateLink = () => {
    
    const fileID = selectedFile.id;
    const link = `http://localhost:8001/files/${fileID}/`;
    setGeneratedLink(link);
  }

  const onCopyLink = () => {
    //NOTE: Basic feedback when link is copied.
    console.log('Link copied successfully!');
    window.alert('Link copied successfully!');
  };

  const handleCopyLink = () => {
    //NOTE: built in clipboard API
    navigator.clipboard.writeText(generatedLink).then(() => {
      onCopyLink();
    });
  };

  const handleGoBack = () => {
    dispatch(deleteInspectedUser());
    navigate(-1);
  };

  return (
    (
        <div className="user-storage">
          <div className="file-list">
            <h2>Files of {user.username.toUpperCase()}</h2>
            <table className='file-table'>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Comment</th>
                  <th>Upload Date</th>
                  <th>Last Download Date</th>
                </tr>
              </thead>
              <tbody>
                {error? <tr><td colSpan="4">{error}</td></tr> : Array.isArray(userFiles) ? (
                  userFiles.map((file) => (
                    <tr className='file' key={file.id} onClick={() => handleFileSelect(file)}>
                      <td>{file.name}</td>
                      <td>{file.comment}</td>
                      <td>{format(new Date(file.upload_date), 'dd/MM/yyyy HH:mm')}</td>
                      <td>{format(new Date(file.last_download_date), 'dd/MM/yyyy HH:mm')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No files uploaded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {selectedFile && (loading ? 
            <div className="preloader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div> :
            <div className="file-details">
              <h4>File Details</h4>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
              <button onClick={handleRename}>Rename</button>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={handleGenerateLink}>Generate Link</button>
              <div className='file_link'>
                <input type="text" value={generatedLink} readOnly />
                <button onClick={handleCopyLink}>Copy Link</button>
              </div>
            </div>
          )}
            <button className='menu-btn' style={{marginTop: '20px',position: 'relative', zIndex: 999}} onClick={handleGoBack}>Go back</button>
        </div>
      )
  )
}
