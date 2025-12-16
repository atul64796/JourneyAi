import { createContext, useState } from "react";

export const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("avatar");
  });

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);                 
    localStorage.setItem("avatar", newAvatar); 
  };

  return (
    <AvatarContext.Provider value={{ avatar, updateAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};
