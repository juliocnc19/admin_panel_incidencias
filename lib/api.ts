import axios from "axios";

const url = "http://192.168.1.31:3004"

export const api = axios.create({
  baseURL:url
})

