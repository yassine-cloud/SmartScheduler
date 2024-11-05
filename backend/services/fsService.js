const fs = require('fs');
const path = require('path');
require('dotenv').config();

const containner = process.env.CONTAINNER;
const mainFolder = path.join(__dirname, '../'+containner);

module.exports = {

    /**
     * Get a file from the uploads directory
     * 
     * @param { String } folder 
     * @param { String } file 
     * @returns { Promise<Buffer> } file data
     */
    getFile(folder, file) {
        return new Promise((resolve, reject) => {
            const filePath = mainFolder + `/${folder}/${file}`;
            fs.readFile(filePath, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });

        });
    },

    /**
     * Check if a file exists in the uploads directory
     * 
     * @param { String } file 
     * 
     * @returns { Promise<Boolean> } true if the file exists, false otherwise
     */
    folderFileExists(file){
        return new Promise((resolve, reject) => {
            const filePath = mainFolder + `/${file}`;
            fs.access(filePath, fs.constants.F_OK, (error) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });

        });

    },

    /**
     * Get all files under a specific folder
     * 
     * @param { String } folder folder name
     * 
     * @returns { Promise<String[]> } filesPath
     */
    async getFilesPaths(folder) {
        return new Promise((resolve, reject) => {
            const folderPath = path.join(mainFolder, folder);
            
            // Check if the folder exists before reading
            if (!fs.existsSync(folderPath)) {
                return resolve([]); // If folder doesn't exist, return an empty array
            }

            fs.readdir(folderPath, (error, files) => {
                if (error) {
                    reject(error); // Reject if there is an error
                } else {
                    const filesPath = files.map(file => `${containner}/${folder}/${file}`);
                    resolve(filesPath); // Resolve with an array of file paths
                }
            });
        });
    },


    /**
     * Generate the URL for the files under a specific folder
     * 
     * @param { Object } req HTTP request object
     * @param { String } folder folder name 
     * 
     * @returns { Promise<String[]> } filesUrl
     */
    async getFilesPathsUrl(req, folder) {
        try {
            const filesPath = await this.getFilesPaths(folder);
            const serverUrl = `${req.protocol}://${req.get('host')}`;
            const filesUrl = filesPath.map(file => `${serverUrl}/${file}`);
            
            // console.log('Files URL:', filesUrl);
            
            return filesUrl; // Return array of file URLs
        } catch (error) {
            console.error("Error fetching file paths:", error);
            return []; // Return an empty array in case of error
        }
    }


}