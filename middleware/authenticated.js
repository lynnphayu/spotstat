export default function ({ store, redirect }) {
	console.log(Cookie.get('access_token'))
	if (Cookie.get('access_token')) {
	  return redirect('/auth')
	}
  }