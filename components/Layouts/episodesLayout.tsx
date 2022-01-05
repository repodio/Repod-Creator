import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const EpisodesLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Episodes",
        url: `/${showId}/episodes`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Premium Episodes" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default EpisodesLayout;
