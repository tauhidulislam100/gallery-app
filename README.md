# Nuxt Image Gallery with Cloudflare R2 and Photon

A responsive image gallery application built with Nuxt.js, utilizing Cloudflare R2 for storage and Photon for on-the-fly image processing.

## Technology Stack

- **Frontend**: Nuxt.js, Vue.js, Tailwind CSS
- **Storage**: Cloudflare R2 via hubBlob
- **Image Processing**: Cloudflare Photon (@cf-wasm/photon)
- **Deployment**: NuxtHub

## Features

- Responsive image grid with lazy-loaded thumbnails
- On-the-fly image resizing for thumbnails (300px width)
- Full-screen modal view for images
- Navigation between images (keyboard and on-screen controls)
- Loading indicator during image transitions
- Efficient image storage and delivery using Cloudflare R2
- Optimized image loading using Photon for resizing

## Implementation Details

### Nuxt Setup

The application is built on Nuxt.js, with the following key components:

- **ImageGallery.vue**: Main component that displays images in a grid and handles the modal view
- **server/routes/images/[...path].get.ts**: Server endpoint that handles image fetching and resizing
- **api/images**: Endpoint that returns a list of available images

### hubBlob Integration

We use NuxtHub's hubBlob integration to access images stored in Cloudflare R2:

```javascript
// Fetching an image from R2
const image = await hubBlob.get(path);
```

The hubBlob API provides a simple interface for interacting with Cloudflare R2 storage, handling the authentication and retrieval process.

### Photon Integration

For image resizing, we use Cloudflare's Photon library, which efficiently processes images on-the-fly:

```javascript
// Resize an image using Photon
const photonImage = PhotonImage.new_from_byteslice(new Uint8Array(arrayBuffer));
const resizedImage = photonImage.resize(width, height, 3); // Lanczos3 algorithm
const processedBytes = resizedImage.get_bytes();
```

This allows us to store a single high-quality image in R2 and generate appropriately sized versions as needed, saving storage space and improving load times.

## Running Locally

### Prerequisites

- Node.js (v18+)
- Yarn or npm
- NuxtHub account with Cloudflare integration configured

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd image-gallery
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file with your NuxtHub token:

   ```
   NUXTHUB_TOKEN=your_token_here
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

5. Open http://localhost:3000 in your browser

## Deployment with NuxtHub

1. build the application:

   ```bash
   npx nuxi build
   ```

1. Deploy the application:

   ```bash
   npx nuxthub deploy
   ```

1. Once deployed, you can access your application at the provided URL.

## Uploading Images to R2

1. Go to the NuxtHub dashboard
2. Navigate to the Storage section
3. Upload your images to the configured R2 bucket
4. Images will be automatically available in your gallery

## Configuration

The main configuration is done in `nuxt.config.ts`:

```typescript
  modules: ["@nuxthub/core"],
  hub: {
    blob: true,
    bindings: {
      compatibilityFlags: ["nodejs_compat"],
    },
  },
```

## Troubleshooting

- If images aren't loading, check your R2 bucket configuration in the NuxtHub dashboard
- For deployment issues, refer to the NuxtHub documentation at https://hub.nuxt.com/docs
- For Photon-related issues, check the Cloudflare documentation at https://developers.cloudflare.com/workers/runtime-apis/webassembly/photon

## License

MIT
