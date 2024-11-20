import createApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "/api/v1/users") {
    this.api = createApiClient(baseUrl);
  }

  async createUser(data) {
    try {
      const response = await this.api.post("/register", data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error("Email này đã được đăng ký");
      }
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  }

  async getUser(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getUserByRole(role) {
    return (await this.api.post("/UserByRole",  role )).data;
  }

  async getCurrentUser() {
    return (await this.api.get("/profile")).data;
  }

  async updateUser(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async updateCurrentUser(id, data) {
    return (await this.api.put(`/profile/edit/${id}`, data)).data;
  }

  async deleteUser(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new UserService();
