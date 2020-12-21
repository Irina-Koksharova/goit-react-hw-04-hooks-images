import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import s from './Searchbar.module.css';
import {
  clientErrorEmptyQuery,
  showNotification,
} from '../../services/notification/notification';

const SearchBar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChangeForm = e => {
    setSearchQuery(e.target.value);
  };

  const handleSubmitForm = e => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      showNotification(clientErrorEmptyQuery);
    }
    onSubmit(searchQuery);
    setSearchQuery('');
  };

  return (
    <header className={s.container}>
      <form className={s.form} onSubmit={handleSubmitForm}>
        <button className={s.button} type="submit">
          <IconContext.Provider value={{ className: `${s.reactIcons}` }}>
            <FiSearch />
          </IconContext.Provider>
        </button>

        <label className={s.label}>
          <input
            className={s.input}
            type="text"
            name="searchQuery"
            value={searchQuery}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={handleChangeForm}
          />
        </label>
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
