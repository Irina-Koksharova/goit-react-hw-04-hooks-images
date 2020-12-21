import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from '../Container';
import SearchBar from '../Searchbar';
import ImageGallery from '../ImageGallery';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const hadleSubmit = queryValue => {
    setSearchQuery(queryValue.toLowerCase());
  };

  return (
    <Container>
      <SearchBar onSubmit={hadleSubmit} />
      <ImageGallery
        searchQuery={searchQuery}
        currentPage={currentPage}
        modalState={showModal}
        onToggleModal={() => setShowModal(!showModal)}
      />
      <ToastContainer autoClose={4500} style={{ width: '700px' }} />
    </Container>
  );
};

export default App;
