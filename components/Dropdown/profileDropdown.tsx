import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "firebaseHelpers/useAuth";
import { selectors as authSelectors } from "modules/Auth";
import { Menu, Transition } from "@headlessui/react";
import { MoreHorizontal } from "react-feather";

const ProfileDropdown = ({
  lightMode = true,
  expanded = true,
}: {
  lightMode: boolean;
  expanded: boolean;
}) => {
  const profile = useSelector(authSelectors.getAuthedProfile);

  const { signOut } = useAuth();

  if (!profile) {
    console.error("ProfileDropdown error, need to upsert user record");
    return (
      <button onClick={signOut} className="">
        log out
      </button>
    );
  }

  const color = lightMode
    ? "text-repod-text-primary"
    : "text-repod-text-alternative";

  return (
    <div>
      <Menu as="div" className="relative text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="inline-flex justify-between items-center w-full px-4 py-2 text-lg text-repod-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <div className="flex flex-row justify-center items-center">
                  <img
                    className="w-10 rounded-full"
                    src={profile.avatarUrl}
                    alt="Repod Logo"
                  />
                  {expanded ? (
                    <p className={`ml-4 text-md ${color}`}>
                      {profile.displayName}
                    </p>
                  ) : null}
                </div>
                {expanded ? (
                  <div>
                    <MoreHorizontal
                      className="stroke-current text-repod-text-alternative"
                      size={24}
                    />
                  </div>
                ) : null}
              </Menu.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={signOut}
                        className={`${
                          active ? "bg-repod-canvas-secondary" : ""
                        } group flex rounded-md items-center w-full px-2 py-2 text-md text-repod-text-primary`}
                      >
                        Log out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default ProfileDropdown;
