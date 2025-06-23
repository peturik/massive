import { motion } from "motion/react";
import styled from "styled-components";

type Props = {
  title: string;
  val: string;
  onClose: () => void;
  handler: (evalue: string) => void;
  setVal: (val: string) => void;
};

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ModalCard = styled(motion.div)`
  padding: 20px 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  background-color: #efefef;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.6);
`;

export default function ModalPost({
  title,
  val,
  onClose,
  handler,
  setVal,
}: Props) {
  return (
    <Overlay
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalCard
        className="dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="p-6">
          <div className="flex relative">
            <h2 className="mb-4">{title}</h2>
            <button
              onClick={() => onClose()}
              className=" absolute -top-4 right-2 text-2xl"
            >
              ✘
            </button>
          </div>

          <input
            id="input-add"
            className="dark:bg-slate-900  w-full z-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handler(val);
                onClose();
                setVal("");
              }
            }}
            onChange={(e) => setVal(e.target.value)}
            type="text"
            autoFocus
          />
          <div className="flex justify-center gap-6">
            <button
              className="mt-6 py-2 max-w-40 w-40  bg-blue-500 rounded hover:bg-blue-600"
              type="submit"
              onClick={() => {
                handler(val);
                onClose();
                setVal("");
              }}
            >
              Add
            </button>
            <button
              className="mt-6 py-2 max-w-40 w-40 bg-blue-500 rounded hover:bg-blue-600"
              type="submit"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalCard>
    </Overlay>
  );
}
