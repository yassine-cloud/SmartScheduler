const express = require('express');
const router = express.Router();
const fsService = require('../services/fsService'); 


router.get('/:folder/:file', (req, res) => {
  console.log('req from :' + req.get('host'));
  const folder = req.params.folder;
  const file = req.params.file;

  if(folder === 'users') {
    res.sendFile(`${folder}/${file}`, { root: './uploads' });
  }
  
  else {
    res.status(404).send({ message: 'File not found' });
  }

});


router.get('/:folder1/:folder2/:file', async (req, res) => {
  const folder1 = req.params.folder1;
  const folder2 = req.params.folder2;
  const file = req.params.file;
  
  if(await fsService.folderFileExists(`${folder1}/${folder2}/${file}`)){    
    res.sendFile(`${folder1}/${folder2}/${file}`, { root: './uploads' });
  } else {
    res.status(404).send({ message: 'File not found' });
  }
});

module.exports = router;
