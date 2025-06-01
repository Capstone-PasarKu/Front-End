export const getProducts = async () => {
  const res = await fetch("http://localhost:5000/api/products");
  const data = await res.json();
  return data;
};

export const registerUser = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  const res = await fetch("https://pasarku-backend.vercel.app/api/register", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Register gagal");
  return res.json();
};

export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  const res = await fetch("https://pasarku-backend.vercel.app/api/login", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Login gagal");
  return res.json();
};