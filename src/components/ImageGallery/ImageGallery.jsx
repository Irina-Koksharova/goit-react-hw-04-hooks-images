import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import s from './ImageGallery.module.css';
import {
  clientErrorInvalidQuery,
  serverError,
  showNotification,
} from '../../services/notification/notification';
import { Status } from '../../services/status';
import { apiServise } from '../../services/image-api';
import Spinner from '../Loader';
import ImageGalleryItem from '../ImageGalleryItem';
import Modal from '../Modal';
import Button from '../Button';

const ImageGallery = ({
  searchQuery,
  currentPage,
  modalState,
  onToggleModal,
}) => {
  const [query, setQuery] = useState(null);
  const [page, setPage] = useState(currentPage);
  const [status, setStatus] = useState(Status.IDLE);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [modalImageAlt, setModalImageAlt] = useState(null);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    setStatus(Status.PENDING);
    setPage(currentPage);

    const setStatusRejected = message => {
      setStatus(Status.REJECTED);
      showNotification(message);
    };

    const firstLoading = value => {
      setQuery(value);
      setPage(page => page + 1);
      setStatus(Status.RESOLVED);
    };

    apiServise(searchQuery, currentPage)
      .then(({ hits }) =>
        hits.length === 0
          ? setStatusRejected(clientErrorInvalidQuery)
          : firstLoading(hits),
      )
      .catch(error => {
        setStatusRejected(serverError);
      });

    return () => setStatus(Status.IDLE);
  }, [currentPage, searchQuery]);

  const openModal = e => {
    if (e.target.nodeName === 'IMG') {
      onToggleModal();
      const current = query.find(({ id }) => id.toString() === e.target.id);
      setModalImageSrc(current.largeImageURL);
      setModalImageAlt(current.tags);
    }
  };

  const loadMore = () => {
    apiServise(searchQuery, page).then(({ hits }) => {
      setQuery([...query, ...hits]);
      setPage(page => page + 1);
      setStatus(Status.RESOLVED);
      scrollTo();
    });
  };

  const scrollTo = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  if (status === Status.IDLE || status === Status.REJECTED) {
    return <></>;
  }
  if (status === Status.PENDING) {
    return <Spinner />;
  }

  if (status === Status.RESOLVED) {
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
  onToggleModal: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default ImageGallery;
