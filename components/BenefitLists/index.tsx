import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { PlusSquare, Menu, X } from "react-feather";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import { TierBenefitsModal } from "components/Modals";
import { useRouter } from "next/router";
import { removeBenefitFromSubscription } from "modules/Subscriptions";
import { useDispatch } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

const ItemTypes = {
  CARD: "card",
};

const BenefitCard = ({
  id,
  label,
  subLabel,
  index,
  moveCard,
  handleEditBenefit,
  handleRemoveBenefit,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? "opacity-60" : "opacity-100";

  drag(drop(ref));

  return (
    <div
      key={id}
      ref={ref}
      data-handler-id={handlerId}
      className={`flex flex-row items-center justify-start w-full my-2 py-4 rounded bg-repod-canvas-secondary ${opacity}`}
    >
      <div className="ml-4 cursor-move">
        <Menu className="stroke-current text-repod-text-primary" size={24} />
      </div>
      <div className="flex-1 flex-col items-start justify-start mx-2">
        <p className="truncate text-md font-semibold text-repod-text-primary">
          {label}
        </p>
        <p
          style={{ width: 300 }}
          className="truncate text-sm font-book text-repod-text-secondary"
        >
          {subLabel}
        </p>
      </div>
      <button
        className="mr-4 hover:opacity-50 transition focus:outline-none"
        onClick={handleEditBenefit}
      >
        <p className="uppercase cursor-pointer flex text-center no-underline text-xs font-bold text-info">
          Edit
        </p>
      </button>
      <button className="mr-4 hover:opacity-50 transition focus:outline-none">
        <X
          onClick={handleRemoveBenefit}
          className="stroke-current text-repod-text-secondary"
          size={24}
        />
      </button>
    </div>
  );
};

const BenefitsList = ({ benefits, setBenefits }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBenefitId, setSelectedBenefitId] = useState(null);
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const router = useRouter();
  const { subscriptionTierId } = router.query;
  const subscriptionTierIdString = subscriptionTierId as string;

  useEffect(() => {
    setBenefits(benefits);
  }, [benefits]);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedBenefitId(null);
    }
  }, [isModalOpen]);

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = benefits[dragIndex];

      setBenefits(
        update(benefits, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [benefits]
  );

  const handleEditBenefit = (benefitId) => {
    setSelectedBenefitId(benefitId);
    setIsModalOpen(true);
  };

  const handleRemoveBenefit = (benefitId) => {
    dispatch(
      removeBenefitFromSubscription({
        benefitId,
        subscriptionTierId: subscriptionTierIdString,
      })
    );
  };

  const renderCard = (benefit, index) => {
    return (
      <BenefitCard
        key={benefit.benefitId}
        index={index}
        id={benefit.benefitId}
        label={benefit.title}
        subLabel={benefit.rssFeed}
        moveCard={moveCard}
        handleEditBenefit={() => handleEditBenefit(benefit.benefitId)}
        handleRemoveBenefit={() => handleRemoveBenefit(benefit.benefitId)}
      />
    );
  };

  return (
    <div className={`flex flex-col w-full`}>
      {benefits.map((card, i) => renderCard(card, i))}

      {selectedBenefitId ? (
        <TierBenefitsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          initialBenefitId={selectedBenefitId}
          initialScreen={TierBenefitsModal.Types.editBenefit}
        />
      ) : null}
    </div>
  );
};

export default BenefitsList;
