const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

class UploadService {
  constructor() {
    const ffmpegPath = require('ffmpeg-static');
    ffmpeg.setFfmpegPath(ffmpegPath);
  }

  async uploadToS3(fileBuffer, fileName, mimeType) {
    const key = `uploads/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    });
    try {
      await s3.send(command);
      return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async optimizeImage(fileBuffer, mimeType) {
    try {
      let sharpInstance = sharp(fileBuffer);
      const metadata = await sharpInstance.metadata();
      if (metadata.width > 1920 || metadata.height > 1080) {
        sharpInstance = sharpInstance.resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
        return await sharpInstance.jpeg({ quality: 85, progressive: true }).toBuffer();
      } else if (mimeType.includes('png')) {
        return await sharpInstance.png({ compressionLevel: 9 }).toBuffer();
      } else if (mimeType.includes('webp')) {
        return await sharpInstance.webp({ quality: 85 }).toBuffer();
      }
      return await sharpInstance.toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      return fileBuffer;
    }
  }

  async compressVideo(filePath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size('1280x720')
        .videoBitrate('1000k')
        .audioBitrate('128k')
        .fps(30)
        .outputOptions([
          '-preset', 'medium',
          '-crf', '23',
          '-movflags', '+faststart'
        ])
        .on('end', () => {
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('Video compression error:', err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  async processAndUpload(file, options = {}) {
    try {
      const { buffer, originalname, mimetype, size } = file;
      const fileExtension = path.extname(originalname).toLowerCase();
      const fileName = `${uuidv4()}${fileExtension}`;
      let processedBuffer = buffer;
      let finalMimeType = mimetype;
      if (mimetype.startsWith('image/')) {
        processedBuffer = await this.optimizeImage(buffer, mimetype);
      } else if (mimetype.startsWith('video/')) {
        const tempInputPath = `/tmp/${fileName}`;
        const tempOutputPath = `/tmp/compressed-${fileName}`;
        fs.writeFileSync(tempInputPath, buffer);
        await this.compressVideo(tempInputPath, tempOutputPath);
        processedBuffer = fs.readFileSync(tempOutputPath);
        finalMimeType = 'video/mp4';
        fs.unlinkSync(tempInputPath);
        fs.unlinkSync(tempOutputPath);
      }
      const url = await this.uploadToS3(processedBuffer, fileName, finalMimeType);
      return {
        filename: fileName,
        originalName: originalname,
        mimeType: finalMimeType,
        size: processedBuffer.length,
        url: url,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('File processing error:', error);
      throw new Error('Failed to process and upload file');
    }
  }

  async deleteFromS3(url) {
    try {
      const key = url.split('.com/')[1];
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      });
      await s3.send(command);
      return true;
    } catch (error) {
      console.error('S3 delete error:', error);
      return false;
    }
  }

  async generateVideoThumbnail(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['50%'],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '320x240'
        })
        .on('end', () => {
          resolve(outputPath);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}

module.exports = new UploadService(); 