import React from "react";
import BlobManager from "../components/blobs/blobManager";

function Demo() {
  return (
    <div>
      <BlobManager
        blobs={[
          { blobName: "Best", rank: 0 },
          { blobName: "Worst", rank: 1 },
        ]}
      />
    </div>
  );
}

export default Demo;
