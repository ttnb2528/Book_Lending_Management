import createApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "http://localhost:3000/api/v1/users") {
    this.api = createApiClient(baseUrl);
  }

  async getUsers(data) {
    return (await this.api.post("/UserByRole", data)).data;
  }

  async getUser(id) {
    console.log(id);

    return (await this.api.get(`/${id}`)).data;
  }

  async getCurrentUser() {
    return (await this.api.get("/profile")).data;
  }

  async createUser(data) {
    return (await this.api.post("/", data)).data;
  }

  async updateUser(id, data) {
    console.log(id);
    console.log(data);

    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteUser(id) {
    console.log(id);

    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new UserService();
