import { Link, useLocation, generatePath } from 'react-router-dom';
import { Offer } from '../../types/offers';
import { AppRoute, AuthorizationStatus, RATING_COEF, OFFER_IMAGE, FAVORITE_IMAGE } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAuthorizationStatus } from '../../store/user-process/user-selectors';
import { redirectToRoute } from '../../store/action';
import { changeFavoriteStatusAction } from '../../store/api-action';
import { setCurrentOffer, changeFavoriteOffersNumber } from '../../store/data-process/data-process';

type cardProps ={
  offer: Offer;
};

const getArticleClass = (path: string) => {
  switch (path) {
    case AppRoute.Favorites:
      return 'favorites__card';
    case AppRoute.Room:
      return 'near-places__card';
    default:
      return 'cities__card';
  }
};

const getImageWrapperClass = (path: string) => {
  switch (path) {
    case AppRoute.Favorites:
      return 'favorites__image-wrapper';
    case AppRoute.Room:
      return 'near-places__image-wrapper';
    default:
      return 'cities__image-wrapper';
  }
};

function Card({offer}: cardProps): JSX.Element {

  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(getAuthorizationStatus);

  const {id, previewImage, isPremium, price, title, type, rating, isFavorite} = offer;

  const currentPath = useLocation().pathname;

  const handleHoverOn = () => {
    dispatch(setCurrentOffer(offer));
  };

  const handleHoverAway = () => {
    dispatch(setCurrentOffer(undefined));
  };

  const hadnleFavoriteButtonClick = () => {
    if (authStatus !== AuthorizationStatus.Auth) {
      dispatch(redirectToRoute(AppRoute.Login));
    }

    dispatch(changeFavoriteStatusAction({
      id: id,
      status: Number(!isFavorite),
    }));
    dispatch(changeFavoriteOffersNumber(!isFavorite));
  };

  const selectedOfferPath = generatePath(AppRoute.Room, {id: id.toString()});

  return (
    <article className={`${getArticleClass(currentPath)} place-card`}
      onMouseEnter={handleHoverOn}
      onMouseLeave={handleHoverAway}
    >
      {isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className={`${getImageWrapperClass(currentPath)} place-card__image-wrapper`}>
        <Link to={selectedOfferPath}>
          <img className="place-card__image" src={previewImage} width={`${currentPath === AppRoute.Favorites ? FAVORITE_IMAGE.width : OFFER_IMAGE.width}`} height={`${currentPath === AppRoute.Favorites ? FAVORITE_IMAGE.height : OFFER_IMAGE.height}`} alt="Something should be here"/>
        </Link>
      </div>
      <div className={`${currentPath === AppRoute.Favorites ? 'favorites__card-info' : ''} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button ${isFavorite && authStatus === AuthorizationStatus.Auth ? 'place-card__bookmark-button--active' : ''} button`} type="button" onClick={hadnleFavoriteButtonClick}>
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ 'width': `${Math.round(rating) * RATING_COEF}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offers/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type" defaultValue='Apartment'>{type[0].toUpperCase() + type.slice(1)}</p>
      </div>
    </article>
  );
}

export default Card;
