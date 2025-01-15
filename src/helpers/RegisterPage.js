export function trackReferral() {
  const currentPath = window.location.pathname;

  if (currentPath.includes('/ig/register')) {
    localStorage.setItem('referral', 'ig');
    window.location.replace('/');
  } else if (currentPath.includes('/fb/register')) {
    localStorage.setItem('referral', 'fb');
    window.location.replace('/');
  }
}
