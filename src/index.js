import './css/styles.css';
import fetchPhotos from './fetchphotos';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.getElementById('search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');

const perPage = 40;

let photos = {};
let pageNumber = 1;
let photoName = '';
let lightBox;

const onLoadMoreHandler = async () => {
  pageNumber += 1;
  photos = await fetchPhotos(photoName, pageNumber).then(
    response => response.data
  );
  onRenderData(photos);
  lightBox.refresh();
  if (perPage * pageNumber >= photos.totalHits) {
    btnRef.classList.remove('load-more-visible');
    return Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

const onRenderData = photos => {
  const readyToRender = photos.hits.map(photo => {
    return `<div class="photo-card">
    <a class='photo-link' href=${photo.largeImageURL}><img src=${photo.webformatURL} alt=${photo.tags} loading="lazy"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${photo.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${photo.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${photo.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${photo.downloads}
      </p>
    </div>
  </div>`;
  });
  galleryRef.insertAdjacentHTML('beforeend', readyToRender.join(''));
};

const onSubmitFormHandler = async event => {
  event.preventDefault();
  btnRef.classList.remove('load-more-visible');
  pageNumber = 1;
  photoName = event.target.elements.searchQuery.value.trim();
  if (!photoName.length) return;
  try {
    photos = await fetchPhotos(photoName, pageNumber).then(
      response => response.data
    );
  } catch {
    console.log('ERROR');
  }
  galleryRef.innerHTML = '';
  if (!photos.hits.length) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
  formRef.reset();
  onRenderData(photos);
  if (perPage * pageNumber >= photos.totalHits) {
    btnRef.classList.remove('load-more-visible');
    return Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  btnRef.classList.add('load-more-visible');
  lightBox = new SimpleLightbox('.photo-link', {});
};

formRef.addEventListener('submit', onSubmitFormHandler);
btnRef.addEventListener('click', onLoadMoreHandler);
