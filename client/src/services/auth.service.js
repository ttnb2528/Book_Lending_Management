import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "http://localhost:3000/api/v1/users") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    return (
      await this.api.post("/auth", data, {
        withCredentials: true,
      })
    ).data;
  }

  async logout() {
    return (await this.api.post("/logout")).data;
  }
}

export default new AuthService();
