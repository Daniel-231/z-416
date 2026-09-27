import { supabase } from './supabase';

export async function AuthorizationToken() { // Retrieves the current user's authorization token from Supabase session
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("No authorization token found");

  return token;
}

export async function signUpWithEmail(email: string, password: string) { // Signs up a new user with email and password
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
}

export async function signInWithEmail(email: string, password: string) { // Signs in an existing user with email and password
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() { // Signs out the current user
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}