import PropTypes from 'prop-types';
import { Component } from 'react';
import s from './ImageGallery.module.css';
import Spinner from '../Loader';
import ImageGalleryItem from '../ImageGalleryItem';
import Modal from '../Modal';
import Button from '../Button';

class ImageGallery extends Component {
  state = {
    searchQuery: null,
    page: this.props.page,
    status: 'idle',
    modalImageSrc: null,
    modalImageAlt: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.props;
    if (prevProps.searchQuery !== searchQuery) {
      this.setState({ searchQuery: null, page, status: 'pending' });
      searchQuery.trim() !== ''
        ? this.fetchQuery(page)
        : this.setState({ status: 'rejected' });
    }
  }

  fetchQuery = pageNumber => {
    const { searchQuery } = this.props;
    const PUBLIC_URL = 'https://pixabay.com/api/';
    const KEY = '19018418-5cf416ff9d3b144c810bafa25';
    const url = `${PUBLIC_URL}?q=${searchQuery}&page=${pageNumber}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;
    const clientError =
      'Sorry, the service cannot process your request😨. Try again, please';
    const serverError =
      'Sorry, there are some technical problems 😱😱😱. Please, try again later';

    fetch(url)
      .then(res => res.json())
      .then(({ hits }) => {
        if (hits.length === 0) {
          this.setStatusRejected(clientError);
        } else if (this.state.searchQuery === null) {
          this.firstLoading(hits);
        } else {
          this.nextLoading(hits);
        }
      })
      .catch(error => this.setStatusRejected(serverError));
  };

  setStatusRejected = message => {
    const { onError } = this.props;
    this.setState({ status: 'rejected' });
    onError(message);
  };

  firstLoading = data => {
    return this.setState({
      searchQuery: data,
      page: this.state.page + 1,
      status: 'resolved',
    });
  };

  nextLoading = nextData => {
    this.setState(state => {
      return {
        searchQuery: [...state.searchQuery, ...nextData],
        page: this.state.page + 1,
        status: 'resolved',
      };
    });
    this.scrollTo();
  };

  scrollTo = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  openModal = e => {
    if (e.target.nodeName === 'IMG') {
      this.props.onToggleModal();
      const current = this.state.searchQuery.find(
        ({ id }) => id.toString() === e.target.id,
      );
      this.setState({
        modalImageSrc: current.largeImageURL,
        modalImageAlt: current.tags,
      });
    }
  };

  render() {
    const {
      searchQuery,
      status,
      page,
      modalImageSrc,
      modalImageAlt,
    } = this.state;
    const { modalState, onToggleModal } = this.props;

    if (status === 'idle' || status === 'rejected') {
      return <></>;
    }

    if (status === 'pending') {
      return <Spinner />;
    }

    if (status === 'resolved') {
      return (
        <>
          <ul className={s.list} onClick={this.openModal}>
            {searchQuery.map(({ id, webformatURL, tags }) => (
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
              <img
                className={s.image}
                src={modalImageSrc}
                alt={modalImageAlt}
              />
            </Modal>
          )}

          <Button page={page} onClick={this.fetchQuery} />
        </>
      );
    }
  }
}

ImageGallery.propTypes = {
  modalState: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onToggleModal: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default ImageGallery;
