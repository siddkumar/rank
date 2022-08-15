import React from "react";
import BlobManager from "../components/blobs/blobManager";

function Demo() {
  return (
    <div>
      <BlobManager
        blobs={[
          { name: "Best", rank: 0 },
          { name: "Worst", rank: 1 },
          { name: "Mid", rank: 2 },
        ]}
      />
    </div>
  );
}

export default Demo;
