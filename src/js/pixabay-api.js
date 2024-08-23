import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

export const data = (searchedValue, pages) => {
  const axiosOptions = {
    params: {
      key: '45485539-1e2d85f159a7ac8a3c50871fa',
      q: searchedValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: pages,
      per_page: 15,
    },
  };

  return axios.get('api/', axiosOptions);
};
