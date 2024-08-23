import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryCardTemplate } from './js/render-function';
import { data } from './js/pixabay-api';

const sbmForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtnEl = document.querySelector('.js-load-more');
let searchedValue = '';
let page = 1;
let cardHeight = 0;
let countElLi = 0;

const onFormSbm = async event => {
  event.preventDefault();
  page = 1;
  countElLi = 0;
  searchedValue = sbmForm.elements.user_query.value.trim();

  if (!loadMoreBtnEl.classList.contains('is-hidden')) {
    loadMoreBtnEl.classList.add('is-hidden');
  }

  if (searchedValue === '') {
    iziToast.show({
      message: `❌ Sorry, there are no images matching your search query. Please try again!`,
      color: 'red',
      position: 'topRight',
    });
    return;
  }
  loader.classList.add('is-open');

  const response = await data(searchedValue, page);

  if (response.data.total === 0) {
    loader.classList.remove('is-open');
    sbmForm.reset();
    iziToast.show({
      message: `❌ Sorry, there are no images matching your search query. Please try again!`,
      color: 'red',
      position: 'topRight',
    });
    gallery.innerHTML = '';
    return;
  }

  const galleryCardsTemplate = response.data.hits
    .map(imgDetails => createGalleryCardTemplate(imgDetails))
    .join('');
  sbmForm.reset();
  loader.classList.remove('is-open');
  gallery.innerHTML = galleryCardsTemplate;
  new SimpleLightbox('.gallery-link', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
  loadMoreBtnEl.classList.remove('is-hidden');

  const galleryCardEl = gallery.querySelector('li');
  cardHeight = galleryCardEl.getBoundingClientRect().height;
};

const loadMorePhoto = async event => {
  page += 1;
  loader.classList.add('is-open');
  const loadResponse = await data(searchedValue, page);
  const galleryCardsTemplate = loadResponse.data.hits
    .map(imgDetails => createGalleryCardTemplate(imgDetails))
    .join('');
  gallery.insertAdjacentHTML('beforeend', galleryCardsTemplate);

  new SimpleLightbox('.gallery-link', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();

  loader.classList.remove('is-open');
  scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  countElLi = document.querySelectorAll('.gallery-card');

  if (loadResponse.data.totalHits === countElLi.length) {
    loadMoreBtnEl.classList.add('is-hidden');
    iziToast.show({
      message: `We're sorry, but you've reached the end of search results.`,
      color: 'yellow',
      position: 'topRight',
    });
  }
};

sbmForm.addEventListener('submit', onFormSbm);
loadMoreBtnEl.addEventListener('click', loadMorePhoto);
