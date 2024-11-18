import axios from "axios";

class UploadService {
  async uploadImage(formData) {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      
      console.log("Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload error details:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error uploading file");
    }
  }
}

export default new UploadService(); 