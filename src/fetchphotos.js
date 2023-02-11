import axios from 'axios';
const API_KEY = `33501552-afbd1499da91adc0272ece80b`;

const fetchPhotos = async (photoName, pageNumber) => {
  return await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${photoName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
  );
};

export default fetchPhotos;
