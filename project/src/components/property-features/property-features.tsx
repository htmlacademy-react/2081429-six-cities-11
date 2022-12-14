import { capitalizeFirstLetter, pluralCheck } from '../../utils';
import { Offer } from '../../types/offers';
import { AppRoute, AuthorizationStatus, RATING_COEF } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAuthorizationStatus } from '../../store/user-process/user-selectors';
import { redirectToRoute } from '../../store/action';
import { changeFavoriteStatusAction } from '../../store/api-action';
import { changeFavoriteOffersNumber } from '../../store/data-process/data-process';


type propertyFeatures = {
  offer: Offer;
}

function PropertyFeatures({ offer }: propertyFeatures): JSX.Element {

  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(getAuthorizationStatus);

  const hadnleFavoriteButtonClick = () => {
    if (authStatus !== AuthorizationStatus.Auth) {
      dispatch(redirectToRoute(AppRoute.Login));
    }

    dispatch(changeFavoriteStatusAction({
      id: offer.id,
      status: Number(!offer.isFavorite),
    }));
    dispatch(changeFavoriteOffersNumber(!offer.isFavorite));
  };

  return (
    <div className="property__wrapper">
      {offer.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className="property__name-wrapper">
        <h1 className="property__name">
          {offer.title}
        </h1>
        <button className={`property__bookmark-button ${offer.isFavorite && authStatus === AuthorizationStatus.Auth ? 'property__bookmark-button--active' : ''} button`} type="button" onClick={hadnleFavoriteButtonClick}>
          <svg className="place-card__bookmark-icon" width="31" height="33">
            <use xlinkHref="#icon-bookmark"></use>
          </svg>
          <span className="visually-hidden">To bookmarks</span>
        </button>
      </div>
      <div className="property__rating rating">
        <div className="property__stars rating__stars">
          <span style={{ 'width': `${Math.round(offer.rating) * RATING_COEF}%` }}></span>
          <span className="visually-hidden">Rating</span>
        </div>
        <span className="property__rating-value rating__value">{offer.rating }</span>
      </div>
      <ul className="property__features">
        <li className="property__feature property__feature--entire">
          {capitalizeFirstLetter(offer.type)}
        </li>
        <li className="property__feature property__feature--bedrooms">
          {offer.bedrooms} {pluralCheck(offer.bedrooms, 'Bedroom')}
        </li>
        <li className="property__feature property__feature--adults">
          Max {offer.maxAdults} {pluralCheck(offer.maxAdults, 'adult')}
        </li>
      </ul>
      <div className="property__price">
        <b className="property__price-value">&euro;{offer.price}</b>
        <span className="property__price-text">&nbsp;night</span>
      </div>
      <div className="property__inside">
        <h2 className="property__inside-title">What&apos;s inside</h2>
        <ul className="property__inside-list">
          {offer.goods.map((item) => (
            <li key={item} className="property__inside-item">
              {item}
            </li>)
          )}
        </ul>
      </div>
    </div>
  );
}

export default PropertyFeatures;

