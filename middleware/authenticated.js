import Cookies from 'js-cookie'

export default function ({ store, redirect }) {
  const token = Cookies.get('token')
  if (!token) 
    return redirect('/login')

  var decodedToken = token.decode(token, {complete: true});
  var dateNow = new Date();

  if(decodedToken.exp < dateNow.getTime())
    return redirect('/login')
}