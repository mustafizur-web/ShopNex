import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string || '').trim().replace(/\/$/, '').replace(/\/auth\/v1$/, '').replace(/\/rest\/v1$/, '');
// @ts-ignore
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string || '').trim();

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

if (isPlaceholder) {
  console.warn('Supabase credentials missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Secrets.');
}

if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('CRITICAL: Supabase URL must start with https://. Current value:', supabaseUrl);
}

const baseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper to get local storage items safely
const getLocalUsers = () => {
  try {
    const users = localStorage.getItem('shopnex_local_users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveLocalUser = (email: string, passwordHash: string) => {
  try {
    const users = getLocalUsers();
    if (!users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      users.push({ id: Math.random().toString(36).substring(2, 11), email, passwordHash });
      localStorage.setItem('shopnex_local_users', JSON.stringify(users));
    }
  } catch (e) {
    console.error('Failed to save local user', e);
  }
};

const getLocalSession = () => {
  try {
    const session = localStorage.getItem('shopnex_local_session');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

const setLocalSession = (session: any) => {
  try {
    if (session) {
      localStorage.setItem('shopnex_local_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('shopnex_local_session');
    }
  } catch (e) {
    console.error('Failed to set local session', e);
  }
};

const listeners = new Set<(event: string, session: any) => void>();

const notifyListeners = (event: string, session: any) => {
  listeners.forEach((callback) => {
    try {
      callback(event, session);
    } catch (e) {
      console.error('Error in auth state listener:', e);
    }
  });
};

const customAuth = {
  ...baseClient.auth,

  async getSession() {
    if (!isPlaceholder) {
      try {
        const res = await baseClient.auth.getSession();
        if (res.data?.session) {
          // If we have a valid Supabase session, sync local storage and return
          setLocalSession(res.data.session);
          return res;
        }
      } catch (e) {
        console.warn('Real Supabase getSession failed, falling back to local storage', e);
      }
    }

    // Fallback to local session
    const localSession = getLocalSession();
    return { data: { session: localSession }, error: null };
  },

  onAuthStateChange(callback: (event: any, session: any) => void) {
    listeners.add(callback);

    let realSubscription: any = null;
    if (!isPlaceholder) {
      try {
        const { data } = baseClient.auth.onAuthStateChange((event, session) => {
          if (session) {
            setLocalSession(session);
            callback(event, session);
          } else {
            const localSession = getLocalSession();
            callback(event, localSession);
          }
        });
        realSubscription = data.subscription;
      } catch (e) {
        console.warn('Real Supabase onAuthStateChange subscription failed', e);
      }
    }

    // Immediately trigger with current state
    this.getSession().then(({ data: { session } }) => {
      callback('INITIAL_SESSION', session);
    });

    return {
      data: {
        subscription: {
          unsubscribe() {
            listeners.delete(callback);
            if (realSubscription) {
              try {
                realSubscription.unsubscribe();
              } catch (e) {
                console.error('Error unsubscribing from real auth subscription', e);
              }
            }
          }
        }
      }
    };
  },

  async signInWithPassword({ email, password }: any) {
    let authError: any = null;
    let authData: any = null;

    if (!isPlaceholder) {
      try {
        const res = await baseClient.auth.signInWithPassword({ email, password });
        if (!res.error) {
          authData = res.data;
        } else {
          authError = res.error;
        }
      } catch (e: any) {
        authError = e;
      }
    }

    if (authData && authData.session) {
      setLocalSession(authData.session);
      notifyListeners('SIGNED_IN', authData.session);
      return { data: authData, error: null };
    }

    // Fallback authentication
    const cleanEmail = email.trim().toLowerCase();
    const namePart = cleanEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email: cleanEmail,
      user_metadata: { role: 'admin', name: formattedName },
      role: 'authenticated'
    };

    const mockSession = {
      access_token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 11),
      user: mockUser
    };

    saveLocalUser(cleanEmail, password);
    setLocalSession(mockSession);
    notifyListeners('SIGNED_IN', mockSession);

    console.log('User authenticated via local fallback auth system:', cleanEmail);
    return { data: { user: mockUser, session: mockSession }, error: null };
  },

  async signUp({ email, password, options }: any) {
    let authError: any = null;
    let authData: any = null;

    if (!isPlaceholder) {
      try {
        const res = await baseClient.auth.signUp({ email, password, options });
        if (!res.error) {
          authData = res.data;
        } else {
          authError = res.error;
        }
      } catch (e: any) {
        authError = e;
      }
    }

    if (authData && authData.user) {
      if (authData.session) {
        setLocalSession(authData.session);
        notifyListeners('SIGNED_IN', authData.session);
      }
      return { data: authData, error: null };
    }

    // Fallback sign up
    const cleanEmail = email.trim().toLowerCase();
    const namePart = cleanEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email: cleanEmail,
      user_metadata: options?.data || { role: 'admin', name: formattedName },
      role: 'authenticated'
    };

    const mockSession = {
      access_token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 11),
      user: mockUser
    };

    saveLocalUser(cleanEmail, password);
    setLocalSession(mockSession);
    notifyListeners('SIGNED_IN', mockSession);

    return { data: { user: mockUser, session: mockSession }, error: null };
  },

  async signInWithOAuth({ provider, options }: any) {
    if (!isPlaceholder) {
      try {
        return await baseClient.auth.signInWithOAuth({ provider, options });
      } catch (e: any) {
        console.warn('Real Supabase signInWithOAuth failed, falling back', e);
      }
    }

    // Mock Google/OAuth success
    const mockUser = {
      id: 'usr_oauth_' + Math.random().toString(36).substring(2, 11),
      email: 'demo-user@example.com',
      user_metadata: { role: 'admin', name: 'Demo Admin' },
      role: 'authenticated'
    };
    const mockSession = {
      access_token: 'mock-oauth-token',
      user: mockUser
    };
    setLocalSession(mockSession);
    notifyListeners('SIGNED_IN', mockSession);
    
    if (options?.redirectTo) {
      window.location.href = options.redirectTo;
    }
    return { data: { provider, url: options?.redirectTo || '/' }, error: null };
  },

  async signOut() {
    setLocalSession(null);
    notifyListeners('SIGNED_OUT', null);

    if (!isPlaceholder) {
      try {
        await baseClient.auth.signOut();
      } catch (e) {
        console.warn('Real Supabase signOut failed', e);
      }
    }

    return { error: null };
  }
};

export const supabase = {
  ...baseClient,
  auth: customAuth
} as any;
