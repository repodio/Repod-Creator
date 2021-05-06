import React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { selectors as showsSelectors } from "modules/Shows";
import { useRouter } from "next/router";
import { FollowersTable } from "components/Table";
import { DashboardLayout } from "components/Layouts";
import { useSelector } from "react-redux";
import { Chart } from "components/Chart";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const followers = show.followers || [];
  return (
    <DashboardLayout>
      <div className="flex flex-col justify-start items-start">
        <p className="text-3xl font-bold text-repod-text-primary">
          {followers.length} Followers
        </p>
        <div className="flex flex-col my-12 h-96 w-full">
          <p className="text-lg font-semibold text-repod-text-primary">
            Yearly Followers
          </p>
          <Chart
            data={[
              {
                id: "Followers",
                data: show.yearlyFollowData,
              },
            ]}
          />
        </div>
        <p className="text-lg font-semibold text-repod-text-primary">
          All Followers
        </p>
        <FollowersTable data={followers} />
      </div>
    </DashboardLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
