import Account from '../../components/account/account';
import Logo from '../../components/logo/logo';
import ListReviews from '../../components/list-reviews/list-reviews';
import ReviewForm from '../../components/review-form/review-form';
import Map from '../../components/map/map';
import ListOffers from '../../components/list-offers/list-offers';
import LoadingOffers from '../../components/loading-offers/loading-offers';
import PropertyFeatures from '../../components/property-features/property-features';
import PropertyHost from '../../components/property-host/property-host';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getSelectedOffer, getOffersNearby, getReviews, getSelectedOfferLoadingStatus } from '../../store/data-process/data-selectors';
import { getAuthorizationStatus } from '../../store/user-process/user-selectors';
import { useEffect } from 'react';
import { fetchSelectedOfferAction, fetchOffersNearbyAction, fetchReviewsAction } from '../../store/api-action';
import { AuthorizationStatus, MAX_PHOTOS_NUMBER, MAX_REVIEWS_NUMBER } from '../../const';
import NotFoundPage from '../not-found-page/not-found-page';

function PropertyPage(): JSX.Element {

  const dispatch = useAppDispatch();

  const isAuthorized = useAppSelector(getAuthorizationStatus);
  const selectedOfferLoadingStatus = useAppSelector(getSelectedOfferLoadingStatus);
  const offersNearby = useAppSelector(getOffersNearby);
  const selectedOffer = useAppSelector(getSelectedOffer);
  const reviewsOnOffer = useAppSelector(getReviews);

  const params = useParams();

  const currentId = Number(params.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    dispatch(fetchSelectedOfferAction(currentId));
    dispatch(fetchOffersNearbyAction(currentId));
    dispatch(fetchReviewsAction(currentId));
  }, [dispatch, currentId]);

  if (selectedOfferLoadingStatus) {
    <LoadingOffers/>;
  }

  if (selectedOffer === undefined) {
    return <NotFoundPage />;
  }

  const offersOnMap = selectedOffer ? [...offersNearby, selectedOffer] : offersNearby;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <Logo />
            <Account />
          </div>
        </div>
      </header>

      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {selectedOffer && selectedOffer.images.slice(0, MAX_PHOTOS_NUMBER).map((image) => (
                <div key ={image} className="property__image-wrapper">
                  <img className="property__image" src={image} alt="Something should be here"/>
                </div>)
              )}
            </div>
          </div>
          <div className="property__container container">
            {selectedOffer && <PropertyFeatures offer={selectedOffer} />}
            {selectedOffer && <PropertyHost offer={selectedOffer}/>}
            <section className="property__reviews reviews">
              <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviewsOnOffer.length > MAX_REVIEWS_NUMBER ? MAX_REVIEWS_NUMBER : reviewsOnOffer.length}</span></h2>
              <ListReviews reviews={reviewsOnOffer} />
              {isAuthorized === AuthorizationStatus.Auth && <ReviewForm offerId={currentId}/>}
            </section>
          </div>
          <section className="property__map map">
            <Map offers={offersOnMap} selectedOffer={selectedOffer} />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              <ListOffers
                offers={offersNearby}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PropertyPage;
