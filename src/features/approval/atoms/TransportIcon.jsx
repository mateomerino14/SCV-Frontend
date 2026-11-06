import {Plane, Car, Navigation} from 'lucide-react';

function transportKindOf(transport) {
  const value = (transport || '').toLowerCase();
  if (value.includes('aére') || value.includes('aer') || value.includes('avi')) {
    return 'aereo';
  }
  if (value.includes('terrestre') || value.includes('bus') || value.includes('auto')) {
    return 'terrestre';
  }
  return 'otro';
}

function TransportIcon({transport, size = 11, color}) {
  const kind = transportKindOf(transport);
  if (kind === 'aereo') {
    return <Plane size={size} style={{color}} />;
  }
  if (kind === 'terrestre') {
    return <Car size={size} style={{color}} />;
  }
  return <Navigation size={size} style={{color}} />;
}

export default TransportIcon;
