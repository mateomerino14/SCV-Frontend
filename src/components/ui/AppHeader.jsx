import FVIcon from './FVIcon';

function AppHeader() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <FVIcon />
      <span className="font-bold font-inter text-lg">SCV</span>
    </div>
  );
}

export default AppHeader;