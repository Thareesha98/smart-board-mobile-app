import api from "./api";

// Upload a single image file
export async function uploadImage(fileUri, folder = "general") {
  const fileType = fileUri.substring(fileUri.lastIndexOf(".") + 1);

  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    type: `image/${fileType}`,
    name: `upload.${fileType}`,
  });

  const res = await api.post(`/files/upload/${folder}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // S3 URL
}

// Upload multiple images
export async function uploadMultipleImages(fileUris = [], folder = "general") {
  const formData = new FormData();

  fileUris.forEach((uri, index) => {
    const ext = uri.substring(uri.lastIndexOf(".") + 1);

    formData.append("files", {
      uri,
      type: `image/${ext}`,
      name: `image_${index}.${ext}`,
    });
  });

  const res = await api.post(`/files/upload-multiple/${folder}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // array of URLs
}
