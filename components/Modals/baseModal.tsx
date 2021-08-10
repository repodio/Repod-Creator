import { Dialog } from "@headlessui/react";

const Modal = ({ isModalOpen, setIsModalOpen, title, children }) => {
  return (
    /*
      Pass `isModalOpen` to the `open` prop, and use `onClose` to set
      the state back to `false` when the user clicks outside of
      the dialog or presses the escape key.
    */
    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-10" />

        <div className="bg-repod-canvas rounded-lg max-w-sm mx-auto z-20 p-8">
          <Dialog.Title className="text-lg font-semibold text-repod-text-primary py-4">
            {title}
          </Dialog.Title>
          {children}
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
