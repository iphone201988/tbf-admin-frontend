import React from "react";
import { useGetAdminQuery } from "../../services/authApi";

export interface TopbarProps {
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  showSearch = true,
  searchPlaceholder = "Search here...",
}) => {
  const { data, isLoading, error } = useGetAdminQuery();

  const adminName = data?.data?.admin?.name || "Admin";
  const adminEmail = data?.data?.admin?.adminEmail || "";

  return (
    <div className="topbar">
      <h2 className="title">{title}</h2>

      <div className="topBar-subsection">
        {showSearch && <input type="text" placeholder={searchPlaceholder} className="search" />}

        <div className="profile">
          <div>
            <h4>{isLoading ? "Loading..." : error ? "Admin" : adminName}</h4>
            <p>{isLoading ? "" : error ? "" : adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

