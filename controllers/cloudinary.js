const cloudinary = require('cloudinary').v2

//config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})

exports.uploadImages = async (req, res) => {
  //we are going to send image in the req.body
  try {
    let result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto' //jpeg,png
    })
    res.json({
      public_id: result.public_id,
      url: result.url
    })
  } catch (e) {
    console.log(e)
    res.status(500).send('Something wwnt wrong while trying to upload images')
  }
}

exports.deleteImage = async (req, res) => {
  cloudinary.uploader.destroy(req.body.imageId, (err, _) => {
    if (err) {
      console.log(err)
      res.status(400).send(`Something went wrong: ${err}`)
      return
    }
    res.status(200).send('Image deleted successfully')
  })
}
