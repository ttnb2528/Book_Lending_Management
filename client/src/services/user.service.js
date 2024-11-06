import createApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "http://localhost:3000/api/v1/users") {
    this.api = createApiClient(baseUrl);
  }

  async getUsers(data) {
    console.log(data);
    return (await this.api.post("/UserByRole", data)).data;
  }

  async getUser(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async createUser(data) {
    return (await this.api.post("/", data)).data;
  }

  async updateUser(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteUser(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new UserService();
