const { R2 } = require('node-cloudflare-r2')


const r2 = new R2({
    accountId: process.env.ACCOUNT_ID,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})
const bucket = r2.bucket(process.env.R2_BUCKET_NAME);
bucket.provideBucketPublicUrl(process.env.R2_PUBLIC_URL);


async function upload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }
        const extension = path.extname(req.file.originalname);

        const fileName =
            `images/${crypto.randomUUID()}${extension}`;

        const result = await bucket.upload(
            req.file.buffer,
            fileName,
            {},
            req.file.mimetype
        );

        return res.json({
            key: result.objectKey,
            url: result.publicUrl,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Faild to upload image" })
    }
}

module.exports = {
    upload
}