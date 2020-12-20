import PropTypes from 'prop-types';
import s from './Button.module.css';

const Button = ({ page, onClick }) => {
  return (
    <button
      className={s.button}
      type="button"
      onClick={() => {
        onClick(page);
      }}
    >
      Load more
    </button>
  );
};

Button.propTypes = {
  page: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
