export const localStorageService = {
  setItem: (data, constant) => {
    let dataJson = JSON.stringify(data);
    localStorage.setItem(constant, dataJson);
  },
  getItem: (constant) => {
    let dataJson = localStorage.getItem(constant);
    if (dataJson !== null) {
      return JSON.parse(dataJson);
    } else {
      return null;
    }
  },
  removeItem: (constant) => {
    localStorage.removeItem(constant);
  },
};
