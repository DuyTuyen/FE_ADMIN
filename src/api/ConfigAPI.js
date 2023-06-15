import axios from 'axios'

const axi = axios.create({
  baseURL: `http://127.0.0.1:3000`,
});

const imageAPI = {
  create: (formData) =>
    axi.post(`/v1/image`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
    delete: (id) => axi.delete(`/v1/image/${id}`), 
}
const categoryAPI = {
  getAll: () => axi.get(`/v1/category?queryType=activate`),
  create: (createCategory) =>
    axi.post(`/v1/category`, createCategory, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (id, updateCategory) =>
    axi.put(`/v1/category/${id}`, updateCategory, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/v1/category/${id}`),
};
const productAPI = {
  getAll: () => axi.get(`/v1/product/?queryType=activate`),
  create: (createProduct) =>
    axi.post(`/v1/product`, createProduct, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (updateProduct) =>
    axi.put(`/v1/product/${updateProduct.id}`, updateProduct, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/v1/product/${id}`),
  getPackages: (id) => axi.get(`/v1/product/${id}/package`),
  getBenefits: (id) => axi.get(`/v1/product/${id}/benefit`),

};

const brandAPI = {
  getAll: () => axi.get(`/v1/brand?queryType=activate`),
  create: (createBrand) =>
    axi.post(`/v1/brand`, createBrand, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (id, updateBrand) =>
    axi.put(`/v1/brand/${id}`, updateBrand, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/v1/brand/${id}`),
};

const userAPI = {
  getAll: () => axi.get(`/user/activate`),
  login: (data) =>
    axi.post(`/user/login/admin`, data, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
};

const productPackageAPI = {
  create: (createProductPackage) =>
    axi.post(`/v1/product-package`, createProductPackage, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
};

const productBenefitAPI = {
  create: (createProductBenefit) =>
    axi.post(`/v1/product-benefit`, createProductBenefit, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
};

const benefitValueAPI = {
  update: (id, updateBenefitValue) =>
    axi.put(`/v1/benefit-value/${id}`, updateBenefitValue, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
}

const newsAPI = {
  getAll: () => axi.get(`/v1/news?queryType=activate`),
  create: (createNews) =>
    axi.post(`/v1/news`, createNews, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (updateNews) =>
    axi.put(`/v1/news/${updateNews.id}`, updateNews, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/v1/news/${id}`),
};

const aboutCompanyAPI = {
  getAll: () => axi.get(`/v1/about-company?queryType=activate`),
  create: (createAboutCompany) =>
    axi.post(`/v1/about-company`, createAboutCompany, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (updateAboutCompany) =>
    axi.put(`/v1/about-company/${updateAboutCompany.id}`, updateAboutCompany, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/v1/about-company/${id}`),
};

const solutionAPI = {
  getAll: () => axi.get(`/v1/solution?queryType=activate`),
  create: (createSolution) =>
    axi.post(`/v1/solution`, createSolution, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  update: (updateSolution) =>
    axi.put(`/v1/solution/${updateSolution.id}`, updateSolution, {
      headers: {
        'Content-Type': `application/json`,
      },
    }),
  delete: (id) => axi.delete(`/v1/solution/${id}`),
};

export {
  userAPI,
  brandAPI,
  productAPI,
  categoryAPI,
  imageAPI,
  productPackageAPI,
  productBenefitAPI,
  benefitValueAPI,
  newsAPI,
  aboutCompanyAPI,
  solutionAPI
};