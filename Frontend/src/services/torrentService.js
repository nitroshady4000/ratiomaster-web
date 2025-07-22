import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

class TorrentService {
  async getAllTorrents() {
    const response = await axios.get(`${API_BASE_URL}/api/torrent`);
    return response.data;
  }

  async getTorrent(id) {
    const response = await axios.get(`${API_BASE_URL}/api/torrent/${id}`);
    return response.data;
  }

  async addTorrent(torrentData) {
    const response = await axios.post(`${API_BASE_URL}/api/torrent`, torrentData);
    return response.data;
  }

  async startTorrent(id) {
    await axios.post(`${API_BASE_URL}/api/torrent/${id}/start`);
  }

  async stopTorrent(id) {
    await axios.post(`${API_BASE_URL}/api/torrent/${id}/stop`);
  }

  async removeTorrent(id) {
    await axios.delete(`${API_BASE_URL}/api/torrent/${id}`);
  }

  async updateTorrent(id) {
    await axios.post(`${API_BASE_URL}/api/torrent/${id}/update`);
  }

  async getTorrentStatus(id) {
    const response = await axios.get(`${API_BASE_URL}/api/torrent/${id}/status`);
    return response.data;
  }

  async startAllTorrents() {
    await axios.post(`${API_BASE_URL}/api/torrent/start-all`);
  }

  async stopAllTorrents() {
    await axios.post(`${API_BASE_URL}/api/torrent/stop-all`);
  }

  async updateAllTorrents() {
    await axios.post(`${API_BASE_URL}/api/torrent/update-all`);
  }
}

export const torrentService = new TorrentService();
