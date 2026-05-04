import React from "react";
import ProfileList from "../components/profilelist/ProfileList";

type ProfileListPageProps = {
  navigate: (path: string) => void;
};

const ProfileListPage = ({ navigate }: ProfileListPageProps) => {
  return <ProfileList navigate={navigate} />;
};

export default ProfileListPage;
