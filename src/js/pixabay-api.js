const mainUrl =
  'https://pixabay.com/api/?key=45485539-1e2d85f159a7ac8a3c50871fa';
export const data = searchedValue =>
  fetch(
    `${mainUrl}&q=${searchedValue}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
