import { cloudinary } from '../config/cloudinary.js';

const UPLOAD_FOLDERS = {
  avatar: 'joyride/avatars',
  kyc: 'joyride/kyc',
  ride: 'joyride/rides',
  vehicle: 'joyride/vehicles'
};

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} uploadType - Type of upload (avatar, kyc, ride, vehicle)
 * @param {Object} options - Additional Cloudinary options
 * @returns {Promise<Object>} Upload result with secure_url, public_id, etc.
 */
export async function uploadToCloudinary(fileBuffer, uploadType = 'avatar', options = {}) {
  const folder = UPLOAD_FOLDERS[uploadType] || UPLOAD_FOLDERS.avatar;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

/**
 * Delete file from Cloudinary by public_id
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(fileBuffer) {
  return uploadToCloudinary(fileBuffer, 'avatar', {
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
  });
}

/**
 * Upload KYC document
 */
export async function uploadKYCDocument(fileBuffer) {
  return uploadToCloudinary(fileBuffer, 'kyc');
}

/**
 * Upload ride photo
 */
export async function uploadRidePhoto(fileBuffer) {
  return uploadToCloudinary(fileBuffer, 'ride');
}

/**
 * Upload vehicle photo
 */
export async function uploadVehiclePhoto(fileBuffer) {
  return uploadToCloudinary(fileBuffer, 'vehicle');
}
