export default function ({ store, redirect }) {
	console.log(document.cookie)
	if (!document.cookie) {
	  return redirect('https://spotifystat.herokuapp.com/get_token')
	}
  }