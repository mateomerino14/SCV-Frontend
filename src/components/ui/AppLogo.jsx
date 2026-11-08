import {MAXAM_LOGO} from '../../constants';

function AppLogo() {
  return (
    <div className="text-center pt-2 md:block hidden">
      <img src={MAXAM_LOGO} alt="MAXAM FANEXA" className="h-10 mx-auto object-contain mb-2" />
    </div>
  );
}

export default AppLogo;