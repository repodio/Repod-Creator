import React, { useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { selectors as showsSelectors } from "modules/Shows";
import { useRouter } from "next/router";
import { FollowersTable } from "components/Table";
import { DashboardLayout } from "components/Layouts";
import { useSelector } from "react-redux";
import { Chart } from "components/Chart";
import { OptionsDropdown } from "components/Dropdown";

const TOTAL_CHART_LENGTH = 365;

const TIME_RANGES = {
  year: {
    key: "year",
    optionLabel: "Past Year",
    chartLabel: "Yearly",
    sublabel: "this year",
    days: 365,
  },
  month: {
    key: "month",
    optionLabel: "Past Month",
    chartLabel: "Monthly",
    sublabel: "this month",
    days: 31,
  },
  day: {
    key: "day",
    optionLabel: "Past 7 Days",
    chartLabel: "Daily",
    sublabel: "in the past 7 days",
    days: 7,
  },
};

const TIME_OPTIONS = [TIME_RANGES.day, TIME_RANGES.month, TIME_RANGES.year];

const Dashboard = () => {
  const [timeframeIndex, setTimeframeIndex] = useState(1);
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));

  if (!show) {
    router.replace(`/console/${showIdString}`);
    return null;
  }

  const timeframe = TIME_OPTIONS[timeframeIndex];

  const followers = show.followers || [];
  const chartData = show.yearlyFollowData.slice(
    TOTAL_CHART_LENGTH - timeframe.days,
    TOTAL_CHART_LENGTH
  );

  const pastFollowerCount = chartData && chartData[0].y;
  const currentFollowerCount = chartData && chartData[chartData.length - 1].y;

  const increaseInFollowers = currentFollowerCount - pastFollowerCount;

  return (
    <DashboardLayout>
      <div className="flex flex-col justify-start items-start">
        <p className="text-3xl font-bold text-repod-text-primary">
          {show.totalSubscriptions} Followers
        </p>
        {increaseInFollowers > 0 ? (
          <p className="text-sm font-semibold text-repod-text-secondary">{`+${increaseInFollowers} followers ${timeframe.sublabel}`}</p>
        ) : null}
        <div className="flex flex-col my-12 h-96 w-full">
          <div className="flex flex-row justify-between w-full pr-4">
            <p className="text-lg font-semibold text-repod-text-primary">
              {`${timeframe.chartLabel} Followers`}
            </p>
            <OptionsDropdown
              options={TIME_OPTIONS}
              selectedIndex={timeframeIndex}
              onPress={setTimeframeIndex}
            />
          </div>
          <Chart
            data={[
              {
                id: "Followers",
                data: chartData,
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
