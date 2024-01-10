import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { deleteFile, fetchFiles, updateFile, uploadFile } from '../store/filesReducer';
import { BASIC_URL } from '../settings/basic';
import ClipboardJS from 'clipboard'

export const FilesHandler = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userFiles = useSelector((state) => state.files.files);
  const loading = useSelector((state) => state.files.loading);
  const error = useSelector((state) => state.files.error);

  const [loaded, setLoaded] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileComment, setFileComment] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  

  const handleFileSelect = (file)=> {
    setLoaded(true)
    setSelectedFile(file);
    setNewFileName(file.name);
  }

  const handleDelete = async () => {
    await dispatch(deleteFile({fileID:selectedFile.id}));
    setSelectedFile(null);
    await dispatch(fetchFiles()); // Fetch the updated file list after delete
    setLoaded(false);
  }

  const handleRename =  async () => {
    await dispatch(updateFile({fileID:selectedFile.id, message:{name:newFileName}}));
    setSelectedFile(null);
    await dispatch(fetchFiles()); // Fetch the updated file list after rename
    setLoaded(false);
  }

  const handleUpload = async () => {

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', fileToUpload.name);
    formData.append('comment', fileComment);
    formData.append('user', user.username);
    console.log("FormData:", formData);

    await dispatch(uploadFile({ formData }));
    await dispatch(fetchFiles()); // Fetch the updated file list after upload
    setLoaded(false);
  }

  // NOTE: Download functionality
  const handleDownload = () => {

    const fileUUID = selectedFile.uuid;

    const fileDownloadLink = `${BASIC_URL}/files/${fileUUID}/`;
  
    if (fileDownloadLink) {
      // Create a link element
      const link = document.createElement('a');
  
      // Set the href attribute to the download link
      link.href = fileDownloadLink;
  
      // Specify the download attribute and set the file name
      link.download = selectedFile.name;
  
      // Trigger a click on the link to start the download
      document.body.appendChild(link);
      link.click();
  
      // Remove the link from the document
      document.body.removeChild(link);
    }
  };
  

  const handleGenerateLink = () => {
    
    const fileUUID = selectedFile.uuid;
    const link = `${BASIC_URL}/files/${fileUUID}/`;
    setGeneratedLink(link);
  }

  const onCopyLink = () => {
    //NOTE: Basic feedback when link is copied.
    console.log('Link copied successfully!');
    window.alert('Link copied successfully!');
  };

  const handleCopyLink = () => {
    const clipboardInstance = new ClipboardJS('.copy-link-button', {
      text: () => generatedLink
    });
    clipboardInstance.on('success', () => {
      onCopyLink();
      clipboardInstance.destroy();
    });
  };

  const formatFileSize = (sizeInBytes) => {
    const sizeInMegabytes = sizeInBytes / (1024 * 1024); // 1 MB = 1024 KB = 1024 * 1024 bytes
    const formattedSize = sizeInMegabytes.toFixed(2); 
    return `${formattedSize} MB`;
  };
  

  return (
    <div className="user-storage">
      <div className="file-list">
        <h2>Your Files</h2>
        <table className='file-table'>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Comment</th>
              <th>File Size</th>
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
                  <td>{formatFileSize(file.size)}</td>
                  <td>{format(new Date(file.upload_date), 'dd/MM/yyyy HH:mm')}</td>
                  <td>{file.last_download_date ? format(new Date(file.last_download_date), 'dd/MM/yyyy HH:mm') : ''}</td>
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
          <button onClick={handleDownload} disabled={!selectedFile}>
            Download
          </button>
          <div className='file_link'>
            <input type="text" value={generatedLink} readOnly />
            <button className="copy-link-button" onClick={handleCopyLink}>Copy Link</button>
          </div>
        </div>
      )}
      <div className="file-upload">
        <h4>Upload a New File</h4>
        <input
          className="file-input"
          type="file"
          onChange={(e) => {
            console.log('File selected', e.target.files[0]);
            setFileToUpload(e.target.files[0]);
          }}
        />
        <input
          type="text"
          placeholder="File Comment"
          value={fileComment}
          onChange={(e) => setFileComment(e.target.value)}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  )
}
