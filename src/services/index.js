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
};

export default apiService;
