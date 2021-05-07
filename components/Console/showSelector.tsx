import React, { createRef, useState } from "react";
import { ChevronDown } from "react-feather";
import { createPopper } from "@popperjs/core";
import { selectors as showsSelectors } from "modules/Shows";
import { useSelector } from "react-redux";
import { map } from "lodash/fp";
import { Loader } from "components/Loading";

const ShowSelector = ({
  show,
  expanded,
}: {
  show: ShowItem;
  expanded: boolean;
}) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const shows = useSelector(showsSelectors.getClaimedShows);

  const destinationDropdownRef = createRef<HTMLDivElement>();
  const popoverDropdownRef = createRef<HTMLDivElement>();
  const openDropdownPopover = () => {
    createPopper(destinationDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  if (!show) {
    return (
      <div className="m-8 opacity-50">
        <Loader />
      </div>
    );
  }
  return (
    <div className="relative m-4 ">
      <button
        className="flex w-full flex-row justify-between items-center"
        type="button"
        onClick={() => {
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="flex flex-row justify-start items-center">
          <img
            style={{ width: 48, height: 48 }}
            className="w-10 rounded border-white border-2"
            src={show.artworkUrl}
            alt="Repod Logo"
          />
          {expanded ? (
            <p className="ml-4 text-xl text-repod-text-alternative font-bold truncate">
              {show.title}
            </p>
          ) : null}
        </div>
        {expanded ? (
          <ChevronDown
            className="stroke-current text-repod-text-secondary"
            size={24}
          />
        ) : null}
      </button>
      <div className="h-2" ref={destinationDropdownRef} />
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "text-base z-50 float-left p-2 list-none text-left rounded shadow-lg mt-1 bg-repod-canvas"
        }
        style={{ width: "100%", maxWidth: "100%", minWidth: "100%" }}
      >
        {map((claimedShow: ShowItem) => (
          <a
            href={`/console/${claimedShow.showId}`}
            className={
              "rounded bg-repod-canvas hover:bg-repod-canvas-secondary p-2 flex flex-row justify-start items-center"
            }
          >
            <img
              style={{ width: 48, height: 48 }}
              className="w-10 rounded border-white border-2"
              src={claimedShow.artworkUrl}
              alt="Repod Logo"
            />
            <p className="ml-4 text-xl text-repod-text-primary font-bold truncate">
              {claimedShow.title}
            </p>
          </a>
        ))(shows)}
        <div className="h-0 my-2 border border-solid border-t-0 border-repod-border-light" />
        <a
          href="/claim"
          className={
            "rounded bg-repod-canvas hover:bg-repod-canvas-secondary text-lg py-2 px-4 block w-full whitespace-nowrap bg-transparent "
          }
        >
          Claim Another Show
        </a>
      </div>
    </div>
  );
};

export default ShowSelector;
