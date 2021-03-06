import { Dialog } from "@headlessui/react";
import { useRef } from "react";
import { X } from "react-feather";
import { useMediaQuery } from "react-responsive";

const Modal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  children,
  minWidth = 650,
}) => {
  let completeButtonRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 815px)" });

  return (
    <Dialog
      initialFocus={completeButtonRef}
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-10" />

        <div
          style={isMobile ? {} : { minWidth }}
          className={`bg-repod-canvas rounded-lg max-w-sm mx-auto z-20 my-8 ${
            isMobile ? "p-6" : "p-8 "
          }`}
        >
          <div className="flex flex-row items-start justify-between w-full">
            <Dialog.Title className="text-lg font-semibold text-repod-text-primary pb-4">
              {title}
            </Dialog.Title>

            <button
              className="focus:outline-none"
              ref={completeButtonRef}
              onClick={() => setIsModalOpen(false)}
            >
              <X
                className="stroke-current text-repod-text-secondary"
                size={24}
              />
            </button>
          </div>
          <div className="overflow-y-scroll pr-2" style={{ maxHeight: 550 }}>
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
