import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const TeamLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Members",
        url: `/${showId}/team`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Team" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default TeamLayout;
