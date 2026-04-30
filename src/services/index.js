import { Fetch } from "@/helpers/fetchWrapper";

const apiService = {
  _url: import.meta.env.VITE_API_URL,

  async getHostels() {
    return await Fetch.get(`${this._url}/locations/hostels`);
  },
  async getCampuses() {
    return await Fetch.get(`${this._url}/locations/campuses`);
  },
  async getGrounds() {
    return await Fetch.get(`${this._url}/locations/grounds`);
  },
  async getGates() {
    return await Fetch.get(`${this._url}/locations/gates`);
  },
  async getRoutes() {
    return await Fetch.get(`${this._url}/routes/get-all-routes`);
  },
  async getLiveBuses() {
    return await Fetch.get(`${this._url}/buses/get-live-buses`);
  },
  async signup(userData) {
    return await Fetch.post(`${this._url}/auth/signup`, userData);
  },
  async verifyOTP(email, otp) {
    return await Fetch.post(`${this._url}/auth/verify-otp`, { email, otp });
  },
  async signin(email, password) {
    return await Fetch.post(`${this._url}/auth/signin`, { email, password });
  },
  async getProfile() {
    return await Fetch.get(`${this._url}/auth/me`);
  },
  async forgotPassword(email) {
    return await Fetch.post(`${this._url}/auth/forgot-password`, { email });
  },
  async resetPassword(email,otp,password) {
    return await Fetch.post(`${this._url}/auth/reset-password`, { email,otp,password });
  },
  async getLostAndFound() {
    return await Fetch.get(`${this._url}/lost-found`);
  },
  async addLostAndFound(itemData) {
    return await Fetch.post(`${this._url}/lost-found`, itemData);
  },
  async updateLostAndFound(id, itemData) {
    return await Fetch.put(`${this._url}/lost-found/${id}`, itemData);
  },
  async deleteLostAndFound(id) {
    return await Fetch.delete(`${this._url}/lost-found/${id}`);
  },
  async createReport(reportData) {
    return await Fetch.post(`${this._url}/reports`, reportData);
  },
  async getReports() {
    return await Fetch.get(`${this._url}/reports`);
  },
  async getMyReports() {
    return await Fetch.get(`${this._url}/reports/me`);
  },
  async updateReportStatus(id, status) {
    return await Fetch.put(`${this._url}/reports/${id}`, { status });
  },
};

export default apiService;
