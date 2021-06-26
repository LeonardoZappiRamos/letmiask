import { createContext, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { firebase, auth } from './services/firebase';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

type User = {
  id: string;
  nome: string;
  avatar: string;
}

type AuthConextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthConextType);

function App() {
  const [user, setUse] = useState<User>()

  async function signInWithGoogle() {
    const provider = new firebase.auth.GithubAuthProvider()

    const result = await auth.signInWithPopup(provider)
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;
      if (!displayName || !photoURL) {
        throw new Error("Missing information on Google Account")
      }
      setUse({
        id: uid,
        nome: displayName,
        avatar: photoURL
      })
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
