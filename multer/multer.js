const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname)
    }
})

const editedStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const addBanner =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const editBanner = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

module.exports = {
    uploads: multer({ storage: storage }).array('files', 4),
    edituploads: multer({ storage: editedStorage }).fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    addBannerupload:multer({storage:addBanner}).single('image'),
    editBannerupload:multer({storage:editBanner}).single('image1')

}