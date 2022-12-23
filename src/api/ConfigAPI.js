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
  getAll: () => axi.get(`/product/admin`),
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
  create: (formData) =>
    axi.post(`/brand`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
  update: (id, formData) =>
    axi.put(`/brand/${id}`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
  delete: (id) => axi.delete(`/brand/${id}`),
};

const userAPI = {
  getAll: () => axi.get(`/user`),
  login: (formData) =>
    axi.post(`/user/login`, formData, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
};

const importOrderAPI = {
  getAll: () => axi.get(`/importorder`),
  create: (data) =>
    axi.post(`/importorder`, data, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
};

const importOrderDetailAPI = {
  getAll: () => axi.get(`/importorder`),
  create: (formData) =>
    axi.post(`/importorder`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
};

export { categoryAPI, productAPI, brandAPI, userAPI, productDetailAPI, importOrderAPI, importOrderDetailAPI };