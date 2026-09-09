import {MAXAM_LOGO} from '../../constants';

function AppLogo() {
  return (
    <div className="text-center pt-2 md:block hidden">
      <img src={MAXAM_LOGO} alt="Maxam" className="h-14 mx-auto object-contain rounded-xl mb-2" />
    </div>
  );
}

export default AppLogo;