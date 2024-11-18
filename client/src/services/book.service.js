import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "http://localhost:3000/api/v1/book") {
    this.api = createApiClient(baseUrl);
  }

  async getBooks() {
    return (await this.api.get("/")).data;
  }

  async getBook(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    try {
      console.log("Sending data to server:", data); // Debug log
      const response = await this.api.post("/", data);
      console.log("Server response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error in BookService.create:", error);
      throw error;
    }
  }

  async updateBook(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteBook(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async searchBook(query) {
    return (await this.api.get(`/search?search=${query}`)).data;
  }
}

export default new BookService();
