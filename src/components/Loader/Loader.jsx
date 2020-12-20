import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import s from './Loader.module.css';

const Spinner = () => {
  return (
    <div className={s.spinner}>
      <Loader type="Circles" color="#a6c0fe" height={100} width={100} />
    </div>
  );
};

export default Spinner;
