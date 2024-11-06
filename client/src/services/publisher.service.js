import createApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "http://localhost:3000/api/v1/publisher") {
    this.api = createApiClient(baseUrl);
  }

  async getPublishers() {
    return (await this.api.get("/")).data;
  }

  async getPublisher(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async createPublisher(data) {
    console.log(data);

    return (await this.api.post("/", data)).data;
  }

  async updatePublisher(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deletePublisher(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new PublisherService();
