export const generateGreeting = (currentHour = new Date().getHours()) => {
  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning, ';
  } else if (currentHour >= 12 && currentHour < 16) {
    return 'Good Afternoon, ';
  } else if (currentHour >= 16 && currentHour < 23) {
    return 'Good Evening, ';
  } else {
    return 'Burning the midnight oil? ';
  }
};
