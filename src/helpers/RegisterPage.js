export function trackReferral() {
  const currentPath = window.location.pathname;
  const cachedReferral = localStorage.getItem('referral');

  if (!cachedReferral) {
    if (currentPath.includes('/ig/register')) {
      localStorage.setItem('referral', 'ig');
    } else if (currentPath.includes('/fb/register')) {
      localStorage.setItem('referral', 'fb');
    }
    // Agrega más condiciones según lo necesites
  }
}
