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
        label: "Subscription Tiers",
        url: `/subscriptions/${showId}`,
      },
      {
        label: "Benefits",
        url: `/subscriptions/${showId}/benefits`,
      },
    ],
    [showId]
  );
  return (
    <TopTabsLayout title="Subscriptions" routes={routes}>
      {children}
    </TopTabsLayout>
  );
};

export default SubscriptionsLayout;
