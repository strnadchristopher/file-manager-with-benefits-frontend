import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';

function App() {
  const [directoryItems, setDirectoryItems] = useState(['../']);

  const [directoryPath, setDirectoryPath] = useState('/home/christopher/Pictures/wallpapers');
  const [activeDirectoryItem, setActiveDirectoryItem] = useState(-1);
  const [gridMode, setGridMode] = useState(false);
  const loadDirectory = (directoryPath) =>{
    fetch('http://localhost:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: directoryPath
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setDirectoryPath(data.location);
        setDirectoryItems([{type: 'Directory', location: "../", thumbnail: false}, ...data.contents]);
      });
  }

  const requestFileLaunch = (filePath) =>{
    fetch('http://localhost:8000/launch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: filePath
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  }

  useEffect(() =>{
    loadDirectory(directoryPath);
  }, [directoryPath])


  const directoryItemClickHandler = (index) =>{
    console.log(index);
    setActiveDirectoryItem(index);
  }

  const directoryItemDoubleClickHandler = (name, fileType) => {
    switch (fileType){
      case 'Directory':
        console.log(directoryPath + "/" + name)
        if(name === '../'){
          setDirectoryPath(directoryPath.substring(0, directoryPath.lastIndexOf('/')));
          return;
        }
        setDirectoryPath(name);
        break;
      case 'File':
        requestFileLaunch(name);
        break;
    }
    
  }

  return (
    <div className="App">
      <span className="Directory-Path-Text">{directoryPath}</span>
      <div onClick={()=>{setGridMode(!gridMode)}} className="Directory-Display-Type-Toggle">
        {
          gridMode ? <i class="fa-solid fa-bars"></i> : <i class="fa-solid fa-list"></i>
        }
      </div>
      <div className="Directory-Tree">
        {directoryItems && directoryItems.map((item, index) => (
          <DirectoryItem directoryItemClickHandler={directoryItemClickHandler} 
          directoryItemDoubleClickHandler={directoryItemDoubleClickHandler} 
          index={index} 
          isActive={index===activeDirectoryItem} 
          name={item.location}
          fileType={item.type}
          gridMode={gridMode}
          thumbnail={item.thumbnail}
          key={index}/>
        ))}
      </div>
    </div>
  );
}

function DirectoryItem(props){
  const getFileNameFromPath = (path) =>{
    console.log(path)
    if(path === '../'){
      return path;
    }
    return path.substring(path.lastIndexOf('/')+1);
  }
  return(
    <div onClick={()=>{props.directoryItemClickHandler(props.index)}} 
    onDoubleClick={()=>{props.directoryItemDoubleClickHandler(props.name, props.fileType)}} 
    className={props.isActive ? (props.gridMode ? "Directory-Item Directory-Item-Active Directory-Item-Grid" : "Directory-Item Directory-Item-Active") : props.gridMode ? "Directory-Item Directory-Item-Grid" : "Directory-Item"}>
      {props.fileType && props.fileType === "Directory" ? <i class="fa-solid fa-folder"></i> : 
        (props.thumbnail ? <img src={"data:image/png;base64, " + props.thumbnail} alt="thumbnail" /> : <i class="fa-solid fa-file"></i>)
      }
      <p>{props.name && getFileNameFromPath(props.name)}</p>
    </div>
  )
}

export default App;
