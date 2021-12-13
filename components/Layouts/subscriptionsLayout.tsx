import React, { useMemo } from "react";
import { useRouter } from "next/router";
import TopTabsLayout from "./topTabLayout";

type LayoutProps = {
  children: JSX.Element;
};

const SubscriptionsLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { showId } = router.query;

  const routes = useMemo(
    () => [
      {
        label: "Membership Tiers",
        url: `/${showId}/subscriptions`,
      },
      {
        label: "Benefits",
        url: `/${showId}/subscriptions/benefits`,
      },
      {
        label: "Welcome Messages",
        url: `/${showId}/subscriptions/welcome`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Memberships" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default SubscriptionsLayout;
