import Modal from "./baseModal";
import { Button, MultiSelectButton } from "components/Buttons";
import toast from "react-hot-toast";
import { filter, map } from "lodash/fp";
import { useState } from "react";
import { Loader } from "components/Loading";

type AssignTierModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  episodeIds: string[];
  subscriptionTiers: SubscriptionTierItem[];
  handleAssignTiers: (props: {
    episodeIds: string[];
    subscriptionTierIds: string[];
  }) => void;
};

const AssignTierModal = ({
  isModalOpen,
  setIsModalOpen,
  episodeIds,
  subscriptionTiers,
  handleAssignTiers,
}: AssignTierModalProps) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(filter((selectedId) => selectedId !== id)(selectedIds));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const assignTiers = async () => {
    try {
      setLoading(true);
      await handleAssignTiers({
        episodeIds,
        subscriptionTierIds: selectedIds,
      });
      setLoading(false);

      setIsModalOpen(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("assignTiers error", error);
      toast.error("Something went wrong, try again later");
    }
  };

  const disabled = loading || !selectedIds.length;

  return (
    <Modal
      title={`What tier would you like to assign these ${episodeIds?.length} episodes to?`}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      <div className="w-full flex flex-col items-start justify-start px-4 mb-4">
        {map((subscriptionTier: SubscriptionTierItem) => (
          <div
            key={subscriptionTier.subscriptionTierId}
            className="flex flex-row justify-center items-center  mb-2"
          >
            <MultiSelectButton
              selected={selectedIds.includes(
                subscriptionTier.subscriptionTierId
              )}
              onPress={() => toggleSelect(subscriptionTier.subscriptionTierId)}
            />
            <p className="font-semibold text-repod-text-primary ml-2">
              {subscriptionTier.title}
            </p>
          </div>
        ))(subscriptionTiers)}
      </div>

      <div className="w-full flex flex-row items-center justify-between">
        <Button.Small
          className="bg-repod-canvas text-repod-text-secondary"
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={closeModal}
        >
          Cancel
        </Button.Small>

        <Button.Small
          disabled={disabled}
          className={
            disabled
              ? "bg-repod-disabled-bg text-repod-text-disabled cursor-default flex justify-center items-center"
              : "bg-info text-repod-text-alternative"
          }
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={assignTiers}
        >
          {loading ? <Loader /> : "Add"}
        </Button.Small>
      </div>
    </Modal>
  );
};

export default AssignTierModal;
