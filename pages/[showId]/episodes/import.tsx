import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";

import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { useMediaQuery } from "react-responsive";
import { fetchMembers } from "utils/repodAPI";
import { ArrowLeft, Link as LinkIcon } from "react-feather";
import Link from "next/link";
import { Button } from "components/Buttons";

const PAGE_COPY = {
  PageTitle: "Import and sync your premium RSS feed",
  QuestionTitle: "Paste the URL of your current premium RSS feed",
  QuestionSubtitle: "We’ll sync this feed and fetch new episodes every hour",
  Placeholder: "Paste your premium RSS feed",
  ButtonLabel: "Start Import",
};

const Episodes = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }

      const newMembers = await fetchMembers({ showId: showIdString });

      console.log("newMembers: ", newMembers);

      setMembers(newMembers);

      setPageLoading(false);
    })();
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const subscriptionRSSFeed = null;

  return (
    <>
      <div className={`mt-6 mb-8 w-full ${isMobile ? "ml-4" : "ml-8"}`}>
        <Link href={`/${showId}/episodes`}>
          <a
            className={`text-lg font-semibold text-repod-text-primary flex flex-row items-center py-4 hover:opacity-50 transition`}
          >
            <ArrowLeft
              className="mr-2 stroke-current text-repod-text-primary"
              size={24}
            />
            Go Back
          </a>
        </Link>
      </div>
      <div
        className={`flex flex-col items-start w-full pt-6 ${
          isMobile ? "px-4" : "px-8"
        }`}
      >
        <p className="text-2xl font-bold text-repod-text-primary text-left mb-8">
          {PAGE_COPY.PageTitle}
        </p>
        <div className="flex flex-row items-start w-full pb-12">
          <div className="rounded-lg border border-repod-border-light flex flex-col items-start justify-center px-9 py-12 w-full">
            <p className="text-xl font-bold text-repod-text-primary text-left">
              {PAGE_COPY.QuestionTitle}
            </p>
            <p className="text-repod-text-secondary text-lg text-left mb-4">
              {PAGE_COPY.QuestionSubtitle}
            </p>
            <div className="w-full flex relative justify-start items-center mb-6">
              <LinkIcon
                className="ml-2 absolute stroke-current text-repod-text-secondary "
                size={24}
              />

              <input
                className={`w-full font-semibold text-lg pl-10 pr-6 h-12 bg-repod-canvas-secondary border-2 rounded-lg border-repod-border-medium text-repod-text-primary focus:border-info focus:outline-none`}
                type="search"
                value={value}
                placeholder={PAGE_COPY.Placeholder}
                onChange={(event) => {
                  setValue(event.target.value);
                }}
              />
            </div>
            <Button.Medium
              className="bg-info text-repod-text-alternative uppercase text-sm tracking-wide"
              style={{ minWidth: 300, maxWidth: 300, width: 300 }}
              onClick={() => {}}
            >
              {PAGE_COPY.ButtonLabel}
            </Button.Medium>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Episodes);
