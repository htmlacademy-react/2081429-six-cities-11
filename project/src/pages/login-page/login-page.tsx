import Logo from '../../components/logo/logo';
import { FormEvent, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginAction } from '../../store/api-action';
import { AuthData } from '../../types/auth-data';
import { AppRoute, AuthorizationStatus, CITIES } from '../../const';
import { redirectToRoute } from '../../store/action';
import { getAuthorizationStatus } from '../../store/user-process/user-selectors';
import { useEffect } from 'react';
import {toast} from 'react-toastify';


function LoginPage(): JSX.Element {

  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(redirectToRoute(AppRoute.Main));
    }
  });

  const [authData, setAuthData] = useState({
    email: '',
    password: '',
  });

  const validatePassword = (password: string): boolean => {
    const isPassword: boolean = (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/).test(password);

    if (!isPassword) {
      toast.info('Password must contain at least one letter and number.');
      return false;
    }
    return true;
  };

  const onSubmit = (data: AuthData) => {
    if (validatePassword(data.password)) {
      dispatch(loginAction(data));
      dispatch(redirectToRoute(AppRoute.Main));
    }
  };

  const fieldChangeHandle = (evt: ChangeEvent<HTMLInputElement | null>) => {
    const {name, value} = evt.target;
    setAuthData({...authData, [name]: value});
  };

  const submitHandle = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    onSubmit({
      login: authData.email,
      password: authData.password,
    });
  };

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <Logo />
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={submitHandle}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input onChange={fieldChangeHandle} className="login__input form__input" type="email" name="email" placeholder="Email" required/>
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input onChange={fieldChangeHandle} className="login__input form__input" type="password" name="password" placeholder="Password" required/>
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to={`/#${CITIES[0]}`}>
                <span>{CITIES[0]}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
