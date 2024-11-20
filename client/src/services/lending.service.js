import createApiClient from "./api.service";

class LendingService {
  constructor(baseUrl = "http://localhost:3000/api/v1/lending") {
    this.api = createApiClient(baseUrl);
  }

  async getLendings() {
    return (await this.api.get("/")).data;
  }

  async getLending(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getLendingsByMaDocGia(MaDocGia) {
    return (await this.api.get(`/lendings/${MaDocGia}`)).data;
  }

  async createLending(data) {
    console.log(data);

    return (await this.api.post("/", data)).data;
  }

  async updateLending(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteLending(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new LendingService();
