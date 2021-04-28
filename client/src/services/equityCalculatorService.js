import axios from "axios";

export default {
  getEquities: async (data) => {
    console.log(data);
    let res = await axios.post("/api/evaluate", data);
    return res.data || [];
  },
};
