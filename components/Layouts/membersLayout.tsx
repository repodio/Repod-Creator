import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const MembersLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Members",
        url: `/${showId}/members`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Relationship Manager" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default MembersLayout;
