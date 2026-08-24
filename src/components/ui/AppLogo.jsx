import {MAXAM_LOGO} from '../../constants';

function AppLogo() {
  return (
    <div className="flex justify-center mt-2">
      <img src={MAXAM_LOGO} alt="Maxam" className="h-6 object-contain opacity-70" />
    </div>
  );
}

export default AppLogo;