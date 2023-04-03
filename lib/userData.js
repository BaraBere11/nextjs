import { getToken } from './authenticate';

async function fetchData(route, method) {
  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    console.log("no" + token)
    return [];
  }
}

export async function addToFavourites(id) {
  return fetchData(`/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return fetchData(`/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return fetchData('/favourites', 'GET');
}

export async function addToHistory(id) {
  return fetchData(`/history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return fetchData(`/history/${id}`, 'DELETE');
}

export async function getHistory() {
  return fetchData('/history', 'GET');
}
