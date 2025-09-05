// Enhanced photo management utilities for EcoTala
// Integrates with IPFS for decentralized storage

export type PhotoMetadata = {
  hash: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  timestamp: number;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
};

export type IPFSUploadResult = {
  success: boolean;
  hash?: string;
  error?: string;
  metadata?: PhotoMetadata;
};

// Pinata IPFS integration (free tier available)
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// Helper function to compress image before upload
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // fallback to original
          }
        },
        file.type,
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Get user's geolocation if available
export const getGeolocation = (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(null); // User denied or error
      },
      { timeout: 5000, enableHighAccuracy: true },
    );
  });
};

// Upload to IPFS via Pinata (or fallback to local hash)
export const uploadToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    // Compress image first
    const compressedFile = await compressImage(file);

    // Get geolocation if available
    const geoLocation = await getGeolocation();

    // Create metadata
    const metadata: PhotoMetadata = {
      hash: "", // Will be filled after upload
      fileName: compressedFile.name,
      fileSize: compressedFile.size,
      mimeType: compressedFile.type,
      timestamp: Date.now(),
      geoLocation: geoLocation || undefined,
    };

    // Try IPFS upload if keys are available
    if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      const formData = new FormData();
      formData.append("file", compressedFile);

      const pinataMetadata = JSON.stringify({
        name: `EcoTala_${metadata.timestamp}`,
        keyvalues: {
          app: "EcoTala",
          timestamp: metadata.timestamp.toString(),
          fileSize: metadata.fileSize.toString(),
        },
      });
      formData.append("pinataMetadata", pinataMetadata);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        metadata.hash = result.IpfsHash;

        return {
          success: true,
          hash: result.IpfsHash,
          metadata,
        };
      }
    }

    // Fallback: Generate local hash for demo/development
    const arrayBuffer = await compressedFile.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Use a shortened hash with timestamp for uniqueness
    const localHash = `local_${hashHex.slice(0, 16)}_${metadata.timestamp}`;
    metadata.hash = localHash;

    return {
      success: true,
      hash: localHash,
      metadata,
    };
  } catch (error) {
    console.error("IPFS upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

// Validate photo file
export const validatePhotoFile = (
  file: File,
): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  // Check file format
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Supported formats: JPEG, PNG, WebP, HEIC" };
  }

  return { valid: true };
};

// Generate proof metadata for blockchain
export const generateProofMetadata = (
  photoMetadata: PhotoMetadata,
  actionType: string,
  userAddress: string,
): string => {
  const proof = {
    version: "1.0",
    app: "EcoTala",
    actionType,
    userAddress,
    photoHash: photoMetadata.hash,
    timestamp: photoMetadata.timestamp,
    fileMetadata: {
      fileName: photoMetadata.fileName,
      fileSize: photoMetadata.fileSize,
      mimeType: photoMetadata.mimeType,
    },
    geoLocation: photoMetadata.geoLocation,
    // Add integrity hash
    integrity: generateIntegrityHash(photoMetadata, actionType, userAddress),
  };

  return JSON.stringify(proof);
};

// Generate integrity hash to prevent tampering
const generateIntegrityHash = async (
  photoMetadata: PhotoMetadata,
  actionType: string,
  userAddress: string,
): Promise<string> => {
  const data = `${photoMetadata.hash}:${actionType}:${userAddress}:${photoMetadata.timestamp}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Retrieve IPFS content (for verification/display)
export const getIPFSUrl = (hash: string): string => {
  if (hash.startsWith("local_")) {
    // For local/demo hashes, return a placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#e5e5e5"/>
        <text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#666">
          Demo Photo
        </text>
        <text x="100" y="120" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="#999">
          ${hash.slice(0, 20)}...
        </text>
      </svg>
    `)}`;
  }

  // Use Pinata gateway for IPFS content
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

// Batch upload multiple photos (for future features)
export const batchUploadToIPFS = async (
  files: File[],
): Promise<IPFSUploadResult[]> => {
  const results = await Promise.all(files.map((file) => uploadToIPFS(file)));
  return results;
};
