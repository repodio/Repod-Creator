import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const TipsLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Tipping",
        url: `/tips/${showId}`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Tips" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default TipsLayout;
