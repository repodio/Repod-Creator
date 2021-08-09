import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const DashboardLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Overview",
        url: `/${showId}/console`,
      },
      {
        label: "Followers",
        url: `/${showId}/console/followers`,
      },
    ],
    [showId]
  );

  return (
    <TopTabsLayout title="Dashboard" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default DashboardLayout;
