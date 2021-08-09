import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const SettingsLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Monetization",
        url: `/${showId}/settings/monetization`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Settings" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default SettingsLayout;
