import { FontAwesome6 } from '@expo/vector-icons';

export default function XLogo({ color, size = 18 }) {
  return <FontAwesome6 name="x-twitter" size={size} color={color} iconStyle="brand" />;
}
