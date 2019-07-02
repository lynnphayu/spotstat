export default function ({ store, redirect }) {
	console.log(document.cookie)
	if (document.cookie.indexOf('access_token')==-1) {
	  return redirect('https://spotifystat.herokuapp.com/get_token')
	}
  }