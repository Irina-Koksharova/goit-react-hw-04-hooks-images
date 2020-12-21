const apiServise = (clientQuery, currentPage) => {
  const PUBLIC_URL = 'https://pixabay.com/api/';
  const KEY = '19018418-5cf416ff9d3b144c810bafa25';
  const url = `${PUBLIC_URL}?q=${clientQuery}&page=${currentPage}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;
  return fetch(url).then(response => response.json());
};

export { apiServise };
