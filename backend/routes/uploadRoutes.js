const express = require('express');
const router = express.Router();
const fsService = require('../services/fsService'); // Import file system service

// get an uploaded file by the folder and file name
router.get('/:folder/:file', (req, res) => {
  const folder = req.params.folder;
  const file = req.params.file;

  if(folder === 'users') {
    res.sendFile(`${folder}/${file}`, { root: './uploads' });
  }
  
  else {
    res.status(404).send({ message: 'File not found' });
  }

});

// get an uploaded file by the folder and file name
router.get('/:folder1/:folder2/:file', (req, res) => {
  const folder1 = req.params.folder1;
  const folder2 = req.params.folder2;
  const file = req.params.file;
  
  if(fsService.folderFileExists(`${folder1}/${folder2}/${file}`)){    
    res.sendFile(`${folder1}/${folder2}/${file}`, { root: './uploads' });
  }
});

module.exports = router;
