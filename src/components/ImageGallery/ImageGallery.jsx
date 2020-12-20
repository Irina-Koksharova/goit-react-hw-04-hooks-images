import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import s from './ImageGallery.module.css';
import Spinner from '../Loader';
import ImageGalleryItem from '../ImageGalleryItem';
import Modal from '../Modal';
import Button from '../Button';

const apiServise = (clientQuery, currentPage) => {
  const PUBLIC_URL = 'https://pixabay.com/api/';
  const KEY = '19018418-5cf416ff9d3b144c810bafa25';
  const url = `${PUBLIC_URL}?q=${clientQuery}&page=${currentPage}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;
  return fetch(url).then(response => response.json());
};

const ImageGallery = ({
  searchQuery,
  currentPage,
  modalState,
  onError,
  onToggleModal,
}) => {
  const [query, setQuery] = useState(null);
  const [page, setPage] = useState(currentPage);
  const [status, setStatus] = useState('idle');
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [modalImageAlt, setModalImageAlt] = useState(null);

  useEffect(() => {
    console.log('Запустился первый useEffect');
    if (!searchQuery) {
      return;
    }
    setStatus('pending');
    setPage(currentPage);
    const clientError =
      'Sorry, the service cannot process your request😨. Try again, please';
    const serverError =
      'Sorry, there are some technical problems 😱😱😱. Please, try again later';

    const setStatusRejected = message => {
      setStatus('rejected');
      onError(message);
    };

    const firstLoading = value => {
      setQuery(value);
      setPage(page => page + 1);
      setStatus('resolved');
    };

    apiServise(searchQuery, currentPage)
      .then(({ hits }) =>
        hits.length === 0 ? setStatusRejected(clientError) : firstLoading(hits),
      )
      .catch(error => {
        setStatus('rejected');
        onError(serverError);
      });

    return () => setStatus('idle');
  }, [currentPage, onError, searchQuery]);

  const openModal = e => {
    if (e.target.nodeName === 'IMG') {
      onToggleModal();
      const current = query.find(({ id }) => id.toString() === e.target.id);
      setModalImageSrc(current.largeImageURL);
      setModalImageAlt(current.tags);
    }
  };

  const loadMore = () => {
    return apiServise(searchQuery, page).then(({ hits }) => {
      setQuery([...query, ...hits]);
      setPage(page => page + 1);
      setStatus('resolved');
    });
  };

  if (status === 'idle' || status === 'rejected') {
    return <></>;
  }

  if (status === 'pending') {
    return <Spinner />;
  }

  if (status === 'resolved') {
    return (
      <>
        <ul className={s.list} onClick={openModal}>
          {query.map(({ id, webformatURL, tags }) => (
            <ImageGalleryItem
              key={id}
              image={webformatURL}
              alt={tags}
              id={id}
            />
          ))}
        </ul>

        {modalState && (
          <Modal onClose={onToggleModal}>
            <img className={s.image} src={modalImageSrc} alt={modalImageAlt} />
          </Modal>
        )}

        <Button page={page} onClick={loadMore} />
      </>
    );
  }
};

ImageGallery.propTypes = {
  modalState: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onToggleModal: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default ImageGallery;
