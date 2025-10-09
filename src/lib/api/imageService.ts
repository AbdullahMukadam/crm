import { ImageUploadRequest } from "@/types/proposal";
import { FetchClient } from "./fetchClient";
import { CREATOR_API_ENDPOINTS } from "@/constants/creator";


class ImageService {

    async uploadImage(uploadData: ImageUploadRequest) {
        const formData = new FormData();
        formData.append("image", uploadData.imageFile);
        formData.append("user_id", uploadData.userId);
        return FetchClient.uploadImage(CREATOR_API_ENDPOINTS.UPLOAD_IMAGE, {
            method: "POST",
            body: formData,
        })
    }
}

const imageService = new ImageService();
export default imageService;