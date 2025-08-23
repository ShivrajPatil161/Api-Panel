import api from "./axiosInstance";

const ENDPOINT = "/outward-transactions";

export const getAllOutwardTransactions = async () => {
  const res = await api.get(ENDPOINT);
  return res.data;
};

export const getOutwardTransactionById = async (id) => {
  const res = await api.get(`${ENDPOINT}/${id}`);
  return res.data;
};

export const createOutwardTransaction = async (data) => {
  const res = await api.post(ENDPOINT, data);
  return res.data;
};

export const updateOutwardTransaction = async (id, data) => {
  const res = await api.put(`${ENDPOINT}/${id}`, data);
  return res.data;
};

export const deleteOutwardTransaction = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};
