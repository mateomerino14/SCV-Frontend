import {Plane, Car, Navigation} from 'lucide-react';

function getTransportIcon(transport) {
  const value = (transport || '').toLowerCase();
  if (value.includes('aére') || value.includes('aer') || value.includes('avi')) {
    return Plane;
  }
  if (value.includes('terrestre') || value.includes('bus') || value.includes('auto')) {
    return Car;
  }
  return Navigation;
}

function TransportIcon({transport, size = 11, color}) {
  const Icon = getTransportIcon(transport);
  return <Icon size={size} style={{color}} />;
}

export default TransportIcon;