import axios from 'axios'

const axi = axios.create({
  baseURL: `http://127.0.0.1:3003`,
});
const categoryAPI = {
  getAll: () => axi.get(`/category`),
  create: (formData) =>
    axi.post(`/category`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
  update: (id, formData) =>
    axi.put(`/category/${id}`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
  delete: (id) => axi.delete(`/category/${id}`),
};
const productAPI = {
  getAll: () => axi.get(`/product`),
  create: (data) =>
    axi.post(`/product`, data, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (data) =>
    axi.put(`/product/${data.id}`, data, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/product/${id}`)
};

const productDetailAPI = {
  update: (id, formData) =>
    axi.put(`/productDetail/${id}`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
};

const brandAPI = {
  getAll: () => axi.get(`/brand`),
};

const userAPI = {
  login: (formData) =>
    axi.post(`/user/login`, formData, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
};

export { categoryAPI, productAPI, brandAPI, userAPI, productDetailAPI };