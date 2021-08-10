import Modal from "./baseModal";

const TierBenefitsModal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <Modal
      title="Your Benefits"
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      <p>custom stuff</p>
    </Modal>
  );
};

export default TierBenefitsModal;
