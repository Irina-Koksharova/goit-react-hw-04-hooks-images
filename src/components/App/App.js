import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './App.module.css';
import Container from '../Container';
import SearchBar from '../Searchbar';
import ImageGallery from '../ImageGallery';

class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    showModal: false,
  };

  hadleSubmit = queryValue => {
    this.setState({ searchQuery: queryValue.toLowerCase() });
  };

  showNotification = message => {
    toast.warn(message, { className: `${s.notify}` });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { searchQuery, page, showModal } = this.state;
    return (
      <Container>
        <SearchBar
          onSubmit={this.hadleSubmit}
          onError={this.showNotification}
        />
        <ImageGallery
          searchQuery={searchQuery}
          page={page}
          modalState={showModal}
          onError={this.showNotification}
          onToggleModal={this.toggleModal}
        />
        <ToastContainer autoClose={4500} style={{ width: '700px' }} />
      </Container>
    );
  }
}

export default App;
