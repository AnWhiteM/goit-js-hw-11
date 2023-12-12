import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();

  if (searchQuery === '') {
    notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  page = 1;
  fetchImages(searchQuery);
});

loadMoreBtn.addEventListener('click', function () {
  const searchQuery = searchForm.searchQuery.value.trim();
  page++;
  fetchImages(searchQuery);
});

async function fetchImages(searchQuery) {
  try {
    const apiKey = '41219195-b77d7854071ed14f024118172';
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );

    if (response.data.hits.length === 0) {
      notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (page === 1) {
      gallery.innerHTML = '';
      notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    const photoCards = response.data.hits.map(image => {
      return `
        <a href="${image.largeImageURL}" class="photo-card" data-lightbox="gallery">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </a>
      `;
    });

    gallery.innerHTML += photoCards.join('');

    loadMoreBtn.style.display = 'block';
    if (response.data.totalHits <= page * 40) {
      loadMoreBtn.style.display = 'none';
      notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const lightbox = new SimpleLightbox('.gallery a');

    const {
      height: cardHeight,
    } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
