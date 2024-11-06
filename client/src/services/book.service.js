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

  async createBook(data) {
    console.log(data);

    return (await this.api.post("/", data)).data;
  }

  async updateBook(id, data) {
    console.log(id);
    
    console.log(data);
    
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
