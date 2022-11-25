import { useAppSelector } from '../../hooks';
import { getUserData, getAuthorizationStatus } from '../../store/selector';
import { AuthorizationStatus } from '../../const';
import SignIn from '../sign-in/sign';
import SignOut from '../sign-out/sign-out';

function Account(): JSX.Element {

  const user = useAppSelector(getUserData);
  const authStatus = useAppSelector(getAuthorizationStatus);

  const userCheck = user && authStatus === AuthorizationStatus.Auth;


  return(
    <nav className="header__nav">
      {userCheck ? <SignOut /> : <SignIn />}
    </nav>
  );
}

export default Account;
