"use client";

import * as motion from "motion/react-client";
import { useState } from "react";

type Props = {
  status: number;
  changeStatus: (val: boolean, id: string) => void;
  postId?: string;
};

export default function ButtonCheckBox({
  status,
  changeStatus,
  postId = "",
}: Props) {
  const [isOn, setIsOn] = useState(!!status);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    changeStatus(!isOn, postId);
  };

  return (
    <button
      type="button"
      style={{
        ...container,
        justifyContent: "flex-" + (isOn ? "end" : "start"),
      }}
      onClick={toggleSwitch}
    >
      <motion.div
        style={{ ...handle, backgroundColor: isOn ? "#1976d2" : "gray" }}
        // layout
        transition={{
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </button>
  );
}

/**
 * ==============   Styles   ================
 */

const container = {
  width: 60,
  height: 30,
  backgroundColor: "silver",
  borderRadius: 50,
  cursor: "pointer",
  display: "flex",
  padding: 5,
};

const handle = {
  width: 20,
  height: 20,
  // backgroundColor: "#1976d2",
  borderRadius: "50%",
};
