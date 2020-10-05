export default function ({ store, redirect }) {
  if (document.cookie.indexOf('access_token') == -1) {
    // return redirect('https://spotifystat.herokuapp.com/get_token')
    return redirect('http://localhost:3000/get_token')
  }
}