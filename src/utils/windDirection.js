export const getWindDirection = (degrees) => {
  if (degrees >= 337.5 || degrees < 22.5) return 'Nord';
  if (degrees >= 22.5 && degrees < 67.5) return 'Nord-Est';
  if (degrees >= 67.5 && degrees < 112.5) return 'Est';
  if (degrees >= 112.5 && degrees < 157.5) return 'Sud-Est';
  if (degrees >= 157.5 && degrees < 202.5) return 'Sud';
  if (degrees >= 202.5 && degrees < 247.5) return 'Sud-Ouest';
  if (degrees >= 247.5 && degrees < 292.5) return 'Ouest';
  if (degrees >= 292.5 && degrees < 337.5) return 'Nord-Ouest';
  
  return 'Inconnu';
};
