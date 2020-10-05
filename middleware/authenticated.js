export default function({ store, redirect }) {
  if (document.cookie.indexOf('access_token') == -1) {
    return redirect(
      process.env.NODE_ENV === 'development'
        ? 'https://spotifystat.herokuapp.com/get_token'
        : 'http://localhost:3000/get_token'
    )
  }
}
