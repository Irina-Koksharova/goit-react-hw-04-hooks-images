import PropTypes from 'prop-types';
import { Component } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import s from './Searchbar.module.css';

class SearchBar extends Component {
  state = {
    searchQuery: '',
  };

  handleChangeForm = e => {
    this.setState({ searchQuery: e.currentTarget.value });
  };

  handleSubmitForm = e => {
    const { searchQuery } = this.state;
    const { onError, onSubmit } = this.props;
    const clientError =
      'Incorrect query! Please enter your request in the correct form';

    e.preventDefault();
    if (searchQuery.trim() === '') {
      onError(clientError);
    }
    onSubmit(searchQuery);
    this.resetForm();
  };

  resetForm = () => {
    this.setState({
      searchQuery: '',
    });
  };

  render() {
    return (
      <header className={s.container}>
        <form className={s.form} onSubmit={this.handleSubmitForm}>
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
              value={this.state.searchQuery}
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
              onChange={this.handleChangeForm}
            />
          </label>
        </form>
      </header>
    );
  }
}

SearchBar.propTypes = {
  onError: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
