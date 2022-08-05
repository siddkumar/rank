import React from "react";
import BlobManager from "../components/blobs/blobManager";

function Demo() {
  return (
    <div>
      <BlobManager
        blobs={[
          { blobName: "Best", rank: 0 },
          { blobName: "Worst", rank: 1 },
          { blobName: "Mid" , rank: 2}
        ]}
      />
    </div>
  );
}

export default Demo;
